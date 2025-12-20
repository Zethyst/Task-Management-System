import React from "react";
import { type Task, type User } from "@/types/index";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, AlertCircle } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

interface TaskCardProps {
  task: Task;
  assignee?: User;
  onClick?: () => void;
}

const priorityColors = {
  Low: "bg-priority-low/20 text-priority-low border-priority-low/30",
  Medium:
    "bg-priority-medium/20 text-priority-medium border-priority-medium/30",
  High: "bg-priority-high/20 text-priority-high border-priority-high/30",
  Urgent:
    "bg-priority-urgent/20 text-priority-urgent border-priority-urgent/30",
};

const statusColors = {
  "To Do": "bg-status-todo/20 text-status-todo border-status-todo/30",
  "In Progress":
    "bg-status-in-progress/20 text-status-in-progress border-status-in-progress/30",
  Review: "bg-status-review/20 text-status-review border-status-review/30",
  Completed:
    "bg-status-completed/20 text-status-completed border-status-completed/30",
};

export default function TaskCard({ task, assignee, onClick }: TaskCardProps) {
  console.log(task);
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && task.status !== "Completed";
  const isDueToday = isToday(dueDate);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={cn(
        "border-emerald-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/20 cursor-pointer group animate-fade-in transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300",
        isOverdue &&
          "border-red-300/50 hover:border-red-500 hover:shadow-red-500/20"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-emerald-700 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-green-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 flex-1">
            {task.title}
          </h3>
          {isOverdue && (
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 animate-pulse" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-emerald-600/70 line-clamp-2">
          {task.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="default"
            className={cn(
              "text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md transition-all duration-300",
              priorityColors[task.priority]
            )}
          >
            {task.priority}
          </Badge>
          <Badge
            variant="default"
            className={cn(
              "text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md transition-all duration-300",
              statusColors[task.status as keyof typeof statusColors]
            )}
          >
            {task.status}
          </Badge>
        </div>

        <div className="space-y-2 pt-2 border-t border-emerald-200/50">
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              isOverdue
                ? "text-red-500"
                : isDueToday
                ? "text-orange-500"
                : "text-emerald-600/70"
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(dueDate, "MMM d, yyyy")}</span>
          </div>

          {assignee && (
            <div className="flex items-center gap-2 text-xs">
              <Avatar className="h-5 w-5 ring-2 ring-emerald-200 group-hover:ring-emerald-300 transition-all duration-300">
                <AvatarFallback className="text-[9px] bg-gradient-to-br from-emerald-400 to-green-500 text-white font-semibold">
                  {getInitials(assignee.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-emerald-600/60 font-normal">
                Assigned to:{" "}
              </span>
              <span className="text-emerald-700 font-medium truncate">
                {assignee.name}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}