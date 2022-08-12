import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import { AdminRoute, VandorRoute } from './app/routes';
import { MONGO_URI } from './app/config';

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', AdminRoute)
app.use('/vandor', VandorRoute)

mongoose.connect(MONGO_URI, {}).then( res => {
    console.log('Mongodb connected successfully');
}).catch(err => {
    console.log('Error =>', err);
})

app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000/')
})