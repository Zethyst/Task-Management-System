import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { toast } from "react-hot-toast";
import type { Task } from "../api/tasks";
import type { Notification } from "../api/notifications";

export default function NotificationManager() {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleAssignment = (task: Task) => {
      toast.success(
        `You were assigned to task: "${task.title}"`,
        {
          duration: 5000,
          icon: '📋',
          style: {
            background: '#10b981',
            color: '#fff',
          },
        }
      );
    };

    const handleNotification = (notification: Notification) => {
      toast(notification.message, {
        duration: 5000,
        icon: '🔔',
        style: {
          background: '#3b82f6',
          color: '#fff',
        },
      });
    };

    socket.on("task:assigned", handleAssignment);
    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("task:assigned", handleAssignment);
      socket.off("notification:new", handleNotification);
    };
  }, []);

  return null; // No UI needed, just handles socket events
}
