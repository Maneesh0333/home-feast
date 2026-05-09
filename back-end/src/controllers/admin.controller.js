import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import mongoose from "mongoose";
import Cook from "../models/Cook.model.js";
import Subscription from "../models/Subscription.model.js";

export const getUsers = asyncHandler(async (req, res) => {
  const { status = "All", page = 1, limit = 5, search = "" } = req.query;

  /* ---------------- Pagination ---------------- */
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(20, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  /* ---------------- Query ---------------- */
  const query = { role: "User" };

  if (status !== "All") {
    query.status = status;
  }

  if (search.trim()) {
    const regex = new RegExp(search, "i");

    query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }

  /* ---------------- Promises ---------------- */
  const usersPromise = User.find(query)
    .select("-role -signupAs")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalFilteredPromise = User.countDocuments(query);
  const totalUsersPromise = User.countDocuments({ role: "User" });

  const statsPromise = User.aggregate([
    { $match: { role: "User" } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  /* ---------------- Execute ---------------- */
  const [users, totalFiltered, totalUsers, statsArray] = await Promise.all([
    usersPromise,
    totalFilteredPromise,
    totalUsersPromise,
    statsPromise,
  ]);

  /* ---------------- Stats ---------------- */
  let stats = { Active: 0, Blocked: 0 };

  statsArray.forEach((s) => {
    stats[s._id] = s.count;
  });

  /* ---------------- Response ---------------- */
  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    data: {
      users,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalUsers,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: users.length,
    },
  });
});

export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "Admin") {
    throw new AppError("Admin cannot be blocked", 400);
  }

  user.status = "Blocked";
  await user.save();

  res.status(200).json({
    success: true,
    message: "User blocked successfully",
  });
});

export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.status = "Active";
  await user.save();

  res.status(200).json({
    success: true,
    message: "User unblocked successfully",
  });
});

export const getCooks = asyncHandler(async (req, res) => {
  const {
    status = "All",
    page = 1,
    limit = 5,
    search = "",
    view = "applications",
  } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 20);
  const skip = (pageNum - 1) * limitNum;

  /* ---------------- Filters ---------------- */
  const BaseStage = {};
  const matchStage = {};

  if (view === "cooks") {
    BaseStage.verificationStatus = "Approved";
  }

  if (status !== "All") {
    if (view === "applications") {
      BaseStage.verificationStatus = status;
    }

    if (view === "cooks") {
      matchStage["user.status"] = status;
    }
  }

  if (search.trim()) {
    const regex = new RegExp(search, "i");

    matchStage.$or = [
      { "user.name": regex },
      { "user.email": regex },
      { "user.phone": regex },
    ];
  }

  /* ---------------- Pipeline ---------------- */

  const pipeline = [];

  pipeline.push({ $match: BaseStage });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user",
    },
  });

  pipeline.push({ $unwind: "$user" });

  pipeline.push({
    $facet: {
      cooks: [
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },

        {
          $project: {
            verificationStatus: 1,
            createdAt: 1,
            bio: 1,
            city: 1,
            rating: 1,
            cuisines: 1,
            "user._id": 1,
            "user.name": 1,
            "user.email": 1,
            "user.phone": 1,
            "user.status": 1,
            "user.city": 1,
          },
        },
      ],

      stats: [
        {
          $group: {
            _id: view === "cooks" ? "$user.status" : "$verificationStatus",
            count: { $sum: 1 },
          },
        },
      ],

      totalFiltered: [{ $match: matchStage }, { $count: "count" }],

      totalCooks: [
        ...(view === "cooks"
          ? [{ $match: { verificationStatus: "Approved" } }]
          : []),
        { $count: "count" },
      ],
    },
  });

  /* ---------------- Execute ---------------- */

  const result = await Cook.aggregate(pipeline);

  const cooks = result[0].cooks;

  const totalFiltered = result[0].totalFiltered[0]?.count || 0;
  const totalCooks = result[0].totalCooks[0]?.count || 0;

  const statsArray = result[0].stats;

  let stats =
    view === "cooks"
      ? { Active: 0, Blocked: 0 }
      : { Pending: 0, Approved: 0, Rejected: 0 };

  statsArray.forEach((s) => {
    stats[s._id] = s.count;
  });

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    data: {
      cooks,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalCooks,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: cooks.length,
    },
  });
});

export const approveCook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Id", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cook = await Cook.findById(id)
      .select("verificationStatus user")
      .session(session);

    if (!cook) {
      throw new AppError("Cook not found", 404);
    }

    if (cook.verificationStatus === "Approved") {
      throw new AppError("Already approved", 400);
    }

    await Cook.updateOne(
      { _id: id },
      { $set: { verificationStatus: "Approved" } },
      { session },
    );

    const userUpdate = await User.updateOne(
      { _id: cook.user },
      { $set: { role: "Cook" } },
      { session },
    );

    if (userUpdate.matchedCount === 0) {
      throw new AppError("Associated user not found", 404);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Cook approved successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const rejectCook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Id", 400);
  }

  const cook = await Cook.findById(id).select("verificationStatus");

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  if (cook.verificationStatus === "Rejected") {
    throw new AppError("Already rejected", 400);
  }

  const result = await Cook.updateOne(
    { _id: id },
    { $set: { verificationStatus: "Rejected" } },
  );

  // Optional safety check
  if (result.modifiedCount === 0) {
    throw new AppError("Failed to reject cook", 500);
  }

  res.status(200).json({
    success: true,
    message: "Cook rejected",
  });
});


export const getAdminOverview = asyncHandler(async (req, res) => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);

  /* ---------------- STATS ---------------- */

  const [
    totalUsers,
    verifiedCooks,
    activeSubscribers,
    revenueAgg,
    chartAgg,
  ] = await Promise.all([
    User.countDocuments(),

    Cook.countDocuments({
      verificationStatus: "Approved",
    }),

    Subscription.countDocuments({
      status: "active",
    }),

    Subscription.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]),

    /* 🔹 CHART (last 7 days revenue) */
    Subscription.aggregate([
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
    ]),
  ]);

  const revenue = revenueAgg[0]?.total || 0;

  /* ---------------- FILL MISSING DAYS ---------------- */

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

  /* ---------------- RESPONSE ---------------- */

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        verifiedCooks,
        activeSubscribers,
        revenue,
      },
      chartData,
    },
  });
});