import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../../../config/env.js";

// ---------- | Access Token Payload | ----------

export interface AccessTokenPayload {
  userId: string;
}

// ---------- | Refresh Token Payload | ----------

export interface RefreshTokenPayload {
  userId: string;

  sessionId: string;
}

// ---------- | Generate Access Token | ----------

const generateAccessToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: env.accessTokenExpiration,
  };

  return jwt.sign(
    {
      userId,
    },
    env.accessTokenSecret,
    options,
  );
};

// ---------- | Generate Refresh Token | ----------

const generateRefreshToken = (userId: string, sessionId: string): string => {
  const options: SignOptions = {
    expiresIn: env.refreshTokenExpiration,
  };

  return jwt.sign(
    {
      userId,
      sessionId,
    },
    env.refreshTokenSecret,
    options,
  );
};

// ---------- | Verify Access Token | ----------

const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, env.accessTokenSecret);

  if (typeof decoded !== "object" || decoded === null || typeof decoded.userId !== "string") {
    throw new Error("Invalid access token payload.");
  }

  return {
    userId: decoded.userId,
  };
};

// ---------- | Verify Refresh Token | ----------

const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const decoded = jwt.verify(token, env.refreshTokenSecret);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string" ||
    typeof decoded.sessionId !== "string"
  ) {
    throw new Error("Invalid refresh token payload.");
  }

  return {
    userId: decoded.userId,
    sessionId: decoded.sessionId,
  };
};

// ---------- | Exports | ----------

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
