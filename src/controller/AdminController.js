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
exports.GetVandorById = exports.GetVandors = exports.CreateVandor = exports.FindVandor = void 0;
const index_1 = require("../models/index");
const utility_1 = require("../utility");
const FindVandor = (_id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email)
        return yield index_1.Vandor.findOne({ email });
    return yield index_1.Vandor.findById(_id);
});
exports.FindVandor = FindVandor;
const CreateVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = req.body;
    const isExistEmail = yield (0, exports.FindVandor)(undefined, email);
    if (isExistEmail !== null) {
        return res.json({ message: "Email already exists!" });
    }
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const createVandor = yield index_1.Vandor.create({
        name, ownerName: '',
        foodType,
        pincode,
        address,
        phone,
        email,
        password: userPassword,
        salt,
        serviceAvailable: false,
        coverImages: [],
        foods: []
    });
    res.json(createVandor);
});
exports.CreateVandor = CreateVandor;
const GetVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandors = yield index_1.Vandor.find();
    res.json(vandors);
});
exports.GetVandors = GetVandors;
const GetVandorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandorId = req.params.id;
    try {
        const vandor = yield (0, exports.FindVandor)(vandorId);
        if (vandor)
            return res.json(vandor);
        res.json({ message: "Vandor not found!" });
    }
    catch (error) {
        if (error instanceof Error)
            return res.json({ message: error.message });
        res.json({ message: "Vandor not found!" });
    }
});
exports.GetVandorById = GetVandorById;
//# sourceMappingURL=AdminController.js.map