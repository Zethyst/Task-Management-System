import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import TaskFlowSkeleton from '../skeletons/MainSkeleton';
import { useEffect, useState } from 'react';

export default function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <TaskFlowSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 min-h-screen">
      <Sidebar isMobile={isMobile} />
      <main className={`${isMobile ? 'ml-20' : 'ml-64'} min-h-screen`}>
        <Outlet />
      </main>
    </div>
  );
}
   