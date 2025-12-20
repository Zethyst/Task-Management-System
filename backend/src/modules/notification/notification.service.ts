import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
} from "./notification.repository.js";

export async function createNotificationService(data: {
  userId: string;
  taskId: string;
  message: string;
}) {
  return createNotification(data);
}

export async function getUserNotificationsService(userId: string) {
  return getUserNotifications(userId);
}

export async function markNotificationAsReadService(
  notificationId: string,
  userId: string
) {
  return markNotificationAsRead(notificationId, userId);
}

export async function markAllNotificationsAsReadService(userId: string) {
  return markAllNotificationsAsRead(userId);
}

export async function getUnreadNotificationsCountService(userId: string) {
  return getUnreadNotificationsCount(userId);
}
