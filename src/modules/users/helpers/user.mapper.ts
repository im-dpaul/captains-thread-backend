import type { IUser } from "../types/user.types.js";

// ---------- | Public User | ----------

export interface PublicUser {
  id: string;

  firstName: string;

  lastName: string | null;

  email: string;

  phone: string | null;

  avatar: string | null;

  status: IUser["status"];

  emailVerified: boolean;

  phoneVerified: boolean;

  lastLoginAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

// ---------- | Map User | ----------

const mapUserToPublic = (user: IUser): PublicUser => {
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

export default mapUserToPublic;
