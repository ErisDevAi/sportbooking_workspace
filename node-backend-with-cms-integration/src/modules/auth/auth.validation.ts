import { body } from "express-validator";

export const registerValidation = [
  body("name").trim().notEmpty().isLength({ min: 2 }).withMessage("Name min 2 chars"),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
];

export const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];
