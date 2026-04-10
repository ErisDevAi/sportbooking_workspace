import { body, param } from "express-validator";

export const createUserValidation = [
  body("name").trim().notEmpty().isLength({ min: 2, max: 100 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("role").optional().isString(),
];

export const updateUserValidation = [
  param("id").isMongoId(),
  body("name").optional().trim().isLength({ min: 2 }),
  body("email").optional().isEmail().normalizeEmail(),
  body("role").optional().isString(),
  body("isActive").optional().isBoolean(),
];

export const mongoIdParam = [param("id").isMongoId().withMessage("Invalid ID")];
