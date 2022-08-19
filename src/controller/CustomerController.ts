import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer'

import { CreateCustomerInput, CreateOrderInputs, UpdateCustomerInput, UserLoginInputs } from '../dto/index.dto';
import { Customer, CustomerDoc, Food } from '../models';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOtp, ValidatePassword, validateSignature } from '../utility';
import { Order } from '../models/Order';

export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInputs = plainToClass(CreateCustomerInput, req.body);
        const inputErrors = await validate(customerInputs, { validationError: { target: false } })

        if (inputErrors.length > 0)
            return res.json(inputErrors);

        const { email, password, phone } = customerInputs;

        const salt = await GenerateSalt();
        const userPassword = await GeneratePassword(password, salt);

        const { otp, expiry } = await GenerateOtp();

        const userExists = await Customer.findOne({ email });
        if (userExists)
            return res.json({ message: "Customer Already Exists with this Email id!" })

        const result = await Customer.create({
            otp,
            otp_expiry: expiry,
            salt,
            email,
            phone,
            password: userPassword,
            firstName: '',
            lastName: '',
            verified: false,
            lat: 0,
            lng: 0,
            order: []
        })

        if (!result)
            return res.json({ message: "Customer Not Created!" })

        // json OTP to customer
        // await onRequestOtp(otp, phone)

        // Create Signature
        const signature = await GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })

        const customerRes = {
            signature,
            email: result.email,
            verified: result.verified
        }

        return res.json(customerRes)
    } catch (error) {
        return res.json({ message: "Something wrong in SignUp" })
    }
}

export const LogIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginInputs = plainToClass(UserLoginInputs, req.body);
        const loginErrors = await validate(loginInputs, { validationError: { target: false } })

        if (loginErrors.length > 0)
            return res.json(loginErrors);

        const { email, password } = loginInputs;
        const user = await Customer.findOne({ email });
        if (!user)
            return res.json({ message: 'User not Found!' });

        const verifyPassword = await ValidatePassword(password, user.password, user.salt);
        if (!verifyPassword)
            return res.json({ message: 'Password Incorrect!' });

        const signature = await GenerateSignature({ _id: user._id, email: user.email, verified: user.verified })
        return res.json({ signature, email: user.email, verified: user.verified })
    } catch (error) {
        return res.json({ message: "Something wrong in LogIn" })
    }
}

export const VerifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body;
        const customer = req.user;

        if (!customer)
            return res.json({ message: "Token Has been expired!" })

        const profile = await Customer.findById(customer._id);
        if (!profile)
            return res.json({ message: "Customer Not Found!" })

        if (profile.verified) {
            return res.json({ message: "Your Account is Already Verified!" })
        }

        if (profile.otp === parseInt(otp) && new Date(profile.otp_expiry).toISOString() >= new Date().toISOString()) {
            profile.verified = true;
            const updatedCustomer = await profile.save();

            // Generate the Signature
            const signature = await GenerateSignature({ _id: updatedCustomer._id, email: updatedCustomer.email, verified: updatedCustomer.verified })
            return res.json({ signature, email: updatedCustomer.email, verified: updatedCustomer.verified })
        }

        return res.json({ message: "Your Account is not verified" })
    } catch (error) {
        return res.json({ message: "Something wrong in VerifyAccount" })
    }
}

export const Otp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;

        if (!customer)
            return res.json({ message: "Token Has been expired!" })

        const profile = await Customer.findById(customer._id)
        if (!profile)
            return res.json({ message: "User not found!" })

        const { otp, expiry } = await GenerateOtp();
        profile.otp = otp;
        profile.otp_expiry = expiry;

        await profile.save();
        // Send OTP to specific number
        // await onRequestOtp(otp, profile.phone);
        return res.json({ message: "Otp has been sent to your device!" })
    } catch (error) {
        return res.json({ message: "Something wrong in Otp" })
    }
}

export const Profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;

        if (!customer)
            return res.json({ message: "Token Has been expired!" })

        const profile = await Customer.findById(customer._id)
        if (!profile)
            return res.json({ message: "User not found!" })

        return res.json(profile)
    } catch (error) {
        return res.json({ message: "Something wrong in Profile" })
    }
}

export const UpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;
        const customerInputs = await plainToClass(UpdateCustomerInput, req.body);
        const inputErrors = await validate(customerInputs, { validationError: { target: false } })

        if (inputErrors.length > 0)
            return res.json(inputErrors);

        if (!customer)
            return res.json({ message: "Token Has been expired!" })

        const profile = await Customer.findById(customer._id)
        if (!profile)
            return res.json({ message: "User not found!" })

        const { firstName, lastName, address } = customerInputs;
        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;

        const result = await profile.save();
        return res.json(result)
    } catch (error) {
        return res.json({ message: "Something wrong in UpdateProfile" })
    }
}

export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;

        if (!customer)
            return res.json({ message: "Token Has been expired!" })

        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

        const profile = await Customer.findById(customer._id)
        if (!profile)
            return res.json({ message: "User not found!" })

        const cart = <[CreateOrderInputs]>req.body;
        let cartItem = Array();
        let netAmount = 0.0;
        let vandorId;

        const foods = await Food.find().where('_id').in(cart.map((item) => item._id)).exec();

        foods.map((food) => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id)
                    vandorId = food.vandorId; 
                    netAmount += (food.price * Number(unit));
                cartItem.push({ food, unit })
            })
        })

        // Create Order
        if (cartItem.length <= 0)
            return res.json({ message: 'Cart is Empty!' })

        const createOrder = await Order.create({
            orderId,
            vandorId,
            items: cartItem,
            totalAmount: netAmount,
            orderDate: new Date(),
            paidThrough: 'COD',
            paymentResponse: '',
            orderStatus: 'waiting',
            readyTime: 45,
            deliveryId: '',
            appliedOffers: false,
            offerId: '',
        })

        if (!createOrder)
            return res.json({ message: 'Order is not generated!' })

        profile.order.push(createOrder);
        await profile.save();

        return res.json(createOrder)
    } catch (error) {
        return res.json({ message: "Something wrong in CreateOrder" })
    }
}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;

        if (!customer)
            return res.json({ message: "Token Has been expired!" })

        const orders = await Customer.findById(customer._id).populate('order');
        return res.json(orders)
    } catch (error) {
        return res.json({ message: "Something wrong in GetOrders" })
    }
}

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.user;
        const { orderId } = req.params;

        if (!customer)
            return res.json({ message: "Token Has been expired!" })

        const orders = await Order.findById(orderId).populate('items.food')
        return res.json(orders)
    } catch (error) {
        return res.json({ message: "Something wrong in GetOrderById" })
    }
}

