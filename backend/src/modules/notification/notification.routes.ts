import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import {
  getUserNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
} from "./notification.service.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const notifications = await getUserNotificationsService(req.user.id);
    return res.json(notifications);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    await markNotificationAsReadService(req.params.id, req.user.id);
    return res.json({ success: true });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

router.patch("/read-all", requireAuth, async (req, res) => {
  try {
    await markAllNotificationsAsReadService(req.user.id);
    return res.json({ success: true });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    return res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
});

export default router;
