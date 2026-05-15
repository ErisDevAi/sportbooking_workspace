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
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").optional().isString().trim().isLength({ max: 50 }),
  body("location").optional().isObject(),
  body("location.lat").optional().isFloat({ min: -90, max: 90 }).withMessage("Latitude must be -90 to 90"),
  body("location.lng").optional().isFloat({ min: -180, max: 180 }).withMessage("Longitude must be -180 to 180"),
  body("location.address").optional().isString().isLength({ max: 500 }),
  body("metadata").optional().isObject(),
  body("metadata.priceRange").optional().isInt({ min: 1, max: 5 }).withMessage("Price range must be 1-5"),
  body("metadata.rating").optional().isFloat({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
  body("metadata.url").optional().isString(),
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
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").optional().isString().trim().isLength({ max: 50 }),
  body("location").optional().isObject(),
  body("location.lat").optional().isFloat({ min: -90, max: 90 }),
  body("location.lng").optional().isFloat({ min: -180, max: 180 }),
  body("location.address").optional().isString().isLength({ max: 500 }),
  body("metadata").optional().isObject(),
  body("metadata.priceRange").optional().isInt({ min: 1, max: 5 }),
  body("metadata.rating").optional().isFloat({ min: 1, max: 5 }),
  body("metadata.url").optional().isString(),
];

export const mongoIdParam = [param("id").isMongoId().withMessage("Invalid ID")];

export const categoryIdQuery = [
  query("categoryId").optional().isMongoId().withMessage("Invalid categoryId"),
];
