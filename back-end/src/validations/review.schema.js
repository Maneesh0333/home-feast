import * as yup from "yup";

export const reviewSchema = yup
  .object({
    subscriptionId: yup.string().trim().required("Subscription Id is required"),
    rating: yup
      .number()
      .required("Rating is required")
      .min(1, "Minimum 1 star")
      .max(5, "Maximum 5 stars"),

    comment: yup
      .string()
      .trim()
      .max(300, "Comment cannot exceed 300 characters")
      .optional()
      .default(""),
  })
  .noUnknown(true, "Unknown fields are not allowed");
