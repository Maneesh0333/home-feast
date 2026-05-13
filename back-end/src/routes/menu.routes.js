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
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";

const router = express.Router();


router.use(isAuthenticated);
router.use(restrictTo("Cook"));

router.get("/", getMenu);
router.get("/today", getTodayMenu);
router.post("/", validate(createMenuSchema), createMenu);

router.patch("/:id/toggle", validateObjectId, toggleTodayMenu);
router.patch("/:id/enable", validateObjectId, enableMenu);
router.patch("/:id/disable", validateObjectId, disableMenu);
router.patch("/:id", validate(updateMenuSchema), validateObjectId, updateMenu);

export default router;
