import { createMenuSchema, updateMenuSchema } from "@/schemas/cook/menu.schema";
import * as yup from "yup";

export type CreateMenuSchemaType = yup.InferType<
  typeof createMenuSchema
>;
export type UpdateMenuSchemaType = yup.InferType<
  typeof updateMenuSchema
>;

export type FormType = CreateMenuSchemaType | UpdateMenuSchemaType;
