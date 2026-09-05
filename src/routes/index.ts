import { Router } from "express";

import { env } from "../config/env.js";

import authRoutes from "../modules/auth/auth.routes.js";
import healthRoutes from "../modules/health/health.routes.js";

// ---------- | API Router | ----------

const router = Router();

const versionedRouter = Router();

// ---------- | API Version | ----------

router.use(`/${env.apiVersion}`, versionedRouter);

// ---------- | Health | ----------

versionedRouter.use("/health", healthRoutes);

// ---------- | Auth | ----------

versionedRouter.use("/auth", authRoutes);

export { router as apiRouter, versionedRouter };
