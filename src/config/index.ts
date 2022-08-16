import { config } from 'dotenv';

config();

export const {
    MONGO_URI,
    APP_SECRATE,
    PORT,
} = process.env as {
  [key: string]: string;
};
