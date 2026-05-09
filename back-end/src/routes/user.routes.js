import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { getCookProfile, updateCookProfile } from "../controllers/cook.controller.js";
import { updateCookProfileSchema } from "../validations/cook.validation.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";


const router = express.Router();


router.use(isAuthenticated);
router.use(restrictTo("User"));

router.get("/profile", getProfile);
router.patch("/profile", validate(updateCookProfileSchema), updateProfile);

export default router;
