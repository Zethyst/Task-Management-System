import  { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { type Task } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import TaskFilters from '@/components/tasks/TaskFilters';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { ListTodo, Plus, Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';

export default function Tasks() {
  const {user, getAllUsers } = useAuth();
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const users = getAllUsers();
  const getUserById = (id: string) => users.find(u => u.id === id);

  // Filter by search
  const searchedTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) || false
  );

  const { filters, setFilters, filteredTasks } = useTaskFilters(searchedTasks as any);

  const handleCreateTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    createTask(data as any);
    setDialogOpen(false);
  };

  const handleUpdateTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, data as any);
      setSelectedTask(undefined);
      setDialogOpen(false);
    }
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setSelectedTask(undefined);
      setDeleteDialogOpen(false);
    } else {
      toast.error("Task not found");
    }
  };



  const openCreateDialog = () => {
    setSelectedTask(undefined);
    setDialogOpen(true);
  };
  const handleTaskClick = (task: Task) => {
    if (task.assignedToId === user?.id) {
      setSelectedTask(task);
      setDialogOpen(true);
    } else {
      toast.error("You are not authorized to edit this task");
    }
  };
  return (
    <div className="p-8 bg-linear-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            All Tasks
          </h1>
          <p className="text-emerald-600/70">Manage and organize all tasks</p>
        </div>
        <Button 
          onClick={openCreateDialog}
          className="cursor-pointer bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 z-40 -translate-y-1/2 h-4 w-4 text-emerald-500" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
          />
        </div>
        <TaskFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={getUserById(task.assignedToId)}
              onClick={() => handleTaskClick(task)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="inline-block p-4 rounded-full bg-emerald-100/50 mb-4">
              <ListTodo className="h-12 w-12 text-emerald-400" />
            </div>
            <p className="text-emerald-600/70 mb-4">No tasks found</p>
            <Button 
              variant="outline" 
              className="cursor-pointer mt-4 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300"
              onClick={openCreateDialog}
            >
              Create your first task
            </Button>
          </div>
        )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedTask(undefined);
        }}
        onDelete={handleDeleteTask}
        task={selectedTask}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-emerald-200/50 bg-white/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-emerald-700">Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-emerald-600/70">
              Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTask} 
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 transition-all duration-300"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
