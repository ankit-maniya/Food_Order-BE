import express from "express";
import App from './app/services/ExpressApp'
import dbConnection from './app/services/Database'


const StartServer = async () => {
    const app = express();

    await dbConnection();

    await App(app);

    app.listen(8000, () => {
        console.log('Server is running on http://localhost:8000/')
    })
}

StartServer();
