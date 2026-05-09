import * as yup from "yup";

export const subscriptionSchema = yup.object({
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
    .required("Start date is required")
});