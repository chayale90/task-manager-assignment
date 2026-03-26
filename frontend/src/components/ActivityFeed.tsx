import { CircleDot, Flag, UserCheck, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useActivityFeed, Activity } from '../hooks/useActivityFeed';

interface ActivityFeedProps {
  taskId: string;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'TASK_CREATED':
      return <Plus className="w-4 h-4" />;
    case 'STATUS_CHANGED':
      return <CircleDot className="w-4 h-4" />;
    case 'PRIORITY_CHANGED':
      return <Flag className="w-4 h-4" />;
    case 'ASSIGNEE_CHANGED':
      return <UserCheck className="w-4 h-4" />;
    case 'COMMENT_ADDED':
      return <MessageSquare className="w-4 h-4" />;
    case 'TASK_DELETED':
      return <Trash2 className="w-4 h-4" />;
    default:
      return <CircleDot className="w-4 h-4" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'TASK_CREATED':
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10';
    case 'STATUS_CHANGED':
      return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10';
    case 'PRIORITY_CHANGED':
      return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10';
    case 'ASSIGNEE_CHANGED':
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10';
    case 'COMMENT_ADDED':
      return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/10';
    case 'TASK_DELETED':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10';
    default:
      return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/10';
  }
};

export const ActivityFeed = ({ taskId }: ActivityFeedProps) => {
  const { activities, loading, error } = useActivityFeed(taskId);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex gap-3 items-start"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-white">
                {activity.user.name || activity.user.username}
              </span>{' '}
              {activity.description}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
