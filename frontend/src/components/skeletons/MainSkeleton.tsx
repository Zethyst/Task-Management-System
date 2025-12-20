import React from 'react';

const TaskFlowSkeleton: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#f8faf9] w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-8 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-shimmer"></div>
          <div className="w-24 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
            <div className="w-5 h-5 bg-gradient-to-r from-green-200 to-green-300 rounded animate-shimmer"></div>
            <div className="w-24 h-4 bg-gradient-to-r from-green-200 to-green-300 rounded animate-shimmer"></div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="w-24 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="w-24 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="w-24 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 mt-auto">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-shimmer flex-shrink-0"></div>
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="w-28 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="w-32 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="flex items-center gap-3 p-3">
          <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          <div className="w-20 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-10 animate-fade-in">
        {/* Header */}
        <header className="mb-8">
          <div className="w-72 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-shimmer"></div>
          <div className="w-52 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div className="w-24 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
              <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            </div>
            <div className="w-16 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 animate-fade-in animation-delay-100">
            <div className="flex justify-between items-center mb-4">
              <div className="w-24 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
              <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            </div>
            <div className="w-16 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 animate-fade-in animation-delay-200">
            <div className="flex justify-between items-center mb-4">
              <div className="w-24 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
              <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            </div>
            <div className="w-16 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 animate-fade-in">
          <div className="w-36 h-9 bg-gradient-to-r from-green-200 to-green-300 rounded-lg animate-shimmer"></div>
          <div className="w-36 h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-shimmer"></div>
          <div className="w-36 h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-shimmer"></div>
        </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3 animate-fade-in">
            <div className="w-3/5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="w-24 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="w-2/5 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="flex gap-2 mt-2">
              <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
              <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            </div>
            <div className="w-40 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer mt-2"></div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3 animate-fade-in animation-delay-100">
            <div className="w-3/5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="w-24 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="w-2/5 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="flex gap-2 mt-2">
              <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
              <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            </div>
            <div className="w-40 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer mt-2"></div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default TaskFlowSkeleton;