import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    time: {
      type: String,
      enum: ["Lunch", "Dinner"],
      required: true,
    },

    calories: {
      type: Number,
      required: true,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["Veg", "Non-Veg"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    availableToday: {
      type: Boolean,
      default: false,
      index: true,
    },

    cook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cook",
      required: true,
    },
  },
  { timestamps: true },
);

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
