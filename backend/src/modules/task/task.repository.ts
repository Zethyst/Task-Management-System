import { prisma } from "../../lib/prisma.js";
import { io } from "../../lib/socket.js"; // add this import

export function createTask(data: {
    title: string
    description: string
    dueDate: Date
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
    status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED"
    creatorId: string
    assignedToId?: string
}) {
    return prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            priority: data.priority,
            ...(data.status && { status: data.status }),
            creatorId: data.creatorId,
            ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
        },
        include: {
            creator: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true, email: true } },
        }
    })
}

export async function findTasksForUser(userId: string) {
  const now = new Date();

  const [assigned, created, overdue] = await Promise.all([
    prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
    prisma.task.findMany({
      where: { creatorId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
    prisma.task.findMany({
      where: {
        OR: [{ creatorId: userId }, { assignedToId: userId }],
        dueDate: { lt: now },
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  return { assigned, created, overdue };
}

export function emitTaskUpdated(task: any) {
  const recipients = new Set<string>();
  recipients.add(task.creatorId);
  if (task.assignedToId) {
    recipients.add(task.assignedToId);
  }

  recipients.forEach(userId => {
    io.to(userId).emit("task:updated", task);
  });
}

export async function updateTask(taskId: string, data: {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  assignedToId?: string | null;
}) {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
    },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function deleteTask(taskId: string) {
  return prisma.task.delete({
    where: { id: taskId },
  });
}

export async function findTaskById(taskId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
}