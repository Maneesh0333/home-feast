import { asyncHandler } from "../middleware/async.middleware.js";
import Subscription from "../models/Subscription.model.js";
import Cook from "../models/Cook.model.js";
import Plan from "../models/Plan.model.js";
import AppError from "../utils/AppError.js";
import { calcEndDate } from "../utils/calcEndDate.js";
import mongoose from "mongoose";

export const createSubscription = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const { cookId, planType, mealTime, startDate, deliveryAddress } = req.body;

  /* ---------------- VALIDATION ---------------- */
  if (!cookId || !planType || !mealTime || !startDate || !deliveryAddress) {
    throw new AppError(
      "cookId, planType, mealTime, startDate, deliveryAddress required",
      400,
    );
  }

  if (!["daily", "weekly", "monthly"].includes(planType)) {
    throw new AppError("Invalid plan type", 400);
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    throw new AppError("Invalid start date", 400);
  }

  /* ---------------- CHECK COOK ---------------- */
  const cook = await Cook.findById(cookId).populate("user");

  if (!cook || !cook.isActive || cook.verificationStatus !== "Approved") {
    throw new AppError("Cook not available", 404);
  }

  /* ---------------- DUPLICATE CHECK ---------------- */
  const existing = await Subscription.findOne({
    user: id,
    cook: cookId,
    status: { $in: ["pending", "active"] },
    $or: [
      { mealTime }, // same meal
      { mealTime: "both" }, // existing is both
      ...(mealTime === "both"
        ? [{ mealTime: "lunch" }, { mealTime: "dinner" }]
        : []),
    ],
  });

  if (existing) {
    throw new AppError("You already have an active/pending subscription", 409);
  }

  /* ---------------- GET PLAN (🔥 DYNAMIC PRICE) ---------------- */
  const plan = await Plan.findOne({
    cook: cookId,
    type: planType,
    isActive: true,
  });

  if (!plan) {
    throw new AppError("Selected plan not available", 400);
  }

  const price = plan.price;

  /* ---------------- CALCULATE END DATE ---------------- */
  const end = calcEndDate(start, planType);

  /* ---------------- CREATE ---------------- */
  const subscription = await Subscription.create({
    user: id,
    cook: cookId,
    planType,
    mealTime,
    startDate: start,
    endDate: end,
    price,
    deliveryAddress,
    status: "pending",
    paymentStatus: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Subscription created successfully",
    data: subscription,
  });
});

export const getCookRequests = asyncHandler(async (req, res) => {
  const { search = "", status = "All", page = 1, limit = 5 } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  await Subscription.updateMany(
    {
      status: "active",
      endDate: { $lt: new Date() },
    },
    {
      $set: { status: "expired" },
    },
  );

  /* 🔹 Get cook */
  const cook = await Cook.findOne({ user: req.user.id }).select("_id");
  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  /* 🔹 Base match (ONLY cook filter) */
  const baseMatch = {
    cook: cook._id,
  };

  /* 🔹 Filtered match (for list only) */
  const filteredMatch = {
    ...baseMatch,
  };

  if (status !== "All") {
    filteredMatch.status = status;
  }

  const searchFilter = search.trim()
    ? {
        "user.name": { $regex: search, $options: "i" },
      }
    : null;

  const pipeline = [
    /* 🔹 Match only cook first */
    {
      $match: baseMatch,
    },

    /* 🔹 Join user */
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    {
      $facet: {
        /* ✅ REQUESTS (filtered) */
        requests: [
          { $match: filteredMatch },
          ...(searchFilter ? [{ $match: searchFilter }] : []),
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              price: 1,
              status: 1,
              planType: 1,
              deliveryAddress: 1,
              createdAt: 1,
              paymentStatus: 1,
              mealTime: 1,
              "user._id": 1,
              "user.name": 1,
              "user.phone": 1,
            },
          },
        ],

        /* ✅ TOTAL FILTERED (pagination) */
        totalFiltered: [
          { $match: filteredMatch },
          ...(searchFilter ? [{ $match: searchFilter }] : []),
          { $count: "count" },
        ],

        /* ✅ STATS (ALL data, NO status filter) */
        stats: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],

        /* ✅ TOTAL REQUESTS (ALL data) */
        totalRequests: [{ $count: "count" }],
      },
    },
  ];

  const result = await Subscription.aggregate(pipeline);
  const data = result[0] || {};

  /* 🔹 Build stats object safely */
  const stats = {
    pending: 0,
    active: 0,
    cancelled: 0,
    expired: 0,
    rejected: 0,
  };

  (data.stats || []).forEach((s) => {
    stats[s._id] = s.count;
  });

  const totalFiltered = data.totalFiltered?.[0]?.count || 0;
  const totalRequests = data.totalRequests?.[0]?.count || 0;

  res.status(200).json({
    success: true,
    message: "Requests fetched successfully",
    data: {
      requests: data.requests || [],
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalRequests,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: data.requests?.length || 0,
    },
  });
});

export const acceptSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    throw new AppError("Subscription not found", 404);
  }

  /* 🔹 Ensure this request belongs to the logged-in cook */
  const cook = await Cook.findOne({ user: req.user.id }).select("_id");

  if (!cook || !subscription.cook.equals(cook._id)) {
    throw new AppError("Not authorized to accept this request", 403);
  }

  /* 🔹 Only pending can be accepted */
  if (subscription.status !== "pending") {
    throw new AppError("Only pending requests can be accepted", 400);
  }

  subscription.status = "active";
  await subscription.save();

  res.status(200).json({
    success: true,
    message: "Subscription accepted successfully",
  });
});

