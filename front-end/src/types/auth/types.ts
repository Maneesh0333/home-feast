import {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
} from "@/schemas/auth/auth.schema";
import * as yup from "yup";

export type RegisterFormType = yup.InferType<typeof registerSchema>;
export type LoginFormType = yup.InferType<typeof loginSchema>;
export type VerifyFormType = yup.InferType<typeof verifyOtpSchema>;
