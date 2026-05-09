import * as yup from "yup";

export const createCategorySchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(30, "Category name cannot exceed 30 characters"),

  description: yup
    .string()
    .trim()
    .max(100, "Description cannot exceed 100 characters")
    .optional()
    .default(""),

  status: yup
    .mixed<"Active" | "Inactive">()
    .oneOf(["Active", "Inactive"])
    .required()
    .default("Active"),
});

export const updateCategorySchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(30, "Category name cannot exceed 30 characters"),

  description: yup
    .string()
    .trim()
    .max(100, "Description cannot exceed 100 characters")
    .default(""),

  status: yup
    .mixed<"Active" | "Inactive">()
    .oneOf(["Active", "Inactive"])
    .default("Active"),
});