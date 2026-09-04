import winston from "winston";
import { env } from "../config/env.js";

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const isDevelopment = env.nodeEnv === "development";

export const logger = winston.createLogger({
  level: env.logLevel,

  format: combine(timestamp(), errors({ stack: true }), json()),

  transports: [
    new winston.transports.Console({
      format: isDevelopment
        ? combine(colorize(), timestamp(), simple())
        : combine(timestamp(), json()),
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],

  exitOnError: false,
});
