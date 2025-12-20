import React from 'react';
import { type Task } from '@/types/index';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import TaskForm from './TaskForm';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export default function TaskDialog({ open, onOpenChange, task, onSubmit, onDelete, isLoading }: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] glass">
        <DialogHeader>
          <DialogTitle className="text-emerald-700 font-medium" >{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription className="text-emerald-600/70">
            {task ? 'Update the task details below.' : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={task}
          onSubmit={onSubmit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
