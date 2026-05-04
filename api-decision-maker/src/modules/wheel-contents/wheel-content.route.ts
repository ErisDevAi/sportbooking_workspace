/**
 * modules/wheel-contents/wheel-content.route.ts
 */

import { Router } from "express";
import { wheelContentController } from "./wheel-content.controller";
import {
  createWheelContentValidation,
  updateWheelContentValidation,
  mongoIdParam,
} from "./wheel-content.validation";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { checkPermission } from "../../middlewares/role.middleware";
import { uploadImage } from "./upload.middleware";

const router = Router();

// GET /wheel-contents?categoryId=xxx — list contents (paginated)
router.get(
  "/",
  authenticate,
  checkPermission("view_wheel_content"),
  wheelContentController.getByCategory
);

// GET /wheel-contents/wheel/:categoryId — all active contents for wheel rendering
router.get(
  "/wheel/:categoryId",
  authenticate,
  checkPermission("view_wheel_content"),
  wheelContentController.getAllForWheel
);

// GET /wheel-contents/:id — single content
router.get(
  "/:id",
  authenticate,
  mongoIdParam,
  validate,
  checkPermission("view_wheel_content"),
  wheelContentController.getById
);

// POST /wheel-contents — create (with optional image upload)
router.post(
  "/",
  authenticate,
  checkPermission("create_wheel_content"),
  uploadImage,
  createWheelContentValidation,
  validate,
  wheelContentController.create
);

// PUT /wheel-contents/:id — update (with optional image upload)
router.put(
  "/:id",
  authenticate,
  checkPermission("edit_wheel_content"),
  uploadImage,
  updateWheelContentValidation,
  validate,
  wheelContentController.update
);

// DELETE /wheel-contents/:id
router.delete(
  "/:id",
  authenticate,
  checkPermission("delete_wheel_content"),
  mongoIdParam,
  validate,
  wheelContentController.delete
);

export default router;
