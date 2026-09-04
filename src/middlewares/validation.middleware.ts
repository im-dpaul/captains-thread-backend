import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

import { HTTP_STATUS } from "../constants/http.constants.js";
import ApiError from "../utils/ApiError.js";

type ValidationTarget = "body" | "query" | "params";

const validate = (schema: ZodType, target: ValidationTarget) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const value = req[target];

    const result = schema.safeParse(value);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      next(new ApiError(HTTP_STATUS.BAD_REQUEST, "Validation failed.", errors));

      return;
    }

    switch (target) {
      case "body":
        req.body = result.data;
        break;

      case "query":
        Object.assign(req.query, result.data);
        break;

      case "params":
        Object.assign(req.params, result.data);
        break;
    }

    next();
  };
};

export default validate;
