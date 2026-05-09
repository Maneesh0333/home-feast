import * as yup from "yup";

/* -------------------- CREATE -------------------- */
export const createMenuSchema = yup.object({
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
    .mixed<"veg" | "nonveg">()
    .oneOf(["veg", "nonveg"], "Invalid type")
    .required("Type is required")
    .default("veg"),

  status: yup
    .mixed<"Active" | "Inactive">()
    .oneOf(["Active", "Inactive"])
    .default("Active"),

  calories: yup
    .number()
    .typeError("Calories must be a number")
    .required("Calories is required")
    .positive("Calories must be greater than 0"),

  time: yup
    .mixed<"lunch" | "dinner">()
    .oneOf(["lunch", "dinner"])
    .default("lunch"),

  description: yup
    .string()
    .trim()
    .max(100, "Description cannot exceed 100 characters")
    .optional()
    .default(""),
});

/* -------------------- UPDATE -------------------- */
export const updateMenuSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Dish name must be at least 2 characters")
    .max(50, "Dish name cannot exceed 50 characters")
    .default(""),

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .default(0),

  type: yup
    .mixed<"veg" | "nonveg">()
    .oneOf(["veg", "nonveg"], "Invalid type")
    .default("veg"),

  status: yup
    .mixed<"Active" | "Inactive">()
    .oneOf(["Active", "Inactive"])
    .default("Active"),

  calories: yup
    .number()
    .typeError("Calories must be a number")
    .positive("Calories must be greater than 0")
    .default(0),

  time: yup
    .mixed<"lunch" | "dinner">()
    .oneOf(["lunch", "dinner"])
    .default("lunch"),

  description: yup
    .string()
    .trim()
    .max(100, "Description cannot exceed 100 characters")
    .default(""),
});
