import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { APP_SECRATE } from '../config';

import { AuthPayload } from '../dto/Auth.dto';

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async (password: string, savedPassword: string, salt?: string) => {
    return await bcrypt.compare(password, savedPassword);
}

export const GenerateSignature = async (payload: AuthPayload) => {
    return await jwt.sign(payload, APP_SECRATE, { expiresIn: '10h' })
}

export const validateSignature = async (req: Request) => {
    const signature = req.get('Authorization');

    if (!signature)
        return false

    try {
        req.user = await jwt.verify(signature.split(' ')[1], APP_SECRATE) as AuthPayload;
        return true
    } catch (error) {
        // console.log('JWT Error', error);
        return false
    }
}