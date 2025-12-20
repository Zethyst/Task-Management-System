import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use("/api/auth",authRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/notifications",notificationRoutes);

export default app;