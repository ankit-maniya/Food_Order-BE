"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfile = exports.Profile = exports.Otp = exports.VerifyAccount = exports.LogIn = exports.SignUp = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const index_dto_1 = require("../dto/index.dto");
const models_1 = require("../models");
const utility_1 = require("../utility");
const SignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerInputs = (0, class_transformer_1.plainToClass)(index_dto_1.CreateCustomerInput, req.body);
        const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: false } });
        if (inputErrors.length > 0)
            return res.json(inputErrors);
        const { email, password, phone } = customerInputs;
        const salt = yield (0, utility_1.GenerateSalt)();
        const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
        const { otp, expiry } = yield (0, utility_1.GenerateOtp)();
        const userExists = yield models_1.Customer.findOne({ email });
        if (userExists)
            return res.json({ message: "Customer Already Exists with this Email id!" });
        const result = yield models_1.Customer.create({
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
        });
        if (!result)
            return res.json({ message: "Customer Not Created!" });
        // json OTP to customer
        // await onRequestOtp(otp, phone)
        // Create Signature
        const signature = yield (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified
        });
        const customerRes = {
            signature,
            email: result.email,
            verified: result.verified
        };
        return res.json(customerRes);
    }
    catch (error) {
        return res.json({ message: "Something wrong in SignUp" });
    }
});
exports.SignUp = SignUp;
const LogIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginInputs = (0, class_transformer_1.plainToClass)(index_dto_1.UserLoginInputs, req.body);
        const loginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
        if (loginErrors.length > 0)
            return res.json(loginErrors);
        const { email, password } = loginInputs;
        const user = yield models_1.Customer.findOne({ email });
        if (!user)
            return res.json({ message: 'User not Found!' });
        const verifyPassword = yield (0, utility_1.ValidatePassword)(password, user.password, user.salt);
        if (!verifyPassword)
            return res.json({ message: 'Password Incorrect!' });
        const signature = yield (0, utility_1.GenerateSignature)({ _id: user._id, email: user.email, verified: user.verified });
        return res.json({ signature, email: user.email, verified: user.verified });
    }
    catch (error) {
        return res.json({ message: "Something wrong in LogIn" });
    }
});
exports.LogIn = LogIn;
const VerifyAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        const customer = req.user;
        if (!customer)
            return res.json({ message: "Token Has been expired!" });
        const profile = yield models_1.Customer.findById(customer._id);
        if (!profile)
            return res.json({ message: "Customer Not Found!" });
        if (profile.verified) {
            return res.json({ message: "Your Account is Already Verified!" });
        }
        if (profile.otp === parseInt(otp) && new Date(profile.otp_expiry).toISOString() >= new Date().toISOString()) {
            profile.verified = true;
            const updatedCustomer = yield profile.save();
            // Generate the Signature
            const signature = yield (0, utility_1.GenerateSignature)({ _id: updatedCustomer._id, email: updatedCustomer.email, verified: updatedCustomer.verified });
            return res.json({ signature, email: updatedCustomer.email, verified: updatedCustomer.verified });
        }
        return res.json({ message: "Your Account is not verified" });
    }
    catch (error) {
        return res.json({ message: "Something wrong in VerifyAccount" });
    }
});
exports.VerifyAccount = VerifyAccount;
const Otp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.user;
        if (!customer)
            return res.json({ message: "Token Has been expired!" });
        const profile = yield models_1.Customer.findById(customer._id);
        if (!profile)
            return res.json({ message: "User not found!" });
        const { otp, expiry } = yield (0, utility_1.GenerateOtp)();
        profile.otp = otp;
        profile.otp_expiry = expiry;
        yield profile.save();
        // Send OTP to specific number
        // await onRequestOtp(otp, profile.phone);
        return res.json({ message: "Otp has been sent to your device!" });
    }
    catch (error) {
        return res.json({ message: "Something wrong in Otp" });
    }
});
exports.Otp = Otp;
const Profile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.user;
        if (!customer)
            return res.json({ message: "Token Has been expired!" });
        const profile = yield models_1.Customer.findById(customer._id);
        if (!profile)
            return res.json({ message: "User not found!" });
        return res.json(profile);
    }
    catch (error) {
        return res.json({ message: "Something wrong in Profile" });
    }
});
exports.Profile = Profile;
const UpdateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.user;
        const customerInputs = yield (0, class_transformer_1.plainToClass)(index_dto_1.UpdateCustomerInput, req.body);
        const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: false } });
        if (inputErrors.length > 0)
            return res.json(inputErrors);
        if (!customer)
            return res.json({ message: "Token Has been expired!" });
        const profile = yield models_1.Customer.findById(customer._id);
        if (!profile)
            return res.json({ message: "User not found!" });
        const { firstName, lastName, address } = customerInputs;
        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;
        const result = yield profile.save();
        return res.json(result);
    }
    catch (error) {
        return res.json({ message: "Something wrong in UpdateProfile" });
    }
});
exports.UpdateProfile = UpdateProfile;
//# sourceMappingURL=CustomerController.js.map