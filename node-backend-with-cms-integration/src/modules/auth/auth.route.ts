import { Router } from "express";
import { authController } from "./auth.controller";
import { registerValidation, loginValidation } from "./auth.validation";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerValidation, validate, authController.register);
router.post("/login",    loginValidation,    validate, authController.login);
router.get("/me",        authenticate,               authController.me);

export default router;
