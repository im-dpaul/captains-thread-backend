import type { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../constants/http.constants.js";
import ApiError from "../utils/ApiError.js";

import { verifyAccessToken } from "../modules/auth/helpers/token.helper.js";

import { findUserById } from "../modules/users/repositories/user.repository.js";

const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication required."));

    return;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid authorization header."));

    return;
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await findUserById(payload.userId);

    if (!user) {
      next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "User account not found."));

      return;
    }

    if (user.status !== "ACTIVE") {
      next(new ApiError(HTTP_STATUS.FORBIDDEN, "Your account is not active."));

      return;
    }

    req.user = user;

    next();
  } catch {
    next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired access token."));
  }
};

export default authenticate;
