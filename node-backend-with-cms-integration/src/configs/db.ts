/**
 * configs/db.ts
 *
 * MongoDB connection via Mongoose.
 * connectDB() is called once at app startup.
 */

import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info(`MongoDB connected → ${mongoose.connection.host}`);
  } catch (err) {
    logger.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}
