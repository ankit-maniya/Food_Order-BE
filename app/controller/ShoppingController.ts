import { Request, Response, NextFunction } from 'express';
import { FoodDoc, Vandor } from '../models';

export const SearchFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pincode } = req.params;

        const foods = await Vandor.find({ pincode, serviceAvailable: true })
            .sort({ "rating": 'descending' })
            .populate("foods")

        if (foods.length <= 0)
            return res.json({ message: 'Food not availaible in your area!' })

        return res.json(foods);
    } catch (error) {
        return res.json({ message: 'Something went wrong in SearchFoodAvailability' })
    }
}

export const SearchTopRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pincode } = req.params;

        const topRestaurant = await Vandor.find({ pincode })
            .sort({ "rating": -1 })
            .limit(10)

        if (topRestaurant.length <= 0)
            return res.json({ message: 'Restaurants are not availaible in your area!' })

        return res.json(topRestaurant);
    } catch (error) {
        return res.json({ message: 'Something went wrong in SearchTopRestaurant' })
    }
}

export const SearchFoodAvailabileInMinutes = async (req: Request, res: Response, next: NextFunction) => {
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

        const foodAvailabileList = await Vandor.find({ pincode, foods: { $ne: [], $not: { $size: 0 } } }).populate('foods');
        const foodList = <any>[];

        foodAvailabileList.map((vandor) => {
            const foods = vandor.foods as [FoodDoc];
            foodList.push(foods.filter((food) => food.readyTime <= 30))
        })

        if (foodList.length <= 0)
            return res.json({ message: 'Within 30 minutes Foods are not availaible in your area!' })

        return res.json(foodList);
    } catch (error) {
        return res.json({ message: 'Something went wrong in SearchFoodAvailabileInMinutes' })
    }
}

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pincode } = req.params;
        const results = await Vandor.find({ pincode }).populate('foods');

        const foodList: any = [];

        results.map((vandor) => {
            const foods = vandor.foods as [FoodDoc];
            foodList.push(foods)
        })

        if (foodList.length <= 0)
            return res.json({ message: 'Foods are not availaible in your area!' })

        return res.json(foodList);
    } catch (error) {
        return res.json({ message: 'Something went wrong in SearchFoods' })
    }
}

export const SearchRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const restaurant = await Vandor.findById(id).populate('foods')

        if (!restaurant)
            return res.json({ message: 'Restaurant not availaible in your area!' })

        return res.json(restaurant);
    } catch (error) {
        return res.json({ message: 'Something went wrong in SearchRestaurantById' })
    }
}
