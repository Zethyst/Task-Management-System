import { Router } from "express";
import { signup, login } from "./auth.service.js";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const router = Router();

// Cookie options - secure only in production (HTTPS)
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction, // true in production (HTTPS), false in development (HTTP)
  sameSite: isProduction ? ("none" as const) : ("lax" as const), // 'none' requires secure: true, 'lax' for development
};

router.post("/signup", async (req, res) => {
  try {
    const result = await signup(req.body);
    // Auto-login after signup by setting the cookie
    res
      .cookie("token", result.token, cookieOptions)
      .status(201)
      .json({
        message: "Signup successful",
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await login(req.body);
    res
      .cookie("token", result.token, cookieOptions)
      .json({
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out successfully" });
});

router.get("/users", requireAuth, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.patch("/profile", requireAuth, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true },
    });

    req.user = updatedUser;

    return res.json({ user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
