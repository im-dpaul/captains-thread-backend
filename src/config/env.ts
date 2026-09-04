import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  API_PREFIX: z
    .string()
    .regex(/^\/[a-zA-Z0-9/_-]*$/, "API_PREFIX must start with /")
    .default("/api"),

  API_VERSION: z
    .string()
    .regex(/^v\d+$/, "API_VERSION must be in the format v1, v2, etc.")
    .default("v1"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),

  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).default("info"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");

  console.error(z.prettifyError(parsedEnv.error));

  process.exit(1);
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,

  port: parsedEnv.data.PORT,

  apiPrefix: parsedEnv.data.API_PREFIX,

  apiVersion: parsedEnv.data.API_VERSION,

  mongodbUri: parsedEnv.data.MONGODB_URI,

  corsOrigin: parsedEnv.data.CORS_ORIGIN,

  logLevel: parsedEnv.data.LOG_LEVEL,
} as const;
