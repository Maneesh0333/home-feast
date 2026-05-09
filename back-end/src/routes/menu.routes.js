import express from "express";
import {
  createMenu,
  getMenu,
  enableMenu,
  disableMenu,
  updateMenu,
  toggleTodayMenu,
  getTodayMenu,
} from "../controllers/menu.controller.js";

import {
  createMenuSchema,
  updateMenuSchema,
} from "../validations/menu.validation.js";

import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();


router.use(isAuthenticated);
router.use(restrictTo("Cook"));

router.get("/", getMenu);
router.get("/today", getTodayMenu);
router.post("/", validate(createMenuSchema), createMenu);

router.patch("/:id/toggle", toggleTodayMenu);
router.patch("/:id/enable", enableMenu);
router.patch("/:id/disable", disableMenu);
router.patch("/:id", validate(updateMenuSchema), updateMenu);

export default router;
