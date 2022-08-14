import { Types } from "mongoose";

export interface CreateVandorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface VandorUpdateInput {
    name: string;
    email: string;
    pincode: string;
    address: string;
    phone: string;
    foodtype?: [string];
}

export interface VandorServiceUpdateInput {
    serviceAvailable: boolean;
}

export interface VandorLoginInput {
    email: string;
    password: string;
}

export interface VandorPayload {
    _id: Types.ObjectId;
    name: string;
    email: string;
    foodtype?: [string];
}