import { asyncHandler } from "../middleware/async.middleware.js";
import Plan from "../models/Plan.model.js";
import Cook from "../models/Cook.model.js";
import AppError from "../utils/AppError.js";

/* ---------------- CREATE PLAN ---------------- */
export const createPlan = asyncHandler(async (req, res) => {
  const { type, price } = req.body;

  if (!type || price === undefined) {
    throw new AppError("Type and price are required", 400);
  }

  const cook = await Cook.findOne({ user: req.user.id });

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  /* ❌ prevent duplicate plan */
  const exists = await Plan.findOne({ cook: cook._id, type });

  if (exists) {
    throw new AppError(`${type} plan already exists`, 400);
  }

  const plan = await Plan.create({
    cook: cook._id,
    type,
    price,
  });

  res.status(201).json({
    success: true,
    message: "Plan created successfully",
    data: plan,
  });
});

/* ---------------- GET MY PLANS ---------------- */
export const getMyPlans = asyncHandler(async (req, res) => {
  const cook = await Cook.findOne({ user: req.user.id });

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  const plans = await Plan.find({ cook: cook._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: plans,
  });
});

/* ---------------- UPDATE PLAN ---------------- */
export const updatePlan = asyncHandler(async (req, res) => {
  const { price } = req.body;

  if (price === undefined) {
    throw new AppError("Price is required", 400);
  }

  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    throw new AppError("Plan not found", 404);
  }

  plan.price = price;
  await plan.save();

  res.status(200).json({
    success: true,
    message: "Plan updated successfully",
    data: plan,
  });
});


/* ---------------- ENABLE PLAN ---------------- */
export const enablePlan = asyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    throw new AppError("Plan not found", 404);
  }

  if (plan.isActive) {
    return res.status(200).json({
      success: true,
      message: "Plan already enabled",
    });
  }

  plan.isActive = true;
  await plan.save();

  res.status(200).json({
    success: true,
    message: "Plan enabled",
  });
});

/* ---------------- DISABLE PLAN ---------------- */
export const disablePlan = asyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    throw new AppError("Plan not found", 404);
  }

  if (!plan.isActive) {
    return res.status(200).json({
      success: true,
      message: "Plan already disabled",
    });
  }

  plan.isActive = false;
  await plan.save();

  res.status(200).json({
    success: true,
    message: "Plan disabled",
  });
});