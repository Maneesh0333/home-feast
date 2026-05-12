import AppError from "../utils/AppError.js";
import User from "../models/User.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import mongoose from "mongoose";
import Cook from "../models/Cook.model.js";
import Subscription from "../models/Subscription.model.js";

export const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id).select("name email phone city");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (!Object.keys(req.body).length) {
    throw new AppError("No valid fields provided for update", 400);
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      },
    ).select("name email phone city");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError("Email already in use", 400);
    }
    throw err;
  }
});

export const getHomeStats = asyncHandler(async (req, res) => {
  const [verified, subscription, topCookArray] = await Promise.all([
    Cook.countDocuments({ verificationStatus: "Approved" }),
    Subscription.countDocuments({
      $or: [{ status: "active" }, { status: "expired" }],
    }),
    Cook.aggregate([
      {
        $sort: {
          "rating.average": -1,
          "rating.totalReviews": -1,
        },
      },
      { $limit: 1 },
      {
        $lookup: {
          from: "plans",
          let: { cookId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$cook", "$$cookId"],
                },
              },
            },
            {
              $sort: { price: 1 },
            },
            {
              $project: {
                _id: 0,
                type: 1,
                price: 1,
              },
            },
          ],
          as: "plans",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$user" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$userId"],
                },
              },
            },

            {
              $project: {
                _id: 1,
                name: 1,
                city: 1,
              },
            },
          ],

          as: "user",
        },
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          user: 1,
          kitchenName: 1,
          average: "$rating.average",
          totalReviews: "$rating.totalReviews",
          plans: 1,
        },
      },
    ]),
  ]);

  res.status(200).json({
    success: true,
    message: "Stats retrieved successfully",
    data: {
      VerifiedCooks: verified,
      Subscription: subscription,
      TopCook: topCookArray[0] || null, 
    },
  });
});
