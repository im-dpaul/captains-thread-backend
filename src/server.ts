import http from "node:http";

import app from "./app.js";
import { closeDatabase, default as connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

let server: http.Server | undefined;

let isShuttingDown = false;

// ---------- | Start Server | ----------

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    server = http.createServer(app);

    server.listen(env.port, () => {
      logger.info("Captain's Thread API started successfully.", {
        environment: env.nodeEnv,
        port: env.port,
        apiPrefix: env.apiPrefix,
        apiVersion: env.apiVersion,
      });
    });
  } catch (error: unknown) {
    logger.error("Captain's Thread API failed to start.", {
      environment: env.nodeEnv,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    process.exit(1);
  }
};

// ---------- | Graceful Shutdown | ----------

const gracefulShutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    logger.warn("Shutdown already in progress.", {
      signal,
    });

    return;
  }

  isShuttingDown = true;

  logger.info("Captain's Thread API shutdown initiated.", {
    signal,
  });

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      logger.info("HTTP server closed successfully.");
    }

    await closeDatabase();

    logger.info("Captain's Thread API shutdown completed successfully.");

    process.exit(0);
  } catch (error: unknown) {
    logger.error("Captain's Thread API shutdown failed.", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    process.exit(1);
  }
};

// ---------- | Process Signals | ----------

process.on("SIGINT", () => {
  void gracefulShutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void gracefulShutdown("SIGTERM");
});

// ---------- | Unhandled Errors | ----------

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught exception.", {
    error: error.message,
    stack: error.stack,
  });

  void gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled promise rejection.", {
    error: reason instanceof Error ? reason.message : String(reason),

    stack: reason instanceof Error ? reason.stack : undefined,
  });

  void gracefulShutdown("unhandledRejection");
});

// ---------- | Application Start | ----------

void startServer();
