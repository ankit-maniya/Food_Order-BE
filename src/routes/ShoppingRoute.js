"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
/* Search Food Availability */
router.get('/:pincode', controller_1.SearchFoodAvailability);
/* Top  Restaurants */
router.get('/top-restaurants/:pincode', controller_1.SearchTopRestaurant);
/* Foods Availibile In 30 minutes */
router.get('/foods-in-30-min/:pincode', controller_1.SearchFoodAvailabileInMinutes);
/* Search Foods */
router.get('/search/:pincode', controller_1.SearchFoods);
/* Find Restaurant by ID */
router.get('/restaurant/:id', controller_1.SearchRestaurantById);
//# sourceMappingURL=ShoppingRoute.js.map