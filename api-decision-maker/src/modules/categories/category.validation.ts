/**
 * modules/categories/category.validation.ts
 */

import { body, param } from "express-validator";

export const createCategoryValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 1, max: 100 }),
  body("icon").optional().trim().isLength({ max: 10 }),
  body("color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid hex (e.g. #3498DB)"),
  body("description").optional().trim().isLength({ max: 500 }),
  body("isPublic").optional().isBoolean(),
];

export const updateCategoryValidation = [
  param("id").isMongoId().withMessage("Invalid ID"),
  body("name").optional().trim().isLength({ min: 1, max: 100 }),
  body("icon").optional().trim().isLength({ max: 10 }),
  body("color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid hex (e.g. #3498DB)"),
  body("description").optional().trim().isLength({ max: 500 }),
  body("isPublic").optional().isBoolean(),
];

export const mongoIdParam = [param("id").isMongoId().withMessage("Invalid ID")];
