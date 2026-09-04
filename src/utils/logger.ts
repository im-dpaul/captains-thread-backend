import winston from "winston";
import { env } from "../config/env.js";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const environmentLabel =
  env.nodeEnv === "development" ? "DEV" : env.nodeEnv === "production" ? "PROD" : "TEST";

// ---------- | Console Formatter | ----------

const consoleFormat = combine(
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS",
  }),
  errors({
    stack: true,
  }),
  colorize(),
  printf((info) => {
    const { timestamp, level, message, ...metadata } = info;

    const metadataOutput =
      Object.keys(metadata).length > 0 ? `\n${JSON.stringify(metadata, null, 2)}` : "";

    return `${timestamp} [${level}] [${environmentLabel}] ${message}${metadataOutput}`;
  }),
);

// ---------- | File Formatter | ----------

const fileFormat = combine(
  timestamp(),
  errors({
    stack: true,
  }),
  json(),
);

// ---------- | Logger | ----------

export const logger = winston.createLogger({
  level: env.logLevel,

  defaultMeta: {
    environment: env.nodeEnv,
  },

  transports: [
    // ---------- | Console | ----------
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // ---------- | Error Log | ----------
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
    }),

    // ---------- | Combined Log | ----------
    new winston.transports.File({
      filename: "logs/combined.log",
      format: fileFormat,
    }),
  ],

  exitOnError: false,
});
