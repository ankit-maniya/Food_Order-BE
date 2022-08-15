import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface VandorDoc extends Document<Types.ObjectId> {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImages: [string];
    rating: number;
    foods: any;
    token: string;
}

const VandorSchema = new Schema({
    name: { type: String },
    ownerName: { type: String },
    foodType: { type: [String] },
    pincode: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    salt: { type: String },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    token: { type: String, default: null },
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food'
    }]
}, {
    timestamps: true
})

const Vandor = mongoose.model<VandorDoc>('vandor', VandorSchema);
export { Vandor }