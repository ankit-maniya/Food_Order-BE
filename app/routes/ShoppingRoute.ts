import express from 'express';
import { SearchFoodAvailabileInMinutes, SearchFoodAvailability, SearchFoods, SearchRestaurantById, SearchTopRestaurant } from '../controller';

const router = express.Router();

/* Search Food Availability */
router.get('/:pincode', SearchFoodAvailability)

/* Top  Restaurants */
router.get('/top-restaurants/:pincode', SearchTopRestaurant)

/* Foods Availibile In 30 minutes */
router.get('/foods-in-30-min/:pincode', SearchFoodAvailabileInMinutes)

/* Search Foods */
router.get('/search/:pincode', SearchFoods)

/* Find Restaurant by ID */
router.get('/restaurant/:id', SearchRestaurantById)

export { router as ShoppingRoute }
