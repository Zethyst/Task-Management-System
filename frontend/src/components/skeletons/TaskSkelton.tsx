import React from 'react';

const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fade-in min-w-80">
      {/* Task Title */}
      <div className="w-2/5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3 animate-shimmer"></div>
      
      {/* Date */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-shimmer"></div>
        <div className="w-24 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
      </div>
      
      {/* Description */}
      <div className="w-1/4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-shimmer"></div>
      
      {/* Badges */}
      <div className="flex gap-2 mb-4">
        <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
        <div className="w-24 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
      </div>
      
      {/* Assignee */}
      <div className="w-40 h-3.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>

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
      `}</style>
    </div>
  );
};

const TaskCardsSkeletonGrid: React.FC<{ count?: number }> = ({ count = 2 }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-80">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
          <TaskCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export { TaskCardSkeleton, TaskCardsSkeletonGrid };
export default TaskCardSkeleton;