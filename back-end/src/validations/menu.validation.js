import * as yup from "yup";

/* -------------------- CREATE MENU -------------------- */
export const createMenuSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Dish name is required")
      .min(2, "Dish name must be at least 2 characters")
      .max(50, "Dish name cannot exceed 50 characters"),

    price: yup
      .number()
      .typeError("Price must be a number")
      .required("Price is required")
      .positive("Price must be greater than 0"),

    type: yup
      .string()
      .oneOf(["Veg", "Non-Veg"])
      .required("Type is required")
      .default("veg"),

    status: yup
      .string()
      .oneOf(["Active", "Inactive"])
      .default("Active"),

    calories: yup
      .number()
      .typeError("Calories must be a number")
      .required("Calories is required")
      .positive("Calories must be greater than 0"),

    time: yup
      .string()
      .oneOf(["Lunch", "Dinner"])
      .required(),

    description: yup
      .string()
      .trim()
      .max(100, "Description cannot exceed 100 characters")
      .optional()
  })
  .noUnknown(true, "Unknown field is not allowed");


/* -------------------- UPDATE MENU -------------------- */
export const updateMenuSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .min(2, "Dish name must be at least 2 characters")
      .max(50, "Dish name cannot exceed 50 characters"),

    price: yup
      .number()
      .typeError("Price must be a number")
      .positive("Price must be greater than 0"),

    type: yup
      .string()
      .oneOf(["veg", "nonveg"], "Invalid type"),

    status: yup
      .string()
      .oneOf(["Active", "Inactive"], "Invalid status"),

    calories: yup
      .number()
      .typeError("Calories must be a number")
      .positive("Calories must be greater than 0"),

    time: yup
      .string()
      .oneOf(["lunch", "dinner"], "Invalid time"),

    description: yup
      .string()
      .trim()
      .max(100, "Description cannot exceed 100 characters"),
  })
  .test(
    "at-least-one-field",
    "At least one field must be provided for update",
    (value) => value && Object.keys(value).length > 0
  )
  .noUnknown(true, "Unknown field is not allowed");