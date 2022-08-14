import mongoose, { Document, Model, Schema } from "mongoose";

interface FoodDoc extends Document {
    vandorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    images: [string];
}

const FoodSchema = new Schema({
    vandorId: { type: String, required: true },
    name: { type: String },
    description: { type: String, required: true  },
    category: { type: String },
    foodType: { type: String, required: true  },
    readyTime: { type: Number },
    price: { type: Number, required: true  },
    images: { type: [String] },
}, {
    timestamps: true
})

const Food = mongoose.model<FoodDoc>('food', FoodSchema);

export { Food }
