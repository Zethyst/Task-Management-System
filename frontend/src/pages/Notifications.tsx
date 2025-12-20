
import { useTasks } from '@/context/TaskContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, isLoading } = useTasks();

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="p-8 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-emerald-600/70">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-emerald-600/70">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={markAllNotificationsRead}
            className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <Card
              key={notification.id}
              className={cn(
                'border-emerald-200/50 bg-white/80 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.01]',
                !notification.read && 'border-emerald-400/70 bg-gradient-to-r from-emerald-50/80 to-green-50/80 shadow-md shadow-emerald-500/10'
              )}
              onClick={() => markNotificationRead(notification.id)}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className={cn(
                  'p-2 rounded-lg transition-all duration-300',
                  notification.read ? 'bg-emerald-100/50' : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/30'
                )}>
                  <Bell className={cn(
                    'h-5 w-5 transition-all duration-300',
                    notification.read ? 'text-emerald-600' : 'text-white'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm text-emerald-700',
                    !notification.read && 'font-semibold'
                  )}>
                    {notification.message}
                  </p>
                  {notification.task && (
                    <p className="text-xs text-emerald-600/70 mt-1">
                      Task: {notification.task.title}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600/60">
                    <Clock className="h-3 w-3" />
                    {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 animate-pulse shadow-lg shadow-emerald-500/50" />
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="inline-block p-4 rounded-full bg-emerald-100/50 mb-4">
              <Bell className="h-12 w-12 text-emerald-400" />
            </div>
            <p className="text-emerald-600/70">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
