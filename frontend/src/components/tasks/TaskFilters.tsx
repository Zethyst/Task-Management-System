import React from 'react';
import { type TaskFilters, type Priority, type Status } from '@/types/index';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, X } from 'lucide-react';

const priorities: (Priority | 'all')[] = ['all', 'Low', 'Medium', 'High', 'Urgent'];
const statuses: (Status | 'all')[] = ['all', 'To Do', 'In Progress', 'Review', 'Completed'];

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export default function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all';

  const clearFilters = () => {
    onChange({
      ...filters,
      status: 'all',
      priority: 'all',
    });
  };

  const toggleSortOrder = () => {
    onChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.status}
        onValueChange={(value: Status | 'all') => onChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map(s => (
            <SelectItem key={s} value={s}>
              {s === 'all' ? 'All Statuses' : s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(value: Priority | 'all') => onChange({ ...filters, priority: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          {priorities.map(p => (
            <SelectItem key={p} value={p}>
              {p === 'all' ? 'All Priorities' : p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(value: 'dueDate' | 'priority' | 'createdAt') => onChange({ ...filters, sortBy: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dueDate">Due Date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="createdAt">Created</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={toggleSortOrder}>
        <ArrowUpDown className="h-4 w-4" />
      </Button>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
