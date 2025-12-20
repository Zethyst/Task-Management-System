import type { CreateTaskInput } from "./task.types.js";
import { createTask, findTasksForUser, updateTask as updateTaskRepo, deleteTask as deleteTaskRepo, findTaskById } from "./task.repository.js";

export async function createTaskService(
  data: CreateTaskInput & { creatorId: string; assignedToId?: string }
) {
  const dueDate = new Date(data.dueDate);
  if (isNaN(dueDate.getTime())) {
    throw new Error("Invalid dueDate. Please use ISO format (e.g., '2025-12-31').");
  }

  const taskData = {
    title: data.title,
    description: data.description,
    dueDate,
    priority: data.priority,
    ...(data.status && { status: data.status }),
    creatorId: data.creatorId,
    ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
  };

  return createTask(taskData);
}

export async function getUserTasksService(userId: string) {
  return findTasksForUser(userId);
}

export async function updateTaskService(
  taskId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
    assignedToId?: string | null;
  }
) {
  // Check if task exists and user has permission
  const task = await findTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  // Only creator or assignee can update the task
  if (task.creatorId !== userId && task.assignedToId !== userId) {
    throw new Error("You don't have permission to update this task");
  }

  // Parse dueDate if provided
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.dueDate !== undefined) {
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      throw new Error("Invalid dueDate. Please use ISO format.");
    }
    updateData.dueDate = dueDate;
  }
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId;

  return updateTaskRepo(taskId, updateData);
}

export async function deleteTaskService(taskId: string, userId: string) {
  // Check if task exists and user has permission
  const task = await findTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  // Only creator can delete the task
  if (task.creatorId !== userId) {
    throw new Error("Only the task creator can delete this task");
  }

  return deleteTaskRepo(taskId);
}