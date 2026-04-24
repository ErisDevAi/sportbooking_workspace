/**
 * common/response.ts
 *
 * Standardised API response envelope.
 *
 * Every endpoint in this project uses one of these helpers so the
 * response shape is always consistent and the CMS can rely on it:
 *
 *   Success: { success: true,  message: string, data: T,   meta?: M }
 *   Error:   { success: false, message: string, data: null, errors?: unknown }
 */

import { Response } from "express";

// ── Success ──────────────────────────────────────────────────────────────────

export function ok<T, M = undefined>(
  res: Response,
  data: T,
  message = "Success",
  meta?: M,
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta !== undefined && { meta }),
  });
}

export function created<T>(res: Response, data: T, message = "Created"): void {
  ok(res, data, message, undefined, 201);
}

// ── Error ─────────────────────────────────────────────────────────────────────

export function fail(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown
): void {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(errors !== undefined && { errors }),
  });
}

// Shorthand aliases used by controllers
export const respond = { ok, created, fail };
