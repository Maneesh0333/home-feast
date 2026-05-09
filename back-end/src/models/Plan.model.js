import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    cook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cook",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
export default Plan;