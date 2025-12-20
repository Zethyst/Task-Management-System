import { prisma } from "../../lib/prisma.js";

export function createNotification(data: {
  userId: string;
  taskId: string;
  message: string;
}) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      taskId: data.taskId,
      message: data.message,
    },
  });
}

export function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    include: {
      task: {
        include: {
          creator: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function markNotificationAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
}

export function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export function getUnreadNotificationsCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}
