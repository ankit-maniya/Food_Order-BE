import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface CustomerDoc extends Document<Types.ObjectId> {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
    token: string;
}

const CustomerSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    salt: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    verified: { type: Boolean },
    otp: { type: Number },
    otp_expiry: { type: String },
    lat: { type: Number },
    lng: { type: Number },
}, {
    timestamps: true
})

const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema);
export { Customer }
