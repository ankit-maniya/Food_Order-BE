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
exports.onRequestOtp = exports.GenerateOtp = void 0;
// OTP
const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
const onRequestOtp = (otp, to) => __awaiter(void 0, void 0, void 0, function* () {
    var accountSid = ''; // Your Account SID from www.twilio.com/console
    var authToken = ''; // Your Auth Token from www.twilio.com/console
    var twilio = require('twilio');
    var client = new twilio(accountSid, authToken);
    try {
        const otpResponse = yield client.messages
            .create({
            body: `Your OTP is ${otp}`,
            from: '+15005550009',
            to: `+91${to}`
        });
        return otpResponse;
    }
    catch (error) {
        console.log('error twilio :: ', error);
        return error;
    }
});
exports.onRequestOtp = onRequestOtp;
//# sourceMappingURL=NotificationUtility.js.map