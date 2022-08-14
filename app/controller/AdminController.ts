import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { Vandor } from '../models/index';

import { CreateVandorInput } from '../dto/index.dto';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindVandor = async (_id: Types.ObjectId | string | undefined, email?: string) => {
    if (email)
        return await Vandor.findOne({ email })
    return await Vandor.findById(_id)
}

export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        ownerName,
        foodType,
        pincode,
        address,
        phone,
        email,
        password
    } = <CreateVandorInput>req.body;

    const isExistEmail = await FindVandor(undefined, email)
    if (isExistEmail !== null) {
        return res.json({ message: "Email already exists!" })
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt)

    const createVandor = await Vandor.create({
        name, ownerName: '',
        foodType,
        pincode,
        address,
        phone,
        email,
        password: userPassword,
        salt,
        serviceAvailable: false,
        coverImage: [],
        foods: []
    })

    res.json(createVandor);
}

export const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
    const vandors = await Vandor.find();
    res.json(vandors)
}

export const GetVandorById = async (req: Request, res: Response, next: NextFunction) => {
    const vandorId = req.params.id;

    try {
        const vandor = await FindVandor(vandorId)

        if (vandor)
            return res.json(vandor)

        res.json({ message: "Vandor not found!" })
    } catch (error) {
        if (error instanceof Error)
            return res.json({ message: error.message })

        res.json({ message: "Vandor not found!" })
    }
} 