/**
 * modules/wheel-contents/wheel-content.validation.ts
 */

import { body, param, query } from "express-validator";

export const createWheelContentValidation = [
  body("label").trim().notEmpty().withMessage("Label is required").isLength({ min: 1, max: 200 }),
  body("description").optional().trim().isLength({ max: 1000 }),
  body("color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid hex (e.g. #3498DB)"),
  body("weight").optional().isInt({ min: 1, max: 100 }).withMessage("Weight must be between 1 and 100"),
  body("categoryId").notEmpty().isMongoId().withMessage("Valid categoryId is required"),
  body("isActive").optional().isBoolean(),
];

export const updateWheelContentValidation = [
  param("id").isMongoId().withMessage("Invalid ID"),
  body("label").optional().trim().isLength({ min: 1, max: 200 }),
  body("description").optional().trim().isLength({ max: 1000 }),
  body("color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid hex (e.g. #3498DB)"),
  body("weight").optional().isInt({ min: 1, max: 100 }),
  body("isActive").optional().isBoolean(),
];

export const mongoIdParam = [param("id").isMongoId().withMessage("Invalid ID")];

export const categoryIdQuery = [
  query("categoryId").optional().isMongoId().withMessage("Invalid categoryId"),
];
