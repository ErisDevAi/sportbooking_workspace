import { Router } from "express";
import { userController } from "./user.controller";
import { createUserValidation, updateUserValidation, mongoIdParam } from "./user.validation";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { checkRole, checkPermission } from "../../middlewares/role.middleware";

const router = Router();

router.get("/",
  // authenticate,
  // checkPermission("view_user"),
  userController.getAll
);

router.get("/:id",
  // authenticate,
  // mongoIdParam, validate,
  // checkPermission("view_user"),
  userController.getById
);

router.post("/",
  // authenticate,
  // checkRole("admin"),
  // checkPermission("create_user"),
  // createUserValidation, validate,
  userController.create
);

router.put("/:id",
  // authenticate,
  // checkPermission("edit_user"),
  // updateUserValidation, validate,
  userController.update);

router.delete("/:id",
  // authenticate,
  // checkRole("admin"),
  // checkPermission("delete_user"),
  mongoIdParam, validate,
  userController.delete
);

export default router;
