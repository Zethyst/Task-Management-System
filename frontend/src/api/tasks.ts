import { api } from "../lib/api";

export type CreateTaskInput = {
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  assignedToId?: string;
};

export const createTask = (data: CreateTaskInput) => {
  return api.post("/tasks", data).then(res => res.data);
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  assignedToId?: string | null;
};

export const updateTask = (taskId: string, data: UpdateTaskInput) => {
  return api.patch(`/tasks/${taskId}`, data).then(res => res.data);
};

export const deleteTask = (taskId: string) => {
  return api.delete(`/tasks/${taskId}`).then(res => res.data);
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | null;
  creatorId: string;
  assignedToId: string | null;
  creator: { id: string; name: string | null; email: string };
  assignedTo: { id: string; name: string | null; email: string } | null;
};

export type UserTaskGroups = {
  assignedToMe: Task[];
  createdByMe: Task[];
  overdue: Task[];
};

export const getUserTasks = (): Promise<UserTaskGroups> => {
  return api.get("/tasks/me").then(res => res.data);
};