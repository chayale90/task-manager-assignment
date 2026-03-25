import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Input, Button, Select } from './ui';
import { TaskListSkeleton } from './TaskSkeleton';
import type { Task, TaskFormData } from '../types';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, taskData: Partial<TaskFormData>) => Promise<Task>;
  restoreTask: (id: string) => void;
}

const priorityAccent: Record<string, string> = {
  HIGH: 'border-l-red-500',
  MEDIUM: 'border-l-amber-400',
  LOW: 'border-l-emerald-400',
};

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

export const TaskList = ({ tasks, loading, deleteTask, updateTask }: TaskListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<TaskFormData>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEditClick = (task: Task) => {
    setEditingId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (taskId: string) => {
    try {
      await updateTask(taskId, editFormData);
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setTimeout(async () => {
      await deleteTask(id);
      setDeletingId(null);
    }, 300);
  };

  const handleToggleDone = async (task: Task) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  if (loading) {
    return <TaskListSkeleton count={5} />;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`border-l-4 ${priorityAccent[task.priority] || 'border-l-slate-300'} p-0 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
            deletingId === task.id ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
          }`}
        >
          {editingId === task.id ? (
            // Edit mode
            <div className="space-y-4 p-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Title</label>
                <Input
                  type="text"
                  value={editFormData.title ?? ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={editFormData.description ?? ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full rounded-lg shadow-sm px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Status"
                  value={editFormData.status ?? ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </Select>
                <Select
                  label="Priority"
                  value={editFormData.priority ?? ''}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleSaveEdit(task.id)}>
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            // View mode
            <div className="flex items-start gap-4 p-5">
              {/* Circular indigo checkbox */}
              <button
                onClick={() => handleToggleDone(task)}
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                  task.status === 'DONE'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
              >
                {task.status === 'DONE' && <Check className="w-3 h-3" />}
              </button>

              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-slate-900 dark:text-white ${task.status === 'DONE' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p
                    className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: task.description }}
                  />
                )}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[task.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {statusLabel[task.status] || task.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge[task.priority] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                  </span>
                  {/* Soft-color tag pills */}
                  {task.tags?.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
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
              </div>

              {/* Icon action buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleEditClick(task)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
