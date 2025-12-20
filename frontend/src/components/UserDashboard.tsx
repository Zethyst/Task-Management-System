import { useEffect, useState } from "react";
import { getUserTasks, type UserTaskGroups } from "../api/tasks";
import TaskCard from "./TaskCard";
import type { Task } from "../api/tasks";
import { getSocket } from "../lib/socket";

const updateTaskInList = (list: Task[], updatedTask: Task) => {
  return list.map(task => task.id === updatedTask.id ? updatedTask : task);
};

export default function UserDashboard() {
  const [data, setData] = useState<UserTaskGroups | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserTasks().then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
    const socket = getSocket();
    if (socket) {
      socket.on("task:updated", (updatedTask: Task) => {
        setData(prev => {
          if (!prev) return prev;
          return {
            assignedToMe: updateTaskInList(prev.assignedToMe, updatedTask),
            createdByMe: updateTaskInList(prev.createdByMe, updatedTask),
            overdue: updateTaskInList(prev.overdue, updatedTask),
          };
        });
      });
    }
    return () => {
      socket?.off("task:updated");
    };
  }, []);

  // 👇 Listen for real-time updates

  if (loading) {
    return <div className="text-center py-8">Loading your tasks...</div>;
  }

  if (!data) {
    return <div className="text-center py-8 text-red-500">Failed to load tasks.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Assigned to Me */}
      <section>
        <h2 className="text-xl font-bold mb-3">Tasks Assigned to You</h2>
        {data.assignedToMe.length === 0 ? (
          <p className="text-gray-500">No tasks assigned to you.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.assignedToMe.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      {/* Created by Me */}
      <section>
        <h2 className="text-xl font-bold mb-3">Tasks You Created</h2>
        {data.createdByMe.length === 0 ? (
          <p className="text-gray-500">You haven’t created any tasks.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.createdByMe.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      {/* Overdue */}
      {data.overdue.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-red-600 mb-3">⚠️ Overdue Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.overdue.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}