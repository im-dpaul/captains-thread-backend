import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { apiRateLimiter } from "./middlewares/rate-limit.middleware.js";

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

export default app;
