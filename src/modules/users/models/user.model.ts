import { model, Schema } from "mongoose";

import type { IUser, UserStatus } from "../types/user.types.js";
import { AUTH_CONSTANTS } from "../../auth/auth.constants.js";

// ---------- | User Schema | ----------

const userSchema = new Schema<IUser>(
  {
    // ---------- | Basic User Information | ----------

    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
      minlength: [2, "First name must be at least 2 characters."],
      maxlength: [50, "First name cannot exceed 50 characters."],
    },

    lastName: {
      type: String,
      default: null,
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      maxlength: [100, "Email cannot exceed 100 characters."],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address."],
    },

    phone: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters."],
    },

    avatar: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Media",
    },

    // ---------- | Authentication | ----------

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [
        AUTH_CONSTANTS.PASSWORD.MIN_LENGTH,
        `Password must be at least ${AUTH_CONSTANTS.PASSWORD.MIN_LENGTH} characters.`,
      ],
      maxlength: [
        AUTH_CONSTANTS.PASSWORD.MAX_LENGTH,
        `Password cannot exceed ${AUTH_CONSTANTS.PASSWORD.MAX_LENGTH} characters.`,
      ],
      select: false,
    },

    // ---------- | Account Status | ----------

    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "INACTIVE", "BLOCKED", "SUSPENDED", "DELETED"] satisfies UserStatus[],
        message: "Invalid user status.",
      },
      default: "ACTIVE",
      required: true,
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ---------- | User Model | ----------

const User = model<IUser>("User", userSchema);

export default User;
