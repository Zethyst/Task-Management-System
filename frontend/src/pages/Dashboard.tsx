import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import type { Task as APITask } from '@/api/tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import { isPast } from 'date-fns';
import { TaskCardsSkeletonGrid } from '@/components/skeletons/TaskSkelton';


export default function Dashboard() {
  const { user } = useAuth();

  const { tasks, isLoading } = useTasks();

  // Tasks are automatically updated in real-time via socket events in TaskContext
  // When a task is assigned, the TaskContext receives the socket event and updates the tasks array
  
  // Computed task lists
  const myAssignedTasks = useMemo(
    () => tasks.filter(t => t.assignedToId === user?.id),
    [tasks, user?.id]
  );

  const myCreatedTasks = useMemo(
    () => tasks.filter(t => t.creatorId === user?.id),
    [tasks, user?.id]
  );

  const overdueTasks = useMemo(
    () => tasks.filter(t => 
      t.assignedToId === user?.id && 
      isPast(new Date(t.dueDate))
    ),
    [tasks, user?.id]
  );

  // Stats
  const stats = useMemo(() => ({
    total: myAssignedTasks.length,
    overdue: overdueTasks.length,
    created: myCreatedTasks.length,
  }), [myAssignedTasks, overdueTasks, myCreatedTasks]);

  const renderTaskList = (taskList: APITask[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <TaskCardsSkeletonGrid count={2} />
      );
    }

    if (taskList.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <div className="inline-block p-4 rounded-full bg-emerald-100/50 mb-4">
            <ListTodo className="h-12 w-12 text-emerald-400" />
          </div>
          <p className="text-emerald-600/70 mb-4">{emptyMessage}</p>
        </div>
      );
    }

    return taskList.map(task => (
      <Card
        key={task.id}
        className="border-emerald-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300"
      >
        <CardHeader>
          <CardTitle className="text-emerald-700">{task.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-emerald-600/70">
            <Clock className="h-4 w-4" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-emerald-600/80 text-sm mb-3">{task.description}</p>
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              task.priority === 'URGENT' ? 'bg-red-100 text-red-700' :
              task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
              task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {task.priority}
            </span>
            {task.status && (
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                task.status === 'REVIEW' ? 'bg-purple-100 text-purple-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {task.status.replace('_', ' ')}
              </span>
            )}
          </div>
          {task.assignedTo && (
            <span className="text-xs text-emerald-600/70">
              Assigned to: {task.assignedTo.name}
            </span>
          )}
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-emerald-600/70">Here's an overview of your tasks.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-emerald-200/50 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600/70">Total Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-100/50">
              <ListTodo className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200/50 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600/70">Created by Me</CardTitle>
            <div className="p-2 rounded-lg bg-green-100/50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.created}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200/50 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600/70">Overdue</CardTitle>
            <div className="p-2 rounded-lg bg-red-100/50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section with Tabs */}
      <Tabs defaultValue="assigned" className="mb-6">
        <TabsList className="bg-emerald-100/50 p-1 border border-emerald-200/50">
          <TabsTrigger 
            value="assigned"
            className="cursor-pointer text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 text-emerald-700"
          >
            Assigned to Me ({myAssignedTasks.length})
          </TabsTrigger>
          <TabsTrigger 
            value="created"
            className="cursor-pointer text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 text-emerald-700"
          >
            Created by Me ({myCreatedTasks.length})
          </TabsTrigger>
          <TabsTrigger 
            value="overdue" 
            className="cursor-pointer text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 text-red-600"
          >
            Overdue ({overdueTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderTaskList(myAssignedTasks, "No tasks assigned to you yet")}
          </div>
        </TabsContent>

        <TabsContent value="created" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderTaskList(myCreatedTasks, "You haven't created any tasks yet")}
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderTaskList(overdueTasks, "No overdue tasks")}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
