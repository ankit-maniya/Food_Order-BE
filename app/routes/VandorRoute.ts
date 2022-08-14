import express, { Request, Response, NextFunction } from 'express';

import { VandorLogin, GetVandorProfile, UpdateVandorProfile, UpdateVandorService, UpdateCoverImages, AddFood, GetFood } from '../controller';
import { Authenticate } from '../middleware';
import { uploadImage } from '../utility';

const router = express.Router();

router.use(Authenticate)
router.post('/login', VandorLogin)
router.get('/profile', GetVandorProfile)
router.patch('/profile', UpdateVandorProfile)
router.patch('/service', UpdateVandorService)
router.patch('/coverImages', uploadImage, UpdateCoverImages)

router.post('/food', uploadImage, AddFood)
router.get('/foods', GetFood)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json(' Vandour router - Root')
})

export { router as VandorRoute }  
