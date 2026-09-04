import rateLimit from "express-rate-limit";

import { HTTP_STATUS } from "../constants/http.constants.js";
import { env } from "../config/env.js";

const rateLimitMessage = {
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  success: false,
  data: null,
  message: "Too many requests. Please try again later.",
  errors: [],
};

// ---------- | Global API Rate Limiter | ----------

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.nodeEnv === "development" ? 1000 : 200,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: rateLimitMessage,

  handler: (_req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(rateLimitMessage);
  },
});
