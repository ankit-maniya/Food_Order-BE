"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
exports.CustomerRoute = router;
/* Signup */
router.post('/signup', controller_1.SignUp);
/* Login */
router.post('/login', controller_1.LogIn);
/* verify account */
router.use(middleware_1.Authenticate);
router.patch('/verifyaccount', controller_1.VerifyAccount);
/* OTP */
router.get('/otp', controller_1.Otp);
/* Profile */
router.get('/profile', controller_1.Profile);
router.patch('/updateprofile', controller_1.UpdateProfile);
//# sourceMappingURL=CustomerRoute.js.map