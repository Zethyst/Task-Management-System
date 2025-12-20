import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserTasks, createTask as createTaskAPI, updateTask as updateTaskAPI, deleteTask as deleteTaskAPI, type Task as APITask } from '@/api/tasks';
import { getNotifications, markNotificationAsRead as markNotificationAsReadAPI, markAllNotificationsAsRead as markAllNotificationsAsReadAPI, type Notification as APINotification } from '@/api/notifications';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

interface TaskContextType {
  tasks: APITask[];
  notifications: APINotification[];
  createTask: (task: { title: string; description: string; dueDate: string; priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED"; assignedToId?: string }) => Promise<void>;
  updateTask: (id: string, updates: Partial<APITask>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => APITask | undefined;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  unreadNotificationsCount: number;
  isLoading: boolean;
  refetchTasks: () => Promise<void>;
  refetchNotifications: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<APITask[]>([]);
  const [notifications, setNotifications] = useState<APINotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const refetchTasks = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const data = await getUserTasks();
      // Combine all task groups and remove duplicates
      const allTasks = [...data.assignedToMe, ...data.createdByMe];
      const uniqueTasks = Array.from(new Map(allTasks.map(task => [task.id, task])).values());
      setTasks(uniqueTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
    }
  }, [isAuthenticated, user]);

  const refetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [isAuthenticated, user]);

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      await Promise.all([refetchTasks(), refetchNotifications()]);
      setIsLoading(false);
    };

    fetchData();
  }, [isAuthenticated, user, refetchTasks, refetchNotifications]);

  // Socket event listeners
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = getSocket();
    if (!socket) return;

    const handleTaskAssigned = (task: APITask) => {
      console.log("Task assigned:", task);
      // Add task to local state
      setTasks(prev => {
        const exists = prev.find(t => t.id === task.id);
        if (exists) return prev;
        return [task, ...prev];
      });
      
      // Show toast notification
      toast.success(`You were assigned to task: "${task.title}"`, {
        duration: 5000,
        icon: '📋',
      });
    };

    const handleTaskUpdated = (task: APITask) => {
      console.log("Task updated:", task);
      setTasks(prev => {
        const exists = prev.find(t => t.id === task.id);
        if (exists) {
          return prev.map(t => t.id === task.id ? task : t);
        }
        return prev;
      });
    };

    const handleNotificationNew = (notification: APINotification) => {
      console.log("New notification:", notification);
      setNotifications(prev => [notification, ...prev]);
    };

    const handleTaskDeleted = (data: { taskId: string }) => {
      console.log("Task deleted:", data.taskId);
      setTasks(prev => prev.filter(t => t.id !== data.taskId));
      setNotifications(prev => prev.filter(n => n.taskId !== data.taskId));
    };

    socket.on("task:assigned", handleTaskAssigned);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("notification:new", handleNotificationNew);
    socket.on("task:deleted", handleTaskDeleted);

    return () => {
      socket.off("task:assigned", handleTaskAssigned);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("notification:new", handleNotificationNew);
      socket.off("task:deleted", handleTaskDeleted);
    };
  }, [isAuthenticated, user]);

  const createTask = useCallback(async (taskData: { title: string; description: string; dueDate: string; priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED"; assignedToId?: string }) => {
    try {
      const newTask = await createTaskAPI(taskData);
      console.log("New task created:", newTask);
      
      setTasks(prev => [newTask, ...prev]);
      toast.success("Task created successfully");
    } catch (error: any) {
      console.error("Failed to create task:", error);
      toast.error(error.response?.data?.error || "Failed to create task");
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<APITask>) => {
    try {
      const updatedTask = await updateTaskAPI(id, {
        title: updates.title,
        description: updates.description || undefined,
        dueDate: updates.dueDate,
        priority: updates.priority,
        status: updates.status || undefined,
        assignedToId: updates.assignedToId,
      });
      
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      toast.success("Task updated successfully");
    } catch (error: any) {
      console.error("Failed to update task:", error);
      toast.error(error.response?.data?.error || "Failed to update task");
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await deleteTaskAPI(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setNotifications(prev => prev.filter(n => n.taskId !== id));
      toast.success("Task deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      toast.error(error.response?.data?.error || "Failed to delete task");
      throw error;
    }
  }, []);

  const getTaskById = useCallback((id: string) => {
    return tasks.find(t => t.id === id);
  }, [tasks]);

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsReadAPI(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    if (!user) return;
    try {
      await markAllNotificationsAsReadAPI();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, [user]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <TaskContext.Provider value={{
      tasks,
      notifications,
      createTask,
      updateTask,
      deleteTask,
      getTaskById,
      markNotificationRead,
      markAllNotificationsRead,
      unreadNotificationsCount,
      isLoading,
      refetchTasks,
      refetchNotifications,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
