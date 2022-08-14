import express, { Request, Response, NextFunction } from 'express';

import { VandorLogin, GetVandorProfile, UpdateVandorProfile, UpdateVandorService, AddFood } from '../controller/VandorController';
import { Authenticate } from '../middleware';

const router = express.Router();

router.use(Authenticate)
router.post('/login', VandorLogin)
router.get('/profile', GetVandorProfile)
router.patch('/profile', UpdateVandorProfile)
router.patch('/service', UpdateVandorService)

router.post('/food', AddFood)
router.get('/foods')

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json(' Vandour router - Root')
})

export { router as VandorRoute }  
