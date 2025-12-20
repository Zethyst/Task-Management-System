import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  ListTodo,     
  Bell, 
  LogOut, 
  CheckSquare,
  User
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: ListTodo, label: 'All Tasks' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { unreadNotificationsCount } = useTasks();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <aside className="w-64 h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-green-50/50 border-r border-emerald-200/50 fixed left-0 top-0 shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-200/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/30">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              'hover:bg-emerald-100/70 text-emerald-700 hover:shadow-sm hover:translate-x-1',
              isActive && 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/30'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        <NavLink
          to="/notifications"
          className={({ isActive }) => cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
            'hover:bg-emerald-100/70 text-emerald-700 hover:shadow-sm hover:translate-x-1',
            isActive && 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/30'
          )}
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-[10px] font-medium flex items-center justify-center text-white shadow-lg animate-pulse">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </div>
          <span className="font-medium">Notifications</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
            'hover:bg-emerald-100/70 text-emerald-700 hover:shadow-sm hover:translate-x-1',
            isActive && 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/30'
          )}
        >
          <User className="h-5 w-5" />
          <span className="font-medium">Profile</span>
        </NavLink>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-emerald-200/50 bg-white/50">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-emerald-50/50 transition-colors duration-200">
          <Avatar className="h-10 w-10 ring-2 ring-emerald-200">
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-green-500 text-white font-semibold">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-700 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-emerald-600/70 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="cursor-pointer w-full justify-start text-emerald-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}