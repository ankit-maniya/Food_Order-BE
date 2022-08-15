import express from 'express'
import { LogIn, Otp, Profile, SignUp, UpdateProfile, VerifyAccount } from '../controller'
import { Authenticate } from '../middleware'

const router = express.Router()

/* Signup */
router.post('/signup', SignUp)

/* Login */
router.post('/login', LogIn)

/* verify account */
router.use(Authenticate)
router.patch('/verifyaccount', VerifyAccount)

/* OTP */
router.get('/otp', Otp)

/* Profile */
router.get('/profile', Profile)
router.patch('/updateprofile', UpdateProfile)

export { router as CustomerRoute }
