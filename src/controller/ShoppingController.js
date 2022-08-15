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
exports.SearchRestaurantById = exports.SearchFoods = exports.SearchFoodAvailabileInMinutes = exports.SearchTopRestaurant = exports.SearchFoodAvailability = void 0;
const models_1 = require("../models");
const SearchFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pincode } = req.params;
        const foods = yield models_1.Vandor.find({ pincode, serviceAvailable: true })
            .sort({ "rating": 'descending' })
            .populate("foods");
        if (foods.length <= 0)
            return res.json({ message: 'Food not availaible in your area!' });
        return res.json(foods);
    }
    catch (error) {
        return res.json({ message: 'Something went wrong in SearchFoodAvailability' });
    }
});
exports.SearchFoodAvailability = SearchFoodAvailability;
const SearchTopRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pincode } = req.params;
        const topRestaurant = yield models_1.Vandor.find({ pincode })
            .sort({ "rating": -1 })
            .limit(10);
        if (topRestaurant.length <= 0)
            return res.json({ message: 'Restaurants are not availaible in your area!' });
        return res.json(topRestaurant);
    }
    catch (error) {
        return res.json({ message: 'Something went wrong in SearchTopRestaurant' });
    }
});
exports.SearchTopRestaurant = SearchTopRestaurant;
const SearchFoodAvailabileInMinutes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pincode } = req.params;
        // const foodAvailabileInMinutes = await Vandor.aggregate([
        //     { $match: { pincode, "foods": { "$exists": true, $ne: [], $not: { $size: 0 } } } },
        //     {
        //         $lookup: {
        //             from: "foods",
        //             localField: "foods",
        //             foreignField: "_id",
        //             as: "foods"
        //         }
        //     },
        //     {
        //         $project: {
        //             foods: {
        //                 $filter: {
        //                     input: "$foods",
        //                     as: "food",
        //                     cond: {
        //                         $and: [
        //                             { $gte: ["$$food.readyTime", 0] },
        //                             { $lte: ["$$food.readyTime", 30] },
        //                         ]
        //                     },
        //                 }
        //             },
        //             name: 1,
        //             pincode: 1,
        //             price: 1,
        //             category: 1,
        //             images: 1,
        //             description: 1,
        //             foodType: 1,
        //         }
        //     },
        //     { $match: { "foods": { $ne: [], $not: { $size: 0 } } } },
        // ], { allowDiskUse: true })
        const foodAvailabileList = yield models_1.Vandor.find({ pincode, foods: { $ne: [], $not: { $size: 0 } } }).populate('foods');
        const foodList = [];
        foodAvailabileList.map((vandor) => {
            const foods = vandor.foods;
            foodList.push(foods.filter((food) => food.readyTime <= 30));
        });
        if (foodList.length <= 0)
            return res.json({ message: 'Within 30 minutes Foods are not availaible in your area!' });
        return res.json(foodList);
    }
    catch (error) {
        return res.json({ message: 'Something went wrong in SearchFoodAvailabileInMinutes' });
    }
});
exports.SearchFoodAvailabileInMinutes = SearchFoodAvailabileInMinutes;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pincode } = req.params;
        const results = yield models_1.Vandor.find({ pincode }).populate('foods');
        const foodList = [];
        results.map((vandor) => {
            const foods = vandor.foods;
            foodList.push(foods);
        });
        if (foodList.length <= 0)
            return res.json({ message: 'Foods are not availaible in your area!' });
        return res.json(foodList);
    }
    catch (error) {
        return res.json({ message: 'Something went wrong in SearchFoods' });
    }
});
exports.SearchFoods = SearchFoods;
const SearchRestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const restaurant = yield models_1.Vandor.findById(id).populate('foods');
        if (!restaurant)
            return res.json({ message: 'Restaurant not availaible in your area!' });
        return res.json(restaurant);
    }
    catch (error) {
        return res.json({ message: 'Something went wrong in SearchRestaurantById' });
    }
});
exports.SearchRestaurantById = SearchRestaurantById;
//# sourceMappingURL=ShoppingController.js.map