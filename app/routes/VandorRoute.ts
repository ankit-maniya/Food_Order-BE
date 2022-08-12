import express, { Request, Response, NextFunction } from 'express';

import {VandorLogin, GetVandorProfile, UpdateVandorProfile, UpdateVandorService } from '../controller/VandorController';
import { Authenticate } from '../middleware';

const router = express.Router();

router.post('/login', VandorLogin)
router.get('/profile', Authenticate, GetVandorProfile)
router.patch('/profile', Authenticate, UpdateVandorProfile)
router.patch('/service', Authenticate, UpdateVandorService)

router.get('/', (req: Request, res:Response, next: NextFunction) => {
    res.json(' Vandour router - Root')
})

export  { router as VandorRoute }  
