import AppError from "../utils/AppError.js";
import Cook from "../models/Cook.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import mongoose from "mongoose";
import User from "../models/User.model.js";
import { timeToMinutes } from "../utils/timeToMinutes.js";
import { convertTimeRange } from "../utils/convertTimeRange.js";
import Plan from "../models/Plan.model.js";
import Menu from "../models/Menu.model.js";
import Subscription from "../models/Subscription.model.js";
import Review from "../models/Review.model.js";

export const getCookProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const cook = await Cook.findOne({ user: id })
    .populate([
      {
        path: "user",
        select: "name phone email city",
      },
      {
        path: "category",
        select: "_id name",
      },
    ])
    .select("-updatedAt -isActive -verificationStatus");

  if (!cook) {
    throw new AppError("Cook profile not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile feached.",
    data: cook,
  });
});

export const getCookProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid ID", 400);
  }

  const cookData = await Cook.findOne({ user: id }).select("_id");

  if (!cookData) {
    throw new AppError("Cook not found", 404);
  }

  const [plan, cook, menu, subscribers] = await Promise.all([
    Plan.find({ cook: cookData._id, isActive: true }).select("_id type price"),
    Cook.findById(cookData._id)
      .populate([
        {
          path: "user",
          select: "name phone email city",
        },
        {
          path: "category",
          select: "_id name",
        },
      ])
      .select("-updatedAt -isActive")
      .lean(),
    Menu.find({
      cook: cookData._id,
      availableToday: true,
      status: "Active",
    }).lean(),
    Subscription.countDocuments({ cook: cookData._id }),
  ]);

  if (!cook) {
    throw new AppError("Cook profile not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile feached.",
    data: { cook, plan, menu, subscribers },
  });
});

