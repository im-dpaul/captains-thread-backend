import type { Types } from "mongoose";

import UserSession from "../models/user-session.model.js";
import type { IUserSession } from "../types/user-session.types.js";

// ---------- | Create Session | ----------

const createSession = async (sessionData: Partial<IUserSession>): Promise<IUserSession> => {
  const session = await UserSession.create(sessionData);

  return session;
};

// ---------- | Find Session By ID | ----------

const findSessionById = async (
  sessionId: Types.ObjectId | string,
): Promise<IUserSession | null> => {
  return UserSession.findById(sessionId).select("+refreshTokenHash").exec();
};

// ---------- | Find Session By User ID | ----------

const findSessionsByUserId = async (userId: Types.ObjectId | string): Promise<IUserSession[]> => {
  return UserSession.find({
    userId,
  })
    .sort({
      createdAt: -1,
    })
    .exec();
};

// ---------- | Revoke Session | ----------

const revokeSession = async (sessionId: Types.ObjectId | string): Promise<IUserSession | null> => {
  return UserSession.findByIdAndUpdate(
    sessionId,
    {
      $set: {
        revokedAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).exec();
};

// ---------- | Update Session Usage | ----------

const updateSessionUsage = async (
  sessionId: Types.ObjectId | string,
): Promise<IUserSession | null> => {
  return UserSession.findByIdAndUpdate(
    sessionId,
    {
      $set: {
        lastUsedAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).exec();
};

// ---------- | Delete Expired Sessions | ----------

const deleteExpiredSessions = async (): Promise<void> => {
  await UserSession.deleteMany({
    expiresAt: {
      $lte: new Date(),
    },
  }).exec();
};

// ---------- | Exports | ----------

export {
  createSession,
  deleteExpiredSessions,
  findSessionById,
  findSessionsByUserId,
  revokeSession,
  updateSessionUsage,
};
