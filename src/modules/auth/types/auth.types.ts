import type { Types } from "mongoose";

import type { PublicUser } from "../../users/helpers/user.mapper.js";

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

// ---------- | Authentication Result | ----------

export interface AuthenticationResult {
  user: PublicUser;

  tokens: AuthTokens;
}
