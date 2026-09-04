import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const MAX_LOG_VALUE_LENGTH = 5_000;

const SENSITIVE_FIELDS = new Set([
  "password",
  "oldpassword",
  "newpassword",
  "confirmpassword",
  "currentpassword",
  "refreshtoken",
  "accesstoken",
  "emailverificationtoken",
  "passwordresettoken",
  "verificationtoken",
  "resettoken",
  "token",
  "authorization",
  "cookie",
  "secret",
  "apikey",
  "api_key",
  "cardnumber",
  "card_number",
  "cvv",
  "cvc",
]);

type LogValue =
  string | number | boolean | null | undefined | Date | LogValue[] | { [key: string]: LogValue };

interface ApiResponseBody {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: unknown;
  meta?: unknown;
  errors?: unknown;
}

// ---------- | Request Logger | ----------

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = process.hrtime.bigint();

  const originalJson = res.json.bind(res);

  let responseBody: unknown = null;

  res.json = ((body: unknown) => {
    responseBody = body;

    return originalJson(body);
  }) as Response["json"];

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();

    const durationMs = Number(endTime - startTime) / 1_000_000;

    const success = res.statusCode < 400;

    const logData = {
      type: "api_response",

      requestId: res.locals.requestId,

      method: req.method,
      path: req.originalUrl,

      statusCode: res.statusCode,
      success,

      durationMs: Number(durationMs.toFixed(2)),

      request: {
        query: sanitizeValue(req.query),
        params: sanitizeValue(req.params),
        body: sanitizeValue(req.body),
      },

      response: env.logResponseBody ? extractResponseData(responseBody) : "[DISABLED]",
    };

    if (success) {
      logger.info("API request completed.", logData);
    } else {
      logger.error("API request failed.", logData);
    }
  });

  next();
};

// ---------- | Extract Standard API Response | ----------

const extractResponseData = (body: unknown): unknown => {
  if (!body || typeof body !== "object") {
    return sanitizeValue(body);
  }

  const response = body as ApiResponseBody;

  return {
    statusCode: response.statusCode,
    success: response.success,
    message: response.message,
    data: sanitizeValue(response.data),
    meta: sanitizeValue(response.meta),
    errors: sanitizeValue(response.errors),
  };
};

// ---------- | Generic Value Sanitization | ----------

const sanitizeValue = (value: unknown): LogValue => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return truncateValue(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (isMongoObjectId(value)) {
    return value.toString();
  }

  if (isMongooseDocument(value)) {
    return sanitizeValue(value.toObject());
  }

  if (typeof value === "object") {
    const result: {
      [key: string]: LogValue;
    } = {};

    Object.entries(value).forEach(([key, val]) => {
      const normalizedKey = key.replace(/[-_\s]/g, "").toLowerCase();

      if (SENSITIVE_FIELDS.has(normalizedKey)) {
        result[key] = "[REDACTED]";
        return;
      }

      result[key] = sanitizeValue(val);
    });

    return result;
  }

  return String(value);
};

// ---------- | MongoDB ObjectId Detection | ----------

const isMongoObjectId = (
  value: unknown,
): value is {
  toString(): string;
  _bsontype?: string;
} => {
  return (
    typeof value === "object" &&
    value !== null &&
    "_bsontype" in value &&
    ((value as { _bsontype?: string })._bsontype === "ObjectId" ||
      (value as { _bsontype?: string })._bsontype === "ObjectID")
  );
};

// ---------- | Mongoose Document Detection | ----------

const isMongooseDocument = (
  value: unknown,
): value is {
  $__: unknown;
  toObject(): unknown;
} => {
  return (
    typeof value === "object" &&
    value !== null &&
    "$__" in value &&
    "toObject" in value &&
    typeof (value as { toObject?: unknown }).toObject === "function"
  );
};

// ---------- | Truncate Large Values | ----------

const truncateValue = (value: string): string => {
  if (value.length <= MAX_LOG_VALUE_LENGTH) {
    return value;
  }

  return `${value.slice(0, MAX_LOG_VALUE_LENGTH)}...[TRUNCATED]`;
};

export default requestLogger;
