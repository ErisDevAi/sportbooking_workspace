import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { checkPermission } from "../../middlewares/role.middleware";

const router = Router();

router.get("/stats", authenticate, checkPermission("view_dashboard"), dashboardController.getStats);

export default router;
