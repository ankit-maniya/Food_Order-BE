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
exports.GetFood = exports.AddFood = exports.UpdateCoverImages = exports.UpdateVandorService = exports.UpdateVandorProfile = exports.GetVandorProfile = exports.VandorLogin = void 0;
const models_1 = require("../models");
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ message: 'Please filled required fields!' });
        }
        let existingVandor = yield (0, AdminController_1.FindVandor)(undefined, email);
        if (!existingVandor)
            return res.json({ message: 'Vandor Not found!' });
        const isValidPassword = yield (0, utility_1.ValidatePassword)(password, existingVandor.password);
        if (!isValidPassword)
            return res.json({ message: 'Invalid Password!' });
        const signature = yield (0, utility_1.GenerateSignature)({
            _id: existingVandor._id,
            name: existingVandor.name,
            email: existingVandor.email,
            foodtype: existingVandor.foodType
        });
        existingVandor.token = signature;
        res.json(existingVandor);
    }
    catch (error) {
        res.json({ message: 'Something went wrong in VandorLogin' });
    }
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user)
        try {
            const existingUser = yield (0, AdminController_1.FindVandor)(user._id);
            return res.json(existingUser);
        }
        catch (error) {
            return res.json({ message: "Some error occure in GetVandorProfile!" });
        }
    return res.json({ message: "Auth token has been expired!" });
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { email, name, foodtype, address, phone, pincode } = req.body;
    if (user)
        try {
            const existingUser = yield (0, AdminController_1.FindVandor)(user._id);
            if (existingUser)
                existingUser.email = email;
            existingUser.address = address;
            existingUser.name = name;
            const isUpdateUser = yield existingUser.save();
            return res.json(isUpdateUser);
        }
        catch (error) {
            return res.json({ message: "Some error occure in UpdateVandorProfile!" });
        }
    return res.json({ message: "Auth token has been expired!" });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const UpdateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { serviceAvailable } = req.body;
    if (user)
        try {
            const existingUser = yield (0, AdminController_1.FindVandor)(user._id);
            if (existingUser)
                existingUser.serviceAvailable = serviceAvailable;
            const updatedVandor = yield existingUser.save();
            return res.json(updatedVandor);
        }
        catch (error) {
            return res.json({ message: "Some error occure in UpdateVandorService!" });
        }
    return res.json({ message: "Auth token has been expired!" });
});
exports.UpdateVandorService = UpdateVandorService;
const UpdateCoverImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user)
        try {
            const vandor = yield (0, AdminController_1.FindVandor)(user._id);
            if (!vandor)
                return res.json({ message: "Vandor not found!" });
            const files = req.files;
            const coverImages = files.map((file) => file.filename);
            vandor.coverImages.push(...coverImages);
            const updatedVandor = yield vandor.save();
            return res.json(updatedVandor);
        }
        catch (error) {
            return res.json({ message: "Some error occure in UpdateCoverImages!" });
        }
    return res.json({ message: "Auth token has been expired!" });
});
exports.UpdateCoverImages = UpdateCoverImages;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user)
        try {
            const vandor = yield (0, AdminController_1.FindVandor)(user._id);
            if (!vandor)
                return res.json({ message: "Vandor not found!" });
            const { category, description, foodType, name, price, readyTime } = req.body;
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createFood = yield models_1.Food.create({
                vandorId: vandor._id,
                name,
                price,
                category,
                readyTime,
                description,
                foodType,
                images: images,
            });
            vandor.foods.push(createFood);
            const result = yield vandor.save();
            return res.json(result);
        }
        catch (error) {
            return res.json({ message: "Some error occure in AddFood!" });
        }
    return res.json({ message: "Auth token has been expired!" });
});
exports.AddFood = AddFood;
const GetFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user)
        try {
            const vandor = yield (0, AdminController_1.FindVandor)(user._id);
            if (!vandor)
                return res.json({ message: "Vandor not found!" });
            const allFoods = yield models_1.Food.find({ vandorId: vandor._id });
            return res.json(allFoods);
        }
        catch (error) {
            return res.json({ message: "Some error occure in GetFood!" });
        }
    return res.json({ message: "Auth token has been expired!" });
});
exports.GetFood = GetFood;
//# sourceMappingURL=VandorController.js.map