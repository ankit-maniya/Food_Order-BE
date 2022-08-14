import { Request, Response, NextFunction } from 'express';

import { Food } from '../models';

import { FindVandor } from './AdminController';

import { VandorLoginInput, VandorServiceUpdateInput, VandorUpdateInput, CreateFoodInput } from '../dto/index.dto';
import { GenerateSignature, ValidatePassword } from '../utility';

export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VandorLoginInput>req.body;

    try {
        if (!email || !password) {
            return res.json({ message: 'Please filled required fields!' });
        }

        let existingVandor = await FindVandor(undefined, email);
        if (!existingVandor)
            return res.json({ message: 'Vandor Not found!' })

        const isValidPassword = await ValidatePassword(password, existingVandor.password);
        if (!isValidPassword)
            return res.json({ message: 'Invalid Password!' })

        const signature = await GenerateSignature({
            _id: existingVandor._id,
            name: existingVandor.name,
            email: existingVandor.email,
            foodtype: existingVandor.foodType
        })

        existingVandor.token = signature;

        res.json(existingVandor);
    } catch (error) {
        res.json({ message: 'Something went wrong in VandorLogin' });
    }
}

export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user)
        try {
            const existingUser = await FindVandor(user._id);
            return res.json(existingUser)
        } catch (error) {
            return res.json({ message: "Some error occure in GetVandorProfile!" })
        }
    return res.json({ message: "Auth token has been expired!" })
}

export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const {
        email,
        name,
        foodtype,
        address,
        phone,
        pincode
    } = <VandorUpdateInput>req.body;

    if (user)
        try {
            const existingUser = await FindVandor(user._id);

            if (existingUser)
                existingUser.email = email;
            existingUser!.address = address;
            existingUser!.name = name;

            const isUpdateUser = await existingUser!.save();
            return res.json(isUpdateUser)
        } catch (error) {
            return res.json({ message: "Some error occure in UpdateVandorProfile!" })
        }
    return res.json({ message: "Auth token has been expired!" })
}

export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { serviceAvailable } = <VandorServiceUpdateInput>req.body;
    if (user)
        try {
            const existingUser = await FindVandor(user._id);

            if (existingUser)
                existingUser.serviceAvailable = serviceAvailable;

            const updatedVandor = await existingUser!.save();
            return res.json(updatedVandor)
        } catch (error) {
            return res.json({ message: "Some error occure in UpdateVandorService!" })
        }
    return res.json({ message: "Auth token has been expired!" })
}

export const UpdateCoverImages = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user)
        try {
            const vandor = await FindVandor(user._id);

            if (!vandor)
                return res.json({ message: "Vandor not found!" })

            const files = req.files as [Express.Multer.File];
            const coverImages = files.map((file: Express.Multer.File) => file.filename);

            vandor.coverImages.push(...coverImages)
            const updatedVandor = await vandor.save();
            return res.json(updatedVandor)
        } catch (error) {
            return res.json({ message: "Some error occure in UpdateCoverImages!" })
        }
    return res.json({ message: "Auth token has been expired!" })
}

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user)
        try {
            const vandor = await FindVandor(user._id);
            if (!vandor)
                return res.json({ message: "Vandor not found!" })

            const {
                category,
                description,
                foodType,
                name,
                price,
                readyTime
            } = <CreateFoodInput>req.body;

            const files = req.files as [Express.Multer.File];
            const images = files.map((file: Express.Multer.File) => file.filename);

            const createFood = await Food.create({
                vandorId: vandor._id,
                name,
                price,
                category,
                readyTime,
                description,
                foodType,
                images: images,
            })

            vandor.foods.push(createFood);
            const result = await vandor.save();

            return res.json(result);
        } catch (error) {
            return res.json({ message: "Some error occure in AddFood!" })
        }
    return res.json({ message: "Auth token has been expired!" })
}

export const GetFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user)
        try {
            const vandor = await FindVandor(user._id);
            if (!vandor)
                return res.json({ message: "Vandor not found!" })

            const allFoods = await Food.find({ vandorId: vandor._id });
            return res.json(allFoods);
        } catch (error) {
            return res.json({ message: "Some error occure in GetFood!" })
        }
    return res.json({ message: "Auth token has been expired!" })
}
