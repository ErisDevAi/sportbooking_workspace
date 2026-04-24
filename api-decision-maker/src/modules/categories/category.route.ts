/**
 * modules/categories/category.route.ts
 */

import { Router } from "express";
import { categoryController } from "./category.controller";
import {
  createCategoryValidation,
  updateCategoryValidation,
  mongoIdParam,
} from "./category.validation";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { checkPermission } from "../../middlewares/role.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  checkPermission("view_category"),
  categoryController.getAll
);

router.get(
  "/:id",
  authenticate,
  mongoIdParam,
  validate,
  checkPermission("view_category"),
  categoryController.getById
);

router.post(
  "/",
  authenticate,
  checkPermission("create_category"),
  createCategoryValidation,
  validate,
  categoryController.create
);

router.put(
  "/:id",
  authenticate,
  checkPermission("edit_category"),
  updateCategoryValidation,
  validate,
  categoryController.update
);

router.delete(
  "/:id",
  authenticate,
  checkPermission("delete_category"),
  mongoIdParam,
  validate,
  categoryController.delete
);

export default router;
