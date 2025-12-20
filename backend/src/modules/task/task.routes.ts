import { Router } from "express";
import { createTaskService, getUserTasksService, updateTaskService, deleteTaskService } from "./task.service.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { emitTaskUpdated } from "./task.repository.js";
import { io } from "../../lib/socket.js";
import { createNotificationService } from "../notification/notification.service.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const { title, description, dueDate, priority, assignedToId, status } = req.body;
  console.log(req.body);
  if (!title || !dueDate || !priority) {
    return res.status(400).json({
      error: "Missing required fields: title, dueDate, and priority are required",
    });
  }

  const normalizedPriority = priority.toUpperCase();
  if (!["LOW", "MEDIUM", "HIGH", "URGENT"].includes(normalizedPriority)) {
    return res.status(400).json({ error: "Invalid priority value" });
  }

  // Normalize status if provided
  let normalizedStatus: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | undefined;
  if (status) {
    normalizedStatus = status.replace(/\s+/g, '_').toUpperCase();
    if (normalizedStatus && !["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"].includes(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
  }
  try {
    const task = await createTaskService({
      title,
      description: description || "",
      dueDate,
      priority: normalizedPriority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      status: normalizedStatus,
      creatorId: req.user.id,
      assignedToId,
    });
    
    emitTaskUpdated(task);
    
    // Create notification and emit socket event if task is assigned
    if (task.assignedToId && task.assignedToId !== req.user.id) {
      const notification = await createNotificationService({
        userId: task.assignedToId,
        taskId: task.id,
        message: `You have been assigned to task: "${task.title}"`,
      });
      
      io.to(task.assignedToId).emit("task:assigned", task);
      io.to(task.assignedToId).emit("notification:new", notification);
    }
    
    return res.status(201).json(task);
  } catch (error: any) {
    console.error("Create task error:", error);
    return res.status(400).json({ error: error.message || "Failed to create task" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const data = await getUserTasksService(req.user.id);
    return res.json({
      assignedToMe: data.assigned,
      createdByMe: data.created,
      overdue: data.overdue,
    });
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return res.status(500).json({ error: "Failed to load tasks" });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  const { title, description, dueDate, priority, status, assignedToId } = req.body;
  const taskId = req.params.id;

  // Normalize priority if provided
  let normalizedPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
  if (priority) {
    normalizedPriority = priority.toUpperCase();
    if (normalizedPriority && !["LOW", "MEDIUM", "HIGH", "URGENT"].includes(normalizedPriority as "LOW" | "MEDIUM" | "HIGH" | "URGENT")) {
      return res.status(400).json({ error: "Invalid priority value" });
    }
  }

  // Normalize status if provided
  let normalizedStatus: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | undefined;
  if (status) {
    normalizedStatus = status.replace(/\s+/g, '_').toUpperCase();
    if (normalizedStatus && !["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"].includes(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
  }

  try {
    const updatedTask = await updateTaskService(taskId, req.user.id, {
      title,
      description,
      dueDate,
      priority: normalizedPriority,
      status: normalizedStatus,
      assignedToId,
    });

    // Emit socket event to all relevant users
    emitTaskUpdated(updatedTask);

    return res.json(updatedTask);
  } catch (error: any) {
    console.error("Update task error:", error);
    if (error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("permission")) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(400).json({ error: error.message || "Failed to update task" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const taskId = req.params.id;

  try {
    await deleteTaskService(taskId, req.user.id);
    
    // Emit socket event to notify about task deletion
    io.emit("task:deleted", { taskId });

    return res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.error("Delete task error:", error);
    if (error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("permission")) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message || "Failed to delete task" });
  }
});

export default router;