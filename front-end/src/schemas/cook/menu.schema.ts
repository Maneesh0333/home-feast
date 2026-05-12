import * as yup from "yup";

// Define a shared interface so TypeScript knows exactly what values to expect
export interface MenuFormValues {
  name: string;
  price: number;
  type: "Veg" | "Non-Veg";
  status: "Active" | "Inactive";
  calories: number;
  time: "Lunch" | "Dinner";
  description: string;
}

/* -------------------- CREATE SCHEMA -------------------- */
export const createMenuSchema: yup.ObjectSchema<MenuFormValues> = yup.object({
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
    .mixed<"Veg" | "Non-Veg">()
    .oneOf(["Veg", "Non-Veg"] as const, "Invalid type") // 'as const' is critical here
    .required("Type is required")
    .default("Veg"),
  status: yup
    .mixed<"Active" | "Inactive">()
    .oneOf(["Active", "Inactive"] as const)
    .default("Active")
    .required(),
  calories: yup
    .number()
    .typeError("Calories must be a number")
    .required("Calories is required")
    .positive("Calories must be greater than 0"),
  time: yup
    .mixed<"Lunch" | "Dinner">()
    .oneOf(["Lunch", "Dinner"] as const)
    .default("Lunch")
    .required(),
  description: yup
    .string()
    .trim()
    .max(100, "Description cannot exceed 100 characters")
    .default(""),
});

/* -------------------- UPDATE SCHEMA -------------------- */
// Reuse the same interface for the update schema
export const updateMenuSchema: yup.ObjectSchema<MenuFormValues> = createMenuSchema.clone();
