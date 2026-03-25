import { ClipboardList, Plus } from 'lucide-react';
import { Button } from './ui';

interface EmptyStateProps {
  onCreateTask: () => void;
}

export const EmptyState = ({ onCreateTask }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6">
        <ClipboardList className="w-8 h-8 text-indigo-400 dark:text-indigo-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        No tasks yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
        Create your first task to get started. Stay organized and track your progress effortlessly.
      </p>
      <Button onClick={onCreateTask}>
        <Plus className="w-4 h-4 mr-1.5 inline" />
        Create your first task
      </Button>
    </div>
  );
};
