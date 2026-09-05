import type { IUser } from "../modules/users/types/user.types.js";

declare global {
  namespace Express {
    interface Locals {
      requestId: string;
    }
    interface Request {
      user?: IUser;
    }
  }
}

export {};
