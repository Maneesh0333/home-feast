import { asyncHandler } from "../middleware/async.middleware.js";
import Menu from "../models/Menu.model.js";
import Cook from "../models/Cook.model.js";

import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";

export const createMenu = asyncHandler(async (req, res) => {
  const { name, price, type, description, time, calories } = req.body;
  const userId = req.user.id;

  const cook = await Cook.findOne({ user: userId }).select("_id");

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  const existing = await Menu.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
    cook: cook._id,
  });

  if (existing) {
    throw new AppError("Menu item already exists", 400);
  }

  const item = await Menu.create({
    name,
    price,
    type,
    description,
    time,
    calories,
    cook: cook._id,
  });

  res.status(201).json({
    success: true,
    message: "Menu item added successfully",
  });
});

export const getTodayMenu = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const userId = req.user.id;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const cook = await Cook.findOne({ user: userId }).select("_id");

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  const menu = await Menu.find({
    cook: cook._id,
    availableToday: true,
    status: "Active",
  })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await Menu.countDocuments({
    cook: cook._id,
    availableToday: true,
    status: "Active",
  });

  res.status(200).json({
    success: true,
    message: "Today Menu fetched successfully",
    data: { menu, totalPages: Math.ceil(total / limitNum), page: pageNum },
  });
});

export const getMenu = asyncHandler(async (req, res) => {
  const { type = "All", page = 1, limit = 5, search = "" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const cook = await Cook.findOne({ user: req.user.id }).select("_id");

  if (!cook) {
    throw new AppError("Cook not found", 404);
  }

  const matchStage = {
    cook: cook._id,
  };

  if (type !== "All") {
    matchStage.type = type;
  }

  if (search.trim()) {
    matchStage.name = { $regex: search, $options: "i" };
  }

  const pipeline = [
    {
      $facet: {
        /* 🔹 Filtered menu */
        menu: [
          { $match: matchStage },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
        ],

        /* 🔹 Filtered count */
        totalFiltered: [{ $match: matchStage }, { $count: "count" }],

        /* 🔹 Global stats (UNFILTERED like categories) */
        stats: [
          { $match: { cook: cook._id } },
          {
            $group: {
              _id: "$type", // 👈 IMPORTANT: veg / nonveg
              count: { $sum: 1 },
            },
          },
        ],

        /* 🔹 Total menu items */
        totalMenu: [{ $match: { cook: cook._id } }, { $count: "count" }],
      },
    },
  ];

  const result = await Menu.aggregate(pipeline);
  const data = result[0];

  /* Build stats object (same pattern as categories) */
  const stats = { Veg: 0, "Non-Veg": 0 };

  (data.stats || []).forEach((s) => {
    stats[s._id] = s.count;
  });

  const totalFiltered = data.totalFiltered?.[0]?.count || 0;
  const totalMenu = data.totalMenu?.[0]?.count || 0;

  res.status(200).json({
    success: true,
    message: "Fetched successfully",
    data: {
      menu: data.menu,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalMenu,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: data.menu.length,
    },
  });
});

export const enableMenu = asyncHandler(async (req, res) => {
  const item = await Menu.findByIdAndUpdate(
    req.params.id,
    { status: "Active" },
    { new: true },
  );

  if (!item) throw new AppError("Menu not found", 404);

  res.json({
    success: true,
    message: "Menu enabled successfully",
  });
});

export const disableMenu = asyncHandler(async (req, res) => {
  const item = await Menu.findByIdAndUpdate(
    req.params.id,
    { status: "Inactive" },
    { new: true },
  );

  if (!item) throw new AppError("Menu not found", 404);

  res.json({
    success: true,
    message: "Menu disabled successfully",
  });
});

export const updateMenu = asyncHandler(async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw new AppError("No fields provided for update", 400);
  }

  const allowedFields = [
    "name",
    "price",
    "type",
    "status",
    "description",
    "time",
    "calories",
  ];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const item = await Menu.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    throw new AppError("Menu item not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Menu updated successfully",
    data: item,
  });
});

export const toggleTodayMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);

  if (!menu) {
    throw new AppError("Menu not found", 404);
  }

  if (menu.status !== "Active") {
    throw new AppError("Inactive menu cannot be added to today", 400);
  }

  menu.availableToday = !menu.availableToday;
  await menu.save();

  res.status(200).json({
    success: true,
    message: `Menu ${
      menu.availableToday ? "added to today" : "removed from today"
    }`,
  });
});
