"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const imageStorage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, 'app/images');
    },
    filename(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + '-' + file.originalname);
    },
});
exports.uploadImage = (0, multer_1.default)({ storage: imageStorage }).array('images');
//# sourceMappingURL=UploadFileUtility.js.map