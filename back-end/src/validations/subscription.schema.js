import * as yup from "yup";

export const subscriptionSchema = yup
  .object({
    cookId: yup.string().trim().required("Cook Id is required"),
    planType: yup
      .string()
      .oneOf(["daily", "weekly", "monthly"])
      .required("Plan type is required"),
    deliveryAddress: yup
      .string()
      .trim()
      .required("Delivery address is required")
      .min(5, "Address is too short"),

    mealTime: yup
      .string()
      .oneOf(["lunch", "dinner", "both"])
      .required("Select meal time"),

    startDate: yup
      .date()
      .typeError("Start date is required")
      .required("Start date is required"),
  })
  .noUnknown(true, "Unknown fields are not allowed");
