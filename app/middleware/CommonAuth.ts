import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { validateSignature } from "../utility";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export const Authenticate = async(req: Request, res: Response, next: NextFunction) => {
    const validateUser = await validateSignature(req);
    
    if(!validateUser)
        return res.json({ message: "Not Authorized User!" })
    next()
}