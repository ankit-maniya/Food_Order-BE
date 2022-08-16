import mongoose, { Document, Schema, Types } from "mongoose";

export interface OrderDoc extends Document {
    OrderId: string;
    items: [any];
    totalAmount: number;
    orderDate: Date;
    paidThrough: string;
    paymentResponse: string;
    orderStatus: string;
}

const OrderSchema = new Schema({
    OrderId: { type: String },
    items: [{
        food: { type: Schema.Types.ObjectId, ref: "food" },
        unit: { type: Number }
    }],
    totalAmount: { type: Number },
    orderDate: { type: Date },
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
}, {
    timestamps: true
})

const Order = mongoose.model<OrderDoc>('order', OrderSchema);

export { Order }
