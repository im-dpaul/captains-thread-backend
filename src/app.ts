import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { swaggerDocument, swaggerUi } from "./config/swagger.js";

import { apiRateLimiter } from "./middlewares/rateLimit.middleware.js";
import requestId from "./middlewares/requestId.middleware.js";
import requestLogger from "./middlewares/requestLogger.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import { apiRouter } from "./routes/index.js";

const app = express();

// ---------- | Express Configuration | ----------

app.disable("x-powered-by");

if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

// ---------- | Security | ----------

app.use(helmet());

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

app.use(apiRateLimiter);

// ---------- | Request Tracking | ----------

app.use(requestId);

app.use(requestLogger);

// ---------- | Request Parsing | ----------

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

// ---------- | API Documentation | ----------

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ---------- | API Routes | ----------

app.use(env.apiPrefix, apiRouter);

// ---------- | 404 Handler | ----------

app.use(notFoundMiddleware);

// ---------- | Global Error Handler | ----------

app.use(errorMiddleware);

export default app;
