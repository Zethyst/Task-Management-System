import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";

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
app.use("/api/auth",authRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/notifications",notificationRoutes);

export default app;