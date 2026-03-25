import { Card } from './ui';

export const TaskSkeleton = () => {
  return (
    <Card className="border-l-4 border-l-slate-200 dark:border-l-slate-700 p-0 animate-pulse">
      <div className="flex items-start gap-4 p-5">
        {/* Checkbox skeleton */}
        <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />

        <div className="flex-1 min-w-0 space-y-3">
          {/* Title skeleton */}
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
          </div>

          {/* Badges skeleton */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-md" />
          <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-md" />
        </div>
      </div>
    </Card>
  );
};

export const TaskListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <TaskSkeleton key={index} />
      ))}
    </div>
  );
};
