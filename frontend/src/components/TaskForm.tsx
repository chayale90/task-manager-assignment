import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Input, Button } from './ui';
import type { Task, TaskFormData } from '../types';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<Task>;
}

const selectStyles = 'w-full rounded-lg shadow-sm px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900';

export const TaskForm = ({ onSubmit, initialData }: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'TODO',
    priority: initialData?.priority || 'MEDIUM',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Title</label>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={selectStyles}
          rows={3}
          placeholder="Add some details..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={selectStyles}
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={selectStyles}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  );
};
