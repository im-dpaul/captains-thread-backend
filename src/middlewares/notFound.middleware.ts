import type { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../constants/http.constants.js";
import ApiError from "../utils/ApiError.js";

const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFoundMiddleware;
