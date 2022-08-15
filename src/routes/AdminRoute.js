"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post('/vandor', controller_1.CreateVandor);
router.get('/vandor', controller_1.GetVandors);
router.get('/vandor/:id', controller_1.GetVandorById);
router.get('/', (req, res, next) => {
    res.json(' Admin router - get');
});
//# sourceMappingURL=AdminRoute.js.map