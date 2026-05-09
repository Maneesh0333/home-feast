import * as yup from "yup";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const isAfter = (start?: string, end?: string) => {
  if (!start || !end) return true;

  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  return toMin(end) > toMin(start);
};

export const updateCookProfileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .notRequired()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 30 characters"),

  email: yup.string().trim().notRequired().email("Invalid email"),

  phone: yup
    .string()
    .trim()
    .notRequired()
    .matches(/^[0-9]{10,15}$/, "Invalid phone number"),

  city: yup
    .string()
    .trim()
    .max(30, "City is too long")
    .notRequired()
    .default(""),

  mealType: yup
    .string()
    .trim()
    .oneOf(["Veg", "Non-Veg", "Both"])
    .notRequired()
    .default("Both"),

  category: yup
    .string()
    .trim()
    .notRequired()
    .default(""),

  kitchenName: yup
    .string()
    .trim()
    .max(30, "Kitchen Name must be at most 30 characters")
    .notRequired()
    .default(""),

  bio: yup
    .string()
    .trim()
    .max(300, "Bio must be at most 30 characters")
    .notRequired()
    .default(""),

  experienceYears: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .min(0, "Experience cannot be negative")
    .max(60, "Invalid experience value")
    .notRequired()
    .default(0),

  payment: yup
    .array()
    .of(yup.string().oneOf(["Cash", "UPI"]))
    .max(2, "Max 2 payment methods allowed")
    .notRequired()
    .default([]),

  lunchDeliveryTime: yup
    .object({
      start: yup.string().matches(timeRegex, "Invalid time").notRequired(),
      end: yup
        .string()
        .matches(timeRegex, "Invalid time")
        .test("is-after", "End must be after start", function (value) {
          return isAfter(this.parent.start, value);
        })
        .notRequired(),
    })
    .notRequired(),

  dinnerDeliveryTime: yup
    .object({
      start: yup.string().matches(timeRegex, "Invalid time").notRequired(),
      end: yup
        .string()
        .matches(timeRegex, "Invalid time")
        .test("is-after", "End must be after start", function (value) {
          return isAfter(this.parent.start, value);
        })
        .notRequired(),
    })
    .notRequired(),
});
