import mongoose from "mongoose";

// Helper validator to ensure end time > start time
const validateTimeRange = {
  validator: function () {
    // If start or end are missing (optional fields), skip validation
    if (this.start === undefined || this.end === undefined) return true;
    return this.end > this.start;
  },
  message: "Delivery end time must be after start time.",
};

const cookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      index: true,
    },
    kitchenName: {
      type: String,
      default: "",
      maxlength: 30,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 300,
      default: "",
      trim: true,
    },
    payment: {
      type: [{ type: String, enum: ["Cash", "UPI"] }],
      validate: {
        validator: (val) => val.length <= 2 && new Set(val).size === val.length,
        message: "Select up to 2 unique payment methods.",
      },
      default: ["Cash"],
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
      max: 60,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0, min: 0 },
    },
    mealType: {
      type: String,
      enum: ["Veg", "Non-Veg", "Both"],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },

    lunchDeliveryTime: {
      start: { type: Number, min: 0, max: 1439 },
      end: { type: Number, min: 0, max: 1439, validate: validateTimeRange },
      display: { type: String, trim: true },
    },

    dinnerDeliveryTime: {
      start: { type: Number, min: 0, max: 1439 },
      end: { type: Number, min: 0, max: 1439, validate: validateTimeRange },
      display: { type: String, trim: true },
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

cookSchema.index({ location: "2dsphere" });

const Cook = mongoose.model("Cook", cookSchema);
export default Cook;
