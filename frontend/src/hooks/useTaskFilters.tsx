import { useState, useMemo } from 'react';
import { type Task, type TaskFilters } from '@/types';

const priorityOrder = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'createdAt':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters]);

  return { filters, setFilters, filteredTasks };
}
