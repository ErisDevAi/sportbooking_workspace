/**
 * src/app.ts
 *
 * Entry point — wires together configs, middleware, routes, and starts the server.
 *
 * Order matters:
 *   1. Load env
 *   2. Connect DB
 *   3. Global middleware (cors, json, morgan)
 *   4. Routes
 *   5. 404 handler
 *   6. Error handler (LAST)
 */

import "./configs/env"; // must be first

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./configs/db";
import { env } from "./configs/env";
import { logger } from "./utils/logger";
import { errorHandler } from "./middlewares/error.middleware";

import authRoutes        from "./modules/auth/auth.route";
import userRoutes        from "./modules/users/user.route";
import roleRoutes        from "./modules/roles/role.route";
import permissionRoutes  from "./modules/permissions/permission.route";
import dashboardRoutes   from "./modules/dashboard/dashboard.route";
import categoryRoutes    from "./modules/categories/category.route";

const app = express();

// ── Global middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isDev ? "dev" : "combined"));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "OK",
    data: {
      status: "healthy",
      environment: env.nodeEnv,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/auth",        authRoutes);
app.use("/users",       userRoutes);
app.use("/roles",       roleRoutes);
app.use("/permissions", permissionRoutes);
app.use("/dashboard",   dashboardRoutes);
app.use("/categories",  categoryRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found", data: null });
});

// ── Error handler (must be last) ──────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
async function start() {
  await connectDB();

  app.listen(env.port, () => {
    logger.info(`Server → http://localhost:${env.port}  [${env.nodeEnv}]`);
    logger.info(`CORS allowed origins: ${env.corsOrigins.join(", ")}`);
    logger.info("Endpoints:");
    logger.info("  GET    /health");
    logger.info("  POST   /auth/register   POST /auth/login   GET /auth/me");
    logger.info("  GET    /users           POST /users        PUT /users/:id   DELETE /users/:id");
    logger.info("  GET    /roles           POST /roles        PUT /roles/:id   DELETE /roles/:id");
    logger.info("  GET    /permissions     POST /permissions  DELETE /permissions/:id");
    logger.info("  GET    /dashboard/stats");
    logger.info("  GET    /categories      POST /categories   PUT /categories/:id   DELETE /categories/:id");
  });
}

start().catch((err) => {
  logger.error("Server failed to start:", err);
  process.exit(1);
});

export default app;
