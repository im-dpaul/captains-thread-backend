import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../constants/http.constants.js";
import ApiResponse from "../../utils/ApiResponse.js";
import healthService from "./health.service.js";

const getHealth = (_req: Request, res: Response): void => {
  const health = healthService.getHealthStatus();

  const statusCode = health.status === "healthy" ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;

  res
    .status(statusCode)
    .json(
      new ApiResponse(
        statusCode,
        health,
        health.status === "healthy"
          ? "Captain's Thread API is healthy."
          : "Captain's Thread API is unhealthy.",
      ),
    );
};

export { getHealth };
