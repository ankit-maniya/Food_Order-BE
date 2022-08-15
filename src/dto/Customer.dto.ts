import { IsEmail, Length, MinLength } from "class-validator";
import { Types } from "mongoose";

export class CreateCustomerInput {

    @IsEmail()
    email: string;

    @Length(10, 12)
    phone: number;

    @Length(6, 12)
    password: string;
}

export class UpdateCustomerInput {

    @Length(3, 12)
    firstName: string;

    @Length(3, 12)
    lastName: string;
    
    @Length(2, 80)
    address: string;
}

export class UserLoginInputs {

    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string;
}

export interface CustomerPayload {
    _id: Types.ObjectId;
    email: string;
    verified: boolean;
}