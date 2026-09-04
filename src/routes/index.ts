import { Router } from "express";

import { env } from "../config/env.js";
import healthRoutes from "../modules/health/health.routes.js";

const router = Router();

const versionedRouter = Router();

// ---------- | API Version | ----------

router.use(`/${env.apiVersion}`, versionedRouter);

// ---------- | Health | ----------

versionedRouter.use("/health", healthRoutes);

export { router as apiRouter, versionedRouter };
