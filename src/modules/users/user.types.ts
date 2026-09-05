import type { HydratedDocument, Types } from "mongoose";

// ---------- | User Status | ----------

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "SUSPENDED" | "DELETED";

// ---------- | User | ----------

export interface IUser {
  _id: Types.ObjectId;

  firstName: string;

  lastName: string | null;

  email: string;

  phone: string | null;

  password: string;

  avatar: Types.ObjectId | null;

  status: UserStatus;

  emailVerified: boolean;

  phoneVerified: boolean;

  lastLoginAt: Date | null;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}

// ---------- | User Document | ----------

export type UserDocument = HydratedDocument<IUser>;
