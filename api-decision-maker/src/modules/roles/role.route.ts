import { Router } from "express";
import { roleController } from "./role.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { checkRole, checkPermission } from "../../middlewares/role.middleware";
import { param } from "express-validator";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();
const idParam = [param("id").isMongoId(), validate];

router.get("/",   authenticate, roleController.getAll);
router.get("/:id", authenticate, ...idParam, roleController.getById);
router.post("/",  authenticate, checkRole("admin"), checkPermission("manage_roles"), roleController.create);
router.put("/:id", authenticate, checkRole("admin"), checkPermission("manage_roles"), ...idParam, roleController.update);
router.delete("/:id", authenticate, checkRole("admin"), checkPermission("manage_roles"), ...idParam, roleController.delete);

export default router;
