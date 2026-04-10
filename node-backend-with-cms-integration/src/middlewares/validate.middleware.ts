/**
 * middlewares/validate.middleware.ts
 *
 * Runs express-validator results and returns 422 if any field failed.
 */

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      data: null,
      errors: errors.array(),
    });
    return;
  }
  next();
}
