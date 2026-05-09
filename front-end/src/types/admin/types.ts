import {
  createCategorySchema,
  updateCategorySchema,
} from "@/schemas/admin/category.schema";
import * as yup from "yup";

export type CreateCategorySchemaType = yup.InferType<
  typeof createCategorySchema
>;
export type UpdateCategorySchemaType = yup.InferType<
  typeof updateCategorySchema
>;

export type FormType = CreateCategorySchemaType | UpdateCategorySchemaType;
