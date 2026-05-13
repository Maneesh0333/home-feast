import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createPlan,
  updatePlan,
  getMyPlans,
} from "../controllers/plan.controller.js";
import { enablePlan } from "../controllers/plan.controller.js";
import { disablePlan } from "../controllers/plan.controller.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createPlanSchema, updatePlanSchema } from "../validations/plan.schema.js";

const router = express.Router();

/* 🔐 Only cooks can manage plans */
router.use(isAuthenticated);
router.use(restrictTo("Cook"));

router.post("/", validate(createPlanSchema), createPlan);            
router.get("/", getMyPlans);             
router.patch("/:id", validate(updatePlanSchema),validateObjectId, updatePlan);        
router.patch("/:id/enable", validateObjectId, enablePlan);
router.patch("/:id/disable", validateObjectId, disablePlan);
export default router;