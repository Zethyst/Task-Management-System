import type { Task } from "../api/tasks";

export default function TaskCard({ task }: { task: Task }) {
  const isOverdue = new Date(task.dueDate) < new Date();

  return (
    <div className={`p-3 border rounded ${isOverdue ? "border-red-500 bg-red-50" : "border-gray-200"}`}>
      <h3 className="font-semibold">{task.title}</h3>
      {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
      
      <div className="text-xs text-gray-500 mt-2 space-y-1">
        <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
        <div>Priority: <span className={`font-medium ${task.priority === "URGENT" ? "text-red-600" : ""}`}>{task.priority}</span></div>
        <div>Creator: {task.creator.name || task.creator.email}</div>
        {task.assignedTo && (
          <div>Assignee: {task.assignedTo.name || task.assignedTo.email}</div>
        )}
      </div>
    </div>
  );
}