/* ---------------- CONTROLLER ---------------- */
export const updateCookProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (!Object.keys(req.body).length) {
    throw new AppError("No fields provided for update", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userFields = ["name", "email", "phone", "city"];

    const userUpdates = {};
    const cookUpdates = {};

    for (const [key, value] of Object.entries(req.body)) {
      if (userFields.includes(key)) {
        userUpdates[key] = value;
      } else {
        /* 🔥 HANDLE TIME FIELDS */
        if (key === "lunchDeliveryTime") {
          const converted = convertTimeRange(value);
          if (converted) cookUpdates.lunchDeliveryTime = converted;
        } else if (key === "dinnerDeliveryTime") {
          const converted = convertTimeRange(value);
          if (converted) cookUpdates.dinnerDeliveryTime = converted;
        } else if (key === "location") {
          cookUpdates.location = {
            type: "Point",
            coordinates: value,
          };
        } else {
          cookUpdates[key] = value;
        }
      }
    }

    if (!Object.keys(userUpdates).length && !Object.keys(cookUpdates).length) {
      throw new AppError("No valid fields provided", 400);
    }

    /* ---------------- UPDATE USER ---------------- */
    if (Object.keys(userUpdates).length) {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: userUpdates },
        { new: true, runValidators: true, session },
      );

      if (!user) {
        throw new AppError("User not found", 404);
      }
    }

    /* ---------------- UPDATE COOK ---------------- */
    if (Object.keys(cookUpdates).length) {
      const cook = await Cook.findOneAndUpdate(
        { user: id },
        { $set: cookUpdates },
        { new: true, runValidators: true, session },
      );

      if (!cook) {
        throw new AppError("Cook profile not found", 404);
      }
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

export const getSearchCookProfile = asyncHandler(async (req, res) => {
  const {
    search = "",
    type = "Both",
    cuisine = "All",
    page = 1,
    limit = 10,
    planType = "All",
    lat=0,
    lng=0,
  } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(parseInt(limit), 50);
  const skip = (pageNum - 1) * limitNum;

  const pipeline = [
    ...(Number(lat)!==0 && Number(lng)!==0
      ? [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [Number(lng), Number(lat)],
              },

              distanceField: "distance",

              maxDistance: 10000, // 10km

              spherical: true,

              query: {
                isActive: true,
                verificationStatus: "Approved",
                category: { $ne: null },
                mealType: { $ne: "" },
              },
            },
          },
        ]
      : [
          {
            $match: {
              isActive: true,
              verificationStatus: "Approved",
              category: { $ne: null },
              mealType: { $ne: "" },
            },
          },
        ]),
    ...(type !== "Both"
      ? [
          {
            $match: { $or: [{ mealType: type }, { mealType: "Both" }] },
          },
        ]
      : []),

    ...(cuisine !== "All"
      ? [
          {
            $match: {
              category: new mongoose.Types.ObjectId(cuisine),
            },
          },
        ]
      : []),
    {
      $lookup: {
        from: "menus",
        localField: "_id",
        foreignField: "cook",
        as: "menus",
      },
    },
    { $match: { menus: { $ne: [] } } },
    {
      $lookup: {
        from: "plans",
        let: { cookId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$cook", "$$cookId"] },
              isActive: true,
            },
          },
          {
            $sort: { price: 1 },
          },
        ],
        as: "plans",
      },
    },
    { $match: { plans: { $ne: [] } } },
    ...(planType !== "All"
      ? [
          {
            $match: { "plans.type": planType },
          },
        ]
      : []),
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    /* SEARCH */
    ...(search.trim()
      ? [
          {
            $match: {
              $or: [
                { kitchenName: { $regex: search, $options: "i" } },
                { "user.name": { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : []),

    /* FINAL RESPONSE */
    {
      $project: {
        kitchenName: 1,
        bio: 1,
        experienceYears: 1,
        "rating.average": 1,
        cheapestPlan: { $arrayElemAt: ["$plans", 0] },
        mealType: 1,
        distance: {
          $round: [{ $divide: ["$distance", 1000] }, 1],
        },
        user: {
          _id: "$user._id",
          name: "$user.name",
          city: "$user.city",
        },
      },
    },

    /* 🔹 PAGINATION */
    {
      $facet: {
        data: [
          {
            $sort:
              Number(lat)!==0 && Number(lng)!==0
                ? { distance: 1 } // nearest first
                : { "rating.average": -1 },
          },
          { $skip: skip },
          { $limit: limitNum },
        ],
        total: [{ $count: "count" }],
      },
    },
  ];

  const result = await Cook.aggregate(pipeline);

  const cooks = result[0].data;
  const total = result[0].total[0]?.count || 0;

  res.status(200).json({
    success: true,
    message: "Fetched successfully",
    data: cooks,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum),
  });
});

export const getCookEarnings = asyncHandler(async (req, res) => {
  const cook = await Cook.findOne({ user: req.user.id }).select("_id");

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  /* 🔹 AUTO EXPIRE */
  await Subscription.updateMany(
    {
      status: "active",
      endDate: { $lt: new Date() },
    },
    { $set: { status: "expired" } },
  );

  /* 🔹 CURRENT MONTH RANGE */
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const pipeline = [
    {
      $match: {
        cook: cook._id,
        paymentStatus: "paid",
      },
    },

    /* 🔹 JOIN USER */
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
        /* ================== HISTORY ================== */
        history: [
          { $sort: { createdAt: -1 } },
          { $limit: 20 },
          {
            $project: {
              date: "$createdAt",
              customerName: "$user.name",
              planType: 1,
              amount: "$price",
              paymentStatus: 1,
            },
          },
        ],

        /* ================== MONTHLY ================== */
        monthlyEarnings: [
          {
            $match: {
              createdAt: { $gte: startOfMonth },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$price" },
            },
          },
        ],

        /* ================== WEEKLY ================== */
        weeklyRevenue: [
          {
            $match: { planType: "weekly" },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$price" },
            },
          },
        ],

        /* ================== MONTHLY PLAN ================== */
        monthlyPlanRevenue: [
          {
            $match: { planType: "monthly" },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$price" },
            },
          },
        ],
      },
    },
  ];

  const result = await Subscription.aggregate(pipeline);
  const data = result[0];

  res.status(200).json({
    success: true,
    data: {
      stats: {
        monthlyEarnings: data.monthlyEarnings?.[0]?.total || 0,
        weeklyRevenue: data.weeklyRevenue?.[0]?.total || 0,
        monthlyRevenue: data.monthlyPlanRevenue?.[0]?.total || 0,
      },
      history: data.history || [],
    },
  });
});

