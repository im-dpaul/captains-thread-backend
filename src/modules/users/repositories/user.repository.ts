import type { Types } from "mongoose";

import User from "../models/user.model.js";
import type { IUser } from "../types/user.types.js";

// ---------- | Find User By ID | ----------

const findUserById = async (userId: Types.ObjectId | string): Promise<IUser | null> => {
  return User.findById(userId).exec();
};

// ---------- | Find User By Email | ----------

const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({
    email: email.toLowerCase(),
  }).exec();
};

// ---------- | Find User By Email With Password | ----------

const findUserByEmailWithPassword = async (email: string): Promise<IUser | null> => {
  return User.findOne({
    email: email.toLowerCase(),
  })
    .select("+password")
    .exec();
};

// ---------- | Find User By Phone | ----------

const findUserByPhone = async (phone: string): Promise<IUser | null> => {
  return User.findOne({
    phone,
  }).exec();
};

// ---------- | Create User | ----------

const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = await User.create(userData);

  return user;
};

// ---------- | Update Last Login | ----------

const updateLastLogin = async (userId: Types.ObjectId): Promise<IUser | null> => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        lastLoginAt: new Date(),
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).exec();
};

// ---------- | Update Password | ----------

const updatePassword = async (userId: Types.ObjectId, password: string): Promise<IUser | null> => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        password,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  )
    .select("+password")
    .exec();
};

// ---------- | Exports | ----------

export {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  findUserByPhone,
  updateLastLogin,
  updatePassword,
};
