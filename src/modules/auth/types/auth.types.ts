import type { Types } from "mongoose";

// ---------- | Register User Input | ----------

export interface RegisterUserInput {
  firstName: string;

  lastName?: string;

  email: string;

  phone?: string;

  password: string;

  avatar?: Types.ObjectId;
}

// ---------- | Login User Input | ----------

export interface LoginUserInput {
  email: string;

  password: string;

  deviceId?: string;

  deviceName?: string;
}

// ---------- | Authentication Tokens | ----------

export interface AuthTokens {
  accessToken: string;

  refreshToken: string;
}

// ---------- | Authenticated User | ----------

export interface AuthenticatedUser {
  id: string;

  firstName: string;

  lastName: string | null;

  email: string;

  phone: string | null;

  avatar: string | null;

  status: string;

  emailVerified: boolean;

  phoneVerified: boolean;

  lastLoginAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

// ---------- | Authentication Result | ----------

export interface AuthenticationResult {
  user: AuthenticatedUser;

  tokens: AuthTokens;
}
