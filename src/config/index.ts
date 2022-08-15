import 'dotenv/config'

export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/online_food";
export const APP_SECRATE = "FOOD_ORDER_BE";
export const PORT = process.env.PORT || 8000;