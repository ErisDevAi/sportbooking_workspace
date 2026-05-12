/**
 * modules/spin-histories/spin-histories.validation.ts
 */

import { body, param, query } from "express-validator";

export const recordSpinValidation = [
  body("categoryId").notEmpty().isMongoId().withMessage("Valid categoryId is required"),
  body("selectedContentId").notEmpty().isMongoId().withMessage("Valid selectedContentId is required"),
  body("question").optional().isString().trim().isLength({ max: 500 }),
];

export const verifyValidation = [
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be 0-5"),
  body("reviewNote").optional().isString().trim().isLength({ max: 500 }),
  body("checkinImageUrl").optional().isString(),
];

export const mongoIdParam = [param("id").isMongoId().withMessage("Invalid ID")];

export const categoryIdQuery = [
  query("categoryId").optional().isMongoId().withMessage("Invalid categoryId"),
];

export const categoryIdParam = [
  param("categoryId").isMongoId().withMessage("Invalid categoryId"),
];
