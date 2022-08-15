"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const utility_1 = require("../utility");
const router = express_1.default.Router();
exports.VandorRoute = router;
router.use(middleware_1.Authenticate);
router.post('/login', controller_1.VandorLogin);
router.get('/profile', controller_1.GetVandorProfile);
router.patch('/profile', controller_1.UpdateVandorProfile);
router.patch('/service', controller_1.UpdateVandorService);
router.patch('/coverImages', utility_1.uploadImage, controller_1.UpdateCoverImages);
router.post('/food', utility_1.uploadImage, controller_1.AddFood);
router.get('/foods', controller_1.GetFood);
router.get('/', (req, res, next) => {
    res.json(' Vandour router - Root');
});
//# sourceMappingURL=VandorRoute.js.map