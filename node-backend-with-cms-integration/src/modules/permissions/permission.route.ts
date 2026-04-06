import { Router } from "express";
import { permissionController } from "./permission.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { checkRole, checkPermission } from "../../middlewares/role.middleware";
import { param } from "express-validator";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.get("/",   authenticate, permissionController.getAll);
router.post("/",  authenticate, checkRole("admin"), checkPermission("manage_permissions"), permissionController.create);
router.delete("/:id", authenticate, checkRole("admin"), checkPermission("manage_permissions"),
  param("id").isMongoId(), validate, permissionController.delete);

export default router;
