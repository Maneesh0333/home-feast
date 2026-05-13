import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { acceptSubscription, createSubscription, getCookRequests, getMySubscriptions, getSubscribers, rejectSubscription, updatePaymentStatus } from "../controllers/subscription.controller.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";
import { subscriptionSchema } from "../validations/subscription.schema.js";

const router = express.Router();

router.use(isAuthenticated);


// User routes
router.post('/', restrictTo('User'), validate(subscriptionSchema), createSubscription);
router.get('/my', restrictTo('User'), getMySubscriptions);


// Cook routes
router.get('/cook/requests', restrictTo('Cook'), getCookRequests);
router.patch('/:id/accept', restrictTo('Cook'), validateObjectId, acceptSubscription);
router.patch('/:id/reject', restrictTo('Cook'), validateObjectId, rejectSubscription);
router.patch('/:id/payment/status', restrictTo('Cook'), validateObjectId, updatePaymentStatus);
router.get("/subscribers", restrictTo('Cook'), getSubscribers);


export default router;