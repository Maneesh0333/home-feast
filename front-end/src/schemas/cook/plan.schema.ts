import * as yup from "yup";

/* ---------------- CREATE ---------------- */
export const createPlanSchema = yup.object({
  type: yup
    .mixed<"daily" | "weekly" | "monthly">()
    .oneOf(["daily", "weekly", "monthly"], "Invalid plan type")
    .required("Plan type is required"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0"),
});

/* ---------------- UPDATE ---------------- */
export const updatePlanSchema = yup.object({
  type: yup
    .mixed<"daily" | "weekly" | "monthly">()
    .oneOf(["daily", "weekly", "monthly"], "Invalid plan type")
    .required("Plan type is required"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
});
