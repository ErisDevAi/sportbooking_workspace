/**
 * middlewares/error.middleware.ts
 *
 * Centralised error handler — the last middleware in app.ts.
 * Catches everything thrown or passed to next(err).
 */

import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { env } from "../configs/env";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  // Known app error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
      ...(err.errors !== undefined && { errors: err.errors }),
    });
    return;
  }

  // Mongoose duplicate key (E11000)
  if (typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === 11000) {
    res.status(409).json({ success: false, message: "Duplicate value — resource already exists", data: null });
    return;
  }

  // Mongoose validation
  if (typeof err === "object" && err !== null && "name" in err && (err as { name: unknown }).name === "ValidationError") {
    res.status(422).json({ success: false, message: "Validation failed", data: null, errors: err });
    return;
  }

  // JWT errors
  if (err instanceof Error && err.name === "JsonWebTokenError") {
    res.status(401).json({ success: false, message: "Invalid token", data: null });
    return;
  }
  if (err instanceof Error && err.name === "TokenExpiredError") {
    res.status(401).json({ success: false, message: "Token has expired", data: null });
    return;
  }

  // Unexpected
  logger.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    data: null,
    ...(env.isDev && { debug: String(err) }),
  });
}
