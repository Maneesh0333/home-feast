import { reviewSchema } from "@/schemas/user/review.schema";
import { subscriptionSchema } from "@/schemas/user/subscription.schema";
import { userProfileSchema } from "@/schemas/user/userProfile.schema";
import * as yup from "yup";

export type subscriptionSchemaType = yup.InferType<
  typeof subscriptionSchema
>;

export type UserProfileFormValues = yup.InferType<typeof userProfileSchema>;

export type ReviewFormType = yup.InferType<typeof reviewSchema>;




