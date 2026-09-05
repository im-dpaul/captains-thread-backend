import { Types } from "mongoose";

import { env } from "../../config/env.js";

import { comparePassword, hashPassword } from "./helpers/password.helper.js";
import { generateAccessToken, generateRefreshToken } from "./helpers/token.helper.js";
import { hashRefreshToken } from "./helpers/refresh-token.helper.js";

import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserByPhone,
  updateLastLogin,
} from "../users/repositories/user.repository.js";
import { createSession } from "../users/repositories/user-session.repository.js";

import type {
  AuthenticationResult,
  AuthenticatedUser,
  LoginUserInput,
  RegisterUserInput,
} from "./types/auth.types.js";
import type { IUser } from "../users/types/user.types.js";

// ---------- | Register User | ----------

const register = async (input: RegisterUserInput): Promise<AuthenticatedUser> => {
  const email = input.email.toLowerCase().trim();

  const existingEmailUser = await findUserByEmail(email);

  if (existingEmailUser) {
    throw new Error("An account with this email already exists.");
  }

  if (input.phone) {
    const existingPhoneUser = await findUserByPhone(input.phone);

    if (existingPhoneUser) {
      throw new Error("An account with this phone number already exists.");
    }
  }

  const password = await hashPassword(input.password);

  const user = await createUser({
    firstName: input.firstName,
    lastName: input.lastName ?? null,
    email,
    phone: input.phone ?? null,
    password,
    avatar: input.avatar ?? null,
    status: "ACTIVE",
    emailVerified: false,
    phoneVerified: false,
    lastLoginAt: null,
    deletedAt: null,
  });

  return mapUser(user);
};

// ---------- | Login User | ----------

const login = async (input: LoginUserInput): Promise<AuthenticationResult> => {
  const email = input.email.toLowerCase().trim();

  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active.");
  }

  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const sessionId = new Types.ObjectId();

  const refreshToken = generateRefreshToken(user._id.toString(), sessionId.toString());

  const refreshTokenHash = hashRefreshToken(refreshToken);

  await createSession({
    _id: sessionId,
    userId: user._id,
    refreshTokenHash,
    deviceId: input.deviceId ?? null,
    deviceName: input.deviceName ?? null,
    ipAddress: null,
    userAgent: null,
    expiresAt: getRefreshTokenExpirationDate(),
    lastUsedAt: null,
    revokedAt: null,
  });

  const accessToken = generateAccessToken(user._id.toString());

  const updatedUser = await updateLastLogin(user._id);

  return {
    user: mapUser(updatedUser ?? user),

    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

// ---------- | Map User | ----------

const mapUser = (user: IUser): AuthenticatedUser => {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar ? user.avatar.toString() : null,
    status: user.status,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// ---------- | Refresh Token Expiration | ----------

const getRefreshTokenExpirationDate = (): Date => {
  const expiration = env.refreshTokenExpiration;

  const match = expiration.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error("Invalid refresh token expiration configuration.");
  }

  const value = Number(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(Date.now() + value * multipliers[unit]);
};

// ---------- | Exports | ----------

export default {
  login,
  register,
};
