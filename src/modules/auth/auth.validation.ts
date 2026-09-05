import { z } from "zod";

import { AUTH_CONSTANTS } from "./auth.constants.js";

// ---------- | Password Schema | ----------

const passwordSchema = z
  .string()
  .min(
    AUTH_CONSTANTS.PASSWORD.MIN_LENGTH,
    `Password must be at least ${AUTH_CONSTANTS.PASSWORD.MIN_LENGTH} characters.`,
  )
  .max(
    AUTH_CONSTANTS.PASSWORD.MAX_LENGTH,
    `Password cannot exceed ${AUTH_CONSTANTS.PASSWORD.MAX_LENGTH} characters.`,
  );

// ---------- | Register Validation | ----------

const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name cannot exceed 50 characters."),

  lastName: z.string().trim().max(50, "Last name cannot exceed 50 characters.").optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address.")
    .max(100, "Email cannot exceed 100 characters."),

  phone: z.string().trim().max(20, "Phone number cannot exceed 20 characters.").optional(),

  password: passwordSchema,

  avatar: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Avatar must be a valid ObjectId.")
    .optional(),
});

// ---------- | Login Validation | ----------

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email address."),

  password: z.string().min(1, "Password is required."),

  deviceId: z.string().trim().max(200, "Device ID cannot exceed 200 characters.").optional(),

  deviceName: z.string().trim().max(200, "Device name cannot exceed 200 characters.").optional(),
});

// ---------- | Refresh Token Validation | ----------

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required."),
});

// ---------- | Exports | ----------

export { loginSchema, refreshTokenSchema, registerSchema };
