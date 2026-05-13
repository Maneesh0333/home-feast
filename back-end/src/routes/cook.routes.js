import express from "express";

import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { updateCookProfileSchema } from "../validations/cook.validation.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createReview,
  getCookEarnings,
  getCookMealType,
  getCookOverview,
  getCookProfile,
  getCookProfileById,
  getReviews,
  getSearchCookProfile,
  updateCookProfile,
} from "../controllers/cook.controller.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";
import { reviewSchema } from "../validations/review.schema.js";

const router = express.Router();

// Public
router.get("/search/profile", getSearchCookProfile);
router.get("/public/profile/:id", validateObjectId, getCookProfileById);
router.get("/reviews/:id", validateObjectId, getReviews);


router.use(isAuthenticated);

//User
router.post("/review", restrictTo("User"), validate(reviewSchema), createReview);

//Cook
router.use(restrictTo("Cook"));

router.get("/profile", getCookProfile);
router.patch("/profile", validate(updateCookProfileSchema), updateCookProfile);
router.get("/earning", getCookEarnings);
router.get("/overview", getCookOverview);
router.get("/meal-type/:id", validateObjectId, getCookMealType);


export default router;
