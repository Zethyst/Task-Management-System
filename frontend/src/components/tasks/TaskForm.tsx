import React, { useState, useEffect } from 'react';
import { type Task as LocalTask, type User } from '@/types';
import { type Task as APITask } from '@/api/tasks';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { z, type ZodIssue } from 'zod';

// Backend enum values
type BackendPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type BackendStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";

// Display options with mapping
const priorityOptions: { value: BackendPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const statusOptions: { value: BackendStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "REVIEW", label: "Review" },
  { value: "COMPLETED", label: "Completed" },
];

const taskSchema = z.object({   
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
  assignedToId: z.string().min(1, 'Assignee is required'),
});

interface TaskFormProps {
  task?: APITask | LocalTask;
  onSubmit: (data: any) => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export default function TaskForm({ task, onSubmit, onDelete, isLoading }: TaskFormProps) {
  const { user, getAllUsers } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
    priority: (task?.priority as BackendPriority) || 'MEDIUM' as BackendPriority,
    status: (task?.status as BackendStatus) || 'TODO' as BackendStatus,
    assignedToId: task?.assignedToId || user?.id || '',
    creatorId: task?.creatorId || user?.id || '',
  });

  useEffect(() => {
    setUsers(getAllUsers());
  }, [getAllUsers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = taskSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((err: ZodIssue) => {
        formattedErrors[err.path[0] as string] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dueDate: date.toISOString() }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-emerald-700 font-medium">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title"
          maxLength={100}
          className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
        />
        {errors.title && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.title}</p>}
        <p className="text-xs text-emerald-600/60">{formData.title.length}/100</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-emerald-700 font-medium">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description"
          rows={4}
          className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300 resize-none"
        />
        {errors.description && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-emerald-700 font-medium">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300',
                  !formData.dueDate && 'text-emerald-600/50'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                {formData.dueDate ? format(new Date(formData.dueDate), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-emerald-200/50 bg-white/95 backdrop-blur-sm" align="start">
              <Calendar
                mode="single"
                selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                onSelect={handleDateSelect}
                initialFocus
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.dueDate}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-emerald-700 font-medium">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: BackendPriority) => setFormData(prev => ({ ...prev, priority: value }))}
          >
            <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 hover:bg-emerald-50 transition-all duration-300">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="border-emerald-200/50 bg-white/95 backdrop-blur-sm">
              {priorityOptions.map(p => (
                <SelectItem 
                  key={p.value} 
                  value={p.value}
                  className="focus:bg-emerald-100/70 focus:text-emerald-700 cursor-pointer"
                >
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-emerald-700 font-medium">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: BackendStatus) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 hover:bg-emerald-50 transition-all duration-300">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="border-emerald-200/50 bg-white/95 backdrop-blur-sm">
              {statusOptions.map(s => (
                <SelectItem 
                  key={s.value} 
                  value={s.value}
                  className="focus:bg-emerald-100/70 focus:text-emerald-700 cursor-pointer"
                >
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-emerald-700 font-medium">Assign To</Label>
          <Select
            value={formData.assignedToId}
            onValueChange={value => setFormData(prev => ({ ...prev, assignedToId: value }))}
          >
            <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 hover:bg-emerald-50 transition-all duration-300">
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent className="border-emerald-200/50 bg-white/95 backdrop-blur-sm">
              {users.map(u => (
                <SelectItem 
                  key={u.id} 
                  value={u.id}
                  className="focus:bg-emerald-100/70 focus:text-emerald-700 cursor-pointer"
                >
                  {u.name} {u.id === user?.id && '(You)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.assignedToId && <p className="text-sm text-red-500 flex items-center gap-1"><span>⚠</span>{errors.assignedToId}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
       {task && <Button 
          type="button" 
          variant="outline" 
          onClick={onDelete}
          className="cursor-pointer border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-300"
        >
          Delete
        </Button>}
        <Button 
          type="submit" 
          disabled={isLoading}
          className="cursor-pointer bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}