import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createPlan,
  updatePlan,
  getMyPlans,
} from "../controllers/plan.controller.js";
import { enablePlan } from "../controllers/plan.controller.js";
import { disablePlan } from "../controllers/plan.controller.js";

const router = express.Router();

/* 🔐 Only cooks can manage plans */
router.use(isAuthenticated);
router.use(restrictTo("Cook"));

router.post("/", createPlan);            // create plan
router.get("/", getMyPlans);             // get all plans of cook
router.patch("/:id", updatePlan);        // update price
router.patch("/:id/enable", enablePlan);
router.patch("/:id/disable", disablePlan);
export default router;