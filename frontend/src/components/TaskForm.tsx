import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Input, Button, Select, MultiSelect } from './ui';
import type { Task, TaskFormData, User } from '../types';
import { toast } from 'sonner';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<Task>;
  users: User[];
  usersLoading: boolean;
}

const textareaStyles = 'w-full rounded-lg shadow-sm px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900';

export const TaskForm = ({ onSubmit, initialData, users, usersLoading }: TaskFormProps) => {

  const initialAssigneeIds =
    initialData?.assignments?.map((a) => a.userId) ?? [];

  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'TODO',
    priority: initialData?.priority || 'MEDIUM',
    assigneeIds: initialAssigneeIds,
  });

  const [titleError, setTitleError] = useState<string>('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (name === 'title' && titleError) {
      setTitleError('');
    }
  };

  const handleAssigneesChange = (ids: string[]) => {
    setFormData({ ...formData, assigneeIds: ids });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      setTitleError('Title is required');
      toast.error('Please enter a title for the task');
      return;
    }
    
    onSubmit({ ...formData, title: trimmedTitle });
  };

  const userOptions = users.map((u) => ({
    value: u.id,
    label: u.name || u.username,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          className={titleError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
        />
        {titleError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{titleError}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={textareaStyles}
          rows={3}
          placeholder="Add some details..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
      </div>
      <MultiSelect
        label="Assignees"
        options={userOptions}
        value={formData.assigneeIds ?? []}
        onChange={handleAssigneesChange}
        placeholder="Assign team members..."
        loading={usersLoading}
        className="z-[100]"
      />
      <Button type="submit" className="w-full">
        {initialData ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  );
};
