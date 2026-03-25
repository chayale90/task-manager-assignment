import { Modal } from './ui';
import { CommentList } from './CommentList';
import type { Task, User } from '../types';

interface TaskDetailModalProps {
  task: Task | null;
  currentUser: User | null;
  onClose: () => void;
}

const priorityBadge: Record<string, string> = {
  HIGH: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  MEDIUM: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  LOW: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
};

const statusBadge: Record<string, string> = {
  TODO: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  DONE: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
};

const statusLabel: Record<string, string> = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
];

const getAvatarColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name?: string | null, username?: string) => {
  const source = name || username || '?';
  const parts = source.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : source.slice(0, 2).toUpperCase();
};

export const TaskDetailModal = ({ task, currentUser, onClose }: TaskDetailModalProps) => {
  if (!task) return null;

  return (
    <Modal
      isOpen={!!task}
      onClose={onClose}
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Task Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {task.title}
          </h2>
          
          {task.description && (
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[task.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {statusLabel[task.status] || task.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityBadge[task.priority] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
            </span>
            {task.tags?.map(({ tag }) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
                style={
                  tag.color
                    ? {
                        backgroundColor: `${tag.color}1A`,
                        color: tag.color,
                        borderColor: `${tag.color}33`,
                      }
                    : undefined
                }
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Assignees */}
          {task.assignments && task.assignments.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Assigned to:
              </p>
              <div className="flex flex-wrap gap-2">
                {task.assignments.map((assignment) => {
                  const color = getAvatarColor(assignment.userId);
                  const initials = getInitials(assignment.user?.name, assignment.user?.username);
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full pr-3 py-1"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                        style={{ backgroundColor: color }}
                      >
                        {initials}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {assignment.user?.name || assignment.user?.username || 'Unknown'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700"></div>

        {/* Comments Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Comments
          </h3>
          <CommentList taskId={task.id} currentUser={currentUser} />
        </div>
      </div>
    </Modal>
  );
};
