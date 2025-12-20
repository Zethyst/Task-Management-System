import { api } from "../lib/api";

export type Notification = {
  id: string;
  userId: string;
  taskId: string;
  message: string;
  read: boolean;
  createdAt: string;
  task?: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    creator: { id: string; name: string; email: string };
    assignedTo: { id: string; name: string; email: string } | null;
  };
};

export const getNotifications = (): Promise<Notification[]> => {
  return api.get("/notifications").then(res => res.data);
};

export const markNotificationAsRead = (notificationId: string) => {
  return api.patch(`/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = () => {
  return api.patch("/notifications/read-all");
};
