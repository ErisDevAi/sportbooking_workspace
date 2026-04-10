/**
 * configs/env.ts
 *
 * Single source of truth for all environment variables.
 * All process.env access lives here — the rest of the codebase imports
 * from this file so missing variables throw at startup, not at runtime.
 */

import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Environment variable "${key}" is required but not set`);
  return v;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  port: parseInt(optional("PORT", "3000"), 10),
  nodeEnv: optional("NODE_ENV", "development"),
  isDev: optional("NODE_ENV", "development") === "development",

  mongoUri: required("MONGODB_URI"),

  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: optional("JWT_EXPIRES_IN", "7d"),

  bcryptRounds: parseInt(optional("BCRYPT_ROUNDS", "12"), 10),

  corsOrigins: optional("CORS_ORIGINS", "http://localhost:5173")
    .split(",")
    .map((o) => o.trim()),
} as const;
