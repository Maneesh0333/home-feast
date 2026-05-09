import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { acceptSubscription, createSubscription, getCookRequests, getMySubscriptions, getSubscribers, rejectSubscription, updatePaymentStatus } from "../controllers/subscription.controller.js";

const router = express.Router();

// User routes
router.post('/', isAuthenticated, restrictTo('User'), createSubscription);
router.get('/my', isAuthenticated, restrictTo('User'), getMySubscriptions);
// router.get('/:id', isAuthenticated, restrictTo('User'), getSubscriptionById);
// router.patch('/:id/cancel', isAuthenticated, restrictTo('User'), cancelSubscription);

// Cook routes
router.get('/cook/requests', isAuthenticated, restrictTo('Cook'), getCookRequests);
router.patch('/:id/accept', isAuthenticated, restrictTo('Cook'), acceptSubscription);
router.patch('/:id/reject', isAuthenticated, restrictTo('Cook'), rejectSubscription);
router.patch('/:id/payment/status', isAuthenticated, restrictTo('Cook'), updatePaymentStatus);
router.get("/subscribers", isAuthenticated, restrictTo('Cook'), getSubscribers);


// // Admin routes
// router.get('/', isAuthenticated, restrictTo('Admin'), getAllSubscriptions);
// router.get('/stats/summary', isAuthenticated, restrictTo('Admin'), getSubscriptionStats);

export default router;