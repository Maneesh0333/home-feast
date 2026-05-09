import { asyncHandler } from "../middleware/async.middleware.js";
import Category from "../models/Category.model.js";
import AppError from "../utils/AppError.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description = "", status = "Active" } = req.body;

  const existing = await Category.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (existing) {
    throw new AppError("Category already exists", 400);
  }

  const category = await Category.create({
    name,
    description,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

/* -------------------- GET ALL -------------------- */
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: "Active" })
    .sort({ createdAt: -1 })
    .select("_id name description")
    .lean();

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

export const getCategories = asyncHandler(async (req, res) => {
  const { status = "All", page = 1, limit = 5, search = "" } = req.query;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const matchStage = {};

  if (status !== "All") {
    matchStage.status = status;
  }

  if (search.trim()) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const pipeline = [
    {
      $facet: {
        /* 🔹 Filtered data */
        categories: [
          { $match: matchStage },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
        ],

        /* 🔹 Filtered count */
        totalFiltered: [
          { $match: matchStage },
          { $count: "count" },
        ],

        /* 🔹 Global stats (unfiltered) */
        stats: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],

        /* 🔹 Total categories */
        totalCategories: [{ $count: "count" }],
      },
    },
  ];

  const result = await Category.aggregate(pipeline);

  const categories = result[0].categories;
  const totalFiltered = result[0].totalFiltered[0]?.count || 0;
  const totalCategories = result[0].totalCategories[0]?.count || 0;

  const stats = { Active: 0, Inactive: 0 };

  result[0].stats.forEach((s) => {
    stats[s._id] = s.count;
  });

  res.status(200).json({
    success: true,
    message: "Fetched successfully",
    data: {
      categories,
      stats,
      page: pageNum,
      limit: limitNum,
      total: totalFiltered,
      totalCategories,
      totalPages: Math.ceil(totalFiltered / limitNum),
      results: categories.length,
    },
  });
});

/* -------------------- ENABLE -------------------- */
export const enableCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { status: "Active" },
    { new: true },
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Category enabled successfully",
  });
});

/* -------------------- DISABLE -------------------- */
export const disableCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { status: "Inactive" },
    { new: true },
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Category disabled successfully",
  });
});

/* -------------------- UPDATE -------------------- */
export const updateCategory = asyncHandler(async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw new AppError("No fields provided for update", 400);
  }

  const allowedFields = ["name", "description", "status"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});
