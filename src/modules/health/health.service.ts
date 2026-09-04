import mongoose from "mongoose";

import { env } from "../../config/env.js";

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  environment: string;
  uptime: number;
  timestamp: string;
  database: {
    status: "connected" | "disconnected" | "connecting" | "disconnecting";
  };
}

const getDatabaseStatus = (): HealthStatus["database"]["status"] => {
  switch (mongoose.connection.readyState) {
    case 1:
      return "connected";

    case 2:
      return "connecting";

    case 3:
      return "disconnecting";

    default:
      return "disconnected";
  }
};

const getHealthStatus = (): HealthStatus => {
  const databaseStatus = getDatabaseStatus();

  const isHealthy = databaseStatus === "connected";

  return {
    status: isHealthy ? "healthy" : "unhealthy",
    environment: env.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: databaseStatus,
    },
  };
};

export default {
  getHealthStatus,
};
