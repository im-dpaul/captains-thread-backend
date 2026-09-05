import type { Types } from "mongoose";

// ---------- | User Session | ----------

export interface IUserSession {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  refreshTokenHash: string;

  deviceId: string | null;

  deviceName: string | null;

  ipAddress: string | null;

  userAgent: string | null;

  expiresAt: Date;

  lastUsedAt: Date | null;

  revokedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
