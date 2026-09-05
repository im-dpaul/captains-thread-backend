import { model, Schema } from "mongoose";

import type { IUserSession } from "../types/user-session.types.js";

// ---------- | User Session Schema | ----------

const userSessionSchema = new Schema<IUserSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    deviceId: {
      type: String,
      default: null,
      trim: true,
      maxlength: [200, "Device ID cannot exceed 200 characters."],
    },

    deviceName: {
      type: String,
      default: null,
      trim: true,
      maxlength: [200, "Device name cannot exceed 200 characters."],
    },

    ipAddress: {
      type: String,
      default: null,
      trim: true,
      maxlength: [45, "IP address cannot exceed 45 characters."],
    },

    userAgent: {
      type: String,
      default: null,
      trim: true,
      maxlength: [1000, "User agent cannot exceed 1000 characters."],
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },

    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ---------- | User Session Model | ----------

const UserSession = model<IUserSession>("UserSession", userSessionSchema);

export default UserSession;