export const getCookOverview = asyncHandler(async (req, res) => {
  const cook = await Cook.findOne({ user: req.user.id }).select("_id rating");

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);

  /* 🔥 SINGLE PIPELINE */
  const result = await Subscription.aggregate([
    {
      $match: {
        cook: cook._id,
      },
    },

    {
      $facet: {
        totalEarnings: [
          {
            $match: {
              paymentStatus: "paid",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$price" },
            },
          },
        ],

        /* 🔹 Active Subscribers */
        activeSubs: [
          {
            $match: {
              status: "active",
            },
          },
          {
            $count: "count",
          },
        ],

        /* 🔹 Chart (7 days) */
        chart: [
          {
            $match: {
              paymentStatus: "paid",
              createdAt: { $gte: last7Days },
            },
          },
          {
            $group: {
              _id: {
                date: {
                  $dateToString: {
                    format: "%d %b",
                    date: "$createdAt",
                  },
                },
              },
              amount: { $sum: "$price" },
            },
          },
        ],
      },
    },
  ]);

  const data = result[0] || {};

  const totalEarnings = data.totalEarnings?.[0]?.total || 0;
  const activeSubscribers = data.activeSubs?.[0]?.count || 0;
  const chartAgg = data.chart || [];

  /* 🔹 Fill missing days */
  const daysMap = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const label = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    daysMap[label] = 0;
  }

  chartAgg.forEach((item) => {
    daysMap[item._id.date] = item.amount;
  });

  const chartData = Object.keys(daysMap)
    .map((date) => ({
      date,
      amount: daysMap[date],
    }))
    .reverse();

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalEarnings,
        activeSubscribers,
      },
      chartData,
      rating: cook.rating,
    },
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const { subscriptionId, rating, comment } = req.body;

  /* ---------------- Validate ---------------- */

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
    throw new AppError("Subscription not found", 404);
  }

  /* ---------------- Prevent Duplicate Review ---------------- */
  const existingReview = await Review.findOne({
    customer: req.user.id,
    subscription: subscriptionId,
  });

  if (existingReview) {
    throw new AppError("You already reviewed this Subscription", 400);
  }

  /* ---------------- Create Review ---------------- */
  const review = await Review.create({
    customer: req.user.id,
    cook: subscription.cook,
    subscription: subscription._id,
    rating,
    comment,
  });

  /* ---------------- Update Entrepreneur Rating ---------------- */
  const stats = await Review.aggregate([
    { $match: { cook: subscription.cook } },
    {
      $group: {
        _id: "$cook",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avgRating = stats[0]?.avgRating || 0;
  const totalReviews = stats[0]?.totalReviews || 0;

  await Cook.findByIdAndUpdate(subscription.cook, {
    "rating.average": avgRating,
    "rating.totalReviews": totalReviews,
  });

  /* ---------------- Response ---------------- */
  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
  });
});

export const getReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 5 } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 20);
  const skip = (pageNum - 1) * limitNum;

  const cook = await Cook.findOne({
    user: id,
  });

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  const matchStage = {
    cook: cook._id,
  };

  /* ---------------- AGGREGATION ---------------- */

  const result = await Review.aggregate([
    { $match: matchStage },

    {
      $facet: {
        /* 📦 PAGINATED REVIEWS */
        reviews: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },

          {
            $lookup: {
              from: "users",
              localField: "customer",
              foreignField: "_id",
              as: "customer",
            },
          },
          { $unwind: "$customer" },

          {
            $project: {
              rating: 1,
              comment: 1,
              createdAt: 1,

              "customer._id": 1,
              "customer.name": 1,
            },
          },
        ],

        /* 📊 STATS */
        stats: [
          {
            $group: {
              _id: null,
              average: { $avg: "$rating" },
              total: { $sum: 1 },

              five: {
                $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] },
              },
              four: {
                $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] },
              },
              three: {
                $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] },
              },
              two: {
                $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] },
              },
              one: {
                $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] },
              },
            },
          },
        ],

        /* 🔢 TOTAL (for pagination) */
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  /* ---------------- FORMAT ---------------- */

  const reviews = result[0]?.reviews || [];
  const stats = result[0]?.stats[0] || {};
  const total = result[0]?.totalCount[0]?.count || 0;

  const average = stats.average ? Number(stats.average.toFixed(1)) : 0;

  const breakdown = {
    5: stats.five || 0,
    4: stats.four || 0,
    3: stats.three || 0,
    2: stats.two || 0,
    1: stats.one || 0,
  };

  /* ---------------- RESPONSE ---------------- */

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    data: {
      reviews,
      average,
      total,
      breakdown,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

export const getCookMealType = asyncHandler(async (req, res) => {
  const cook = await Cook.findOne({ user: req.params.id }).select(
    "_id mealType",
  );

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Fetched successfully",
    data: cook,
  });
});