export const rejectSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    throw new AppError("Subscription not found", 404);
  }

  /* 🔹 Ensure correct cook */
  const cook = await Cook.findOne({ user: req.user.id }).select("_id");

  if (!cook || !subscription.cook.equals(cook._id)) {
    throw new AppError("Not authorized to reject this request", 403);
  }

  /* 🔹 Only pending can be rejected */
  if (subscription.status !== "pending") {
    throw new AppError("Only pending requests can be rejected", 400);
  }

  subscription.status = "rejected"; // 👈 or "rejected" if you add enum
  await subscription.save();

  res.status(200).json({
    success: true,
    message: "Subscription rejected successfully",
  });
});

export const getSubscribers = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 5 } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  /* 🔹 Get cook */
  const cook = await Cook.findOne({ user: req.user.id }).select("_id");
  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  const matchStage = {
    cook: cook._id,
    status: "active",
  };

  const searchFilter = search.trim()
    ? {
        "user.name": { $regex: search, $options: "i" },
      }
    : null;

  const pipeline = [
    { $match: matchStage },

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    ...(searchFilter ? [{ $match: searchFilter }] : []),

    {
      $facet: {
        subscribers: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              status: 1,
              planType: 1,
              mealTime: 1,
              createdAt: 1,
              price: 1,
              paymentStatus: 1,
              "user._id": 1,
              "user.name": 1,
              "user.phone": 1,
            },
          },
        ],

        total: [{ $count: "count" }],
      },
    },
  ];

  const result = await Subscription.aggregate(pipeline);
  const data = result[0] || {};

  const total = data.total?.[0]?.count || 0;

  res.status(200).json({
    success: true,
    message: "Subscribers fetched successfully",
    data: {
      subscribers: data.subscribers || [],
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

export const getMySubscriptions = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 5 } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  /* AUTO-EXPIRE */
  await Subscription.updateMany(
    {
      status: "active",
      endDate: { $lt: new Date() },
    },
    {
      $set: { status: "expired" },
    },
  );

  const baseMatch = {
    user: new mongoose.Types.ObjectId(req.user.id),
  };

  const filteredMatch = {
    ...baseMatch,
  };

  const searchFilter = search.trim()
    ? {
        "cookUser.name": { $regex: search, $options: "i" },
      }
    : null;

  const pipeline = [
    { $match: baseMatch },

    /* 🔹 JOIN COOK */
    {
      $lookup: {
        from: "cooks",
        localField: "cook",
        foreignField: "_id",
        as: "cook",
      },
    },
    { $unwind: "$cook" },

    /* 🔹 JOIN COOK.USER */
    {
      $lookup: {
        from: "users",
        localField: "cook.user",
        foreignField: "_id",
        as: "cookUser",
      },
    },
    { $unwind: "$cookUser" },

    /* 🔹 JOIN Review */
    {
      $lookup: {
        from: "reviews",
        let: {
          subId: "$_id",
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$subscription", "$$subId"] },
                  { $eq: ["$customer", "$$userId"] },
                ],
              },
            },
          },
          { $project: { _id: 1 } },
          { $limit: 1 },
        ],
        as: "reviews",
      },
    },

    {
      $addFields: {
        isReviewed: {
          $gt: [{ $size: "$reviews" }, 0],
        },
      },
    },

    {
      $facet: {
        /* ✅ LIST */
        subscriptions: [
          { $match: filteredMatch },
          ...(searchFilter ? [{ $match: searchFilter }] : []),
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              planType: 1,
              mealTime: 1,
              price: 1,
              status: 1,
              paymentStatus: 1,
              startDate: 1,
              endDate: 1,
              createdAt: 1,
              deliveryAddress: 1,
              isReviewed: 1,

              "cook._id": 1,
              "cookUser.name": 1,
              "cookUser.phone": 1,
              "cookUser.email": 1,
            },
          },
        ],

        /* ✅ FILTERED COUNT */
        totalFiltered: [
          { $match: filteredMatch },
          ...(searchFilter ? [{ $match: searchFilter }] : []),
          { $count: "count" },
        ],

        /* ✅ TOTAL */
        total: [{ $count: "count" }],
      },
    },
  ];

  const result = await Subscription.aggregate(pipeline);
  const data = result[0] || {};

  const totalFiltered = data.totalFiltered?.[0]?.count || 0;
  const total = data.total?.[0]?.count || 0;

  res.status(200).json({
    success: true,
    message: "Subscriptions fetched successfully",
    data: {
      subscriptions: data.subscriptions || [],
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalSubscriptions: total,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: data.subscriptions?.length || 0,
    },
  });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  /* ---------------- Validate Input ---------------- */
  const allowedStatuses = ["paid"];

  if (!paymentStatus) {
    throw new AppError("Payment status is required", 400);
  }

  if (!allowedStatuses.includes(paymentStatus)) {
    throw new AppError("Invalid payment status", 400);
  }

  /* ---------------- Find Entrepreneur ---------------- */
  const cook = await Cook.findOne({
    user: req.user.id,
  });

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  /* ---------------- Find Booking ---------------- */
  const subscription = await Subscription.findOne({
    _id: id,
    cook: cook._id,
  });

  if (!subscription) {
    throw new AppError("Subscription not found", 404);
  }

  /* ---------------- Prevent Invalid Transition ---------------- */
  if (subscription.paymentStatus === "Paid") {
    throw new AppError("Already Paid", 400);
  }

  /* ---------------- Update Status ---------------- */
  subscription.paymentStatus = paymentStatus;
  await subscription.save();

  res.status(200).json({
    success: true,
    message: "Payment status updated successfully",
  });
});
