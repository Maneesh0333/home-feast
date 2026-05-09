import AppError from "../utils/AppError.js";
import User from "../models/User.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import mongoose from "mongoose";

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
