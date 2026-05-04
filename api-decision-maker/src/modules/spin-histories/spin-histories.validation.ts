/**
 * modules/spin-histories/spin-histories.validation.ts
 */

import { body, param, query } from "express-validator";

export const recordSpinValidation = [
  body("categoryId").notEmpty().isMongoId().withMessage("Valid categoryId is required"),
  body("selectedContentId").notEmpty().isMongoId().withMessage("Valid selectedContentId is required"),
];

export const mongoIdParam = [param("id").isMongoId().withMessage("Invalid ID")];

export const categoryIdQuery = [
  query("categoryId").optional().isMongoId().withMessage("Invalid categoryId"),
];

export const categoryIdParam = [
  param("categoryId").isMongoId().withMessage("Invalid categoryId"),
];
