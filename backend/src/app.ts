import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import { apiRateLimiter } from "./middlewares/rateLimiter.js";
import { swaggerSpec } from "./config/swagger.js";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


const app = express();

// Normalize frontend URL (remove trailing slash)
const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

console.log(`[CORS] Configured for frontend URL: ${frontendUrl}`);

// CORS configuration - MUST be before other middleware
// Using direct origin string for better reliability
app.use(cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 204,
}));


app.use(express.json());
app.use(cookieParser());

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Task Management System API Documentation",
}));

// Apply general API rate limiting to all API routes
app.use("/api/v1", apiRateLimiter);

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/tasks",taskRoutes);
app.use("/api/v1/notifications",notificationRoutes);

export default app;