import mongoose, { Document, Schema, Types } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string;
    vandorId: string;
    items: [any];
    totalAmount: number;
    orderDate: Date;
    paidThrough: string;
    paymentResponse: string;
    orderStatus: string;
    remarks: string;
    deliveryId: string;
    appliedOffers: boolean;
    offerId: string;
    readyTime: number;
}

const OrderSchema = new Schema({
    orderId: { type: String },
    vandorId: { type: String },
    items: [{
        food: { type: Schema.Types.ObjectId, ref: "food" },
        unit: { type: Number }
    }],
    totalAmount: { type: Number },
    orderDate: { type: Date },
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    readyTime: { type: Number },
}, {
    timestamps: true
})

const Order = mongoose.model<OrderDoc>('order', OrderSchema);

export { Order }
