import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

import { env } from "../config/env.js";
import { HTTP_STATUS } from "../constants/http.constants.js";
import ApiError from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

const errorMiddleware: ErrorRequestHandler = (error, req, res, _next): void => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message: string = "Internal server error.";
  let errors: unknown[] = [];

  // ---------- | ApiError | ----------

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  }

  // ---------- | Zod Validation Error | ----------
  else if (error instanceof ZodError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Validation failed.";

    errors = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // ---------- | Mongoose Validation Error | ----------
  else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Database validation failed.";

    errors = Object.values(error.errors).map((validationError) => ({
      field: validationError.path,
      message: validationError.message,
    }));
  }

  // ---------- | Mongoose Cast Error | ----------
  else if (error instanceof mongoose.Error.CastError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Invalid request data.";

    errors = [
      {
        field: error.path,
        message: `Invalid value for ${error.path}.`,
      },
    ];
  }

  // ---------- | MongoDB Duplicate Key Error | ----------
  else if (isMongoDuplicateKeyError(error)) {
    statusCode = HTTP_STATUS.CONFLICT;
    message = "A resource with the provided value already exists.";

    errors = Object.entries(error.keyValue).map(([field, value]) => ({
      field,
      message: `${field} '${String(value)}' already exists.`,
    }));
  }

  // ---------- | Native Error | ----------
  else if (error instanceof Error) {
    message = env.nodeEnv === "development" ? error.message : "Internal server error.";
  }

  // ---------- | Logging | ----------

  logger.error("API error.", {
    requestId: res.locals.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    },
  });

  // ---------- | Response | ----------

  res.status(statusCode).json({
    statusCode,
    success: false,
    data: null,
    message,
    errors,
  });
};

// ---------- | Mongo Duplicate Key Detection | ----------

interface MongoDuplicateKeyError extends Error {
  code: 11000;
  keyValue: Record<string, unknown>;
}

const isMongoDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000 &&
    "keyValue" in error
  );
};

export default errorMiddleware;
