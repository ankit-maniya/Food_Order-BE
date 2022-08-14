import mongoose, { Document, Schema } from "mongoose";

export interface CustomerDoc extends Document {

}

const CustomerSchema = new Schema({
}, {
    timestamps: true
})

const Customer = mongoose.model<CustomerDoc>('customers', CustomerSchema);

export { Customer }
