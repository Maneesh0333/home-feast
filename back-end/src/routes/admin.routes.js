import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
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
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);

/* ================= Cooks ================= */
router.get("/cooks", getCooks);
router.patch("/cooks/:id/approve", approveCook);
router.patch("/cooks/:id/reject", rejectCook);


export default router;
