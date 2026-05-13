import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";
import {
  blockUser,
  unblockUser,
  getUsers,
  getCooks,
  approveCook,
  rejectCook,
  getAdminOverview,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Protect all admin routes
router.use(isAuthenticated);
router.use(restrictTo("Admin"));

router.get("/overview", getAdminOverview);

/* ================= USERS ================= */
router.get("/users", getUsers);
router.patch("/users/:id/block", validateObjectId, blockUser);
router.patch("/users/:id/unblock", validateObjectId, unblockUser);

/* ================= Cooks ================= */
router.get("/cooks", getCooks);
router.patch("/cooks/:id/approve", validateObjectId, approveCook);
router.patch("/cooks/:id/reject", validateObjectId, rejectCook);

export default router;
