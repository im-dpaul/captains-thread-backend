import mongoose from "mongoose";

import { DB_NAME } from "../constants/database.constants.js";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

// ---------- | Connect Database | ----------

const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    const connectionInstance = await mongoose.connect(env.mongodbUri, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000,
    });

    logger.info("MongoDB connected successfully.", {
      environment: env.nodeEnv,
      host: connectionInstance.connection.host,
      database: connectionInstance.connection.name,
    });

    return connectionInstance;
  } catch (error: unknown) {
    logger.error("MongoDB connection failed.", {
      environment: env.nodeEnv,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
};

// ---------- | Close Database | ----------

export const closeDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close();

  logger.info("MongoDB connection closed successfully.", {
    environment: env.nodeEnv,
  });
};

// ---------- | Database Events | ----------

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected.", {
    environment: env.nodeEnv,
  });
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected.", {
    environment: env.nodeEnv,
  });
});

mongoose.connection.on("error", (error: Error) => {
  logger.error("MongoDB connection error.", {
    environment: env.nodeEnv,
    error: error.message,
    stack: error.stack,
  });
});

export default connectDatabase;
