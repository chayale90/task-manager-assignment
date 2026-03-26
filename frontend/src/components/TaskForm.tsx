import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Sparkles } from 'lucide-react';
import { Input, Button, Select, MultiSelect } from './ui';
import type { Task, TaskFormData, User, Tag } from '../types';
import { toast } from 'sonner';
import { useAiSuggestions } from '../hooks/useAiSuggestions';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<Task>;
  users: User[];
  usersLoading: boolean;
  tags: Tag[];
  tagsLoading: boolean;
}

const textareaStyles = 'w-full rounded-lg shadow-sm px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900';

export const TaskForm = ({ onSubmit, initialData, users, usersLoading, tags, tagsLoading }: TaskFormProps) => {
  const { isLoading: aiLoading, suggestTaskDetails } = useAiSuggestions();

  const initialAssigneeIds =
    initialData?.assignments?.map((a) => a.userId) ?? [];

  const initialTagIds = initialData?.tags?.map((t) => t.tagId) ?? [];

  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'TODO',
    priority: initialData?.priority || 'MEDIUM',
    assigneeIds: initialAssigneeIds,
    tagIds: initialTagIds,
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

  const handleTagsChange = (ids: string[]) => {
    setFormData({ ...formData, tagIds: ids });
  };

  const handleMagicFill = async () => {
    const trimmedTitle = formData.title.trim();
    
    if (!trimmedTitle) {
      toast.error('Please enter a task title first');
      return;
    }

    if (trimmedTitle.length < 3) {
      toast.error('Title must be at least 3 characters for AI suggestions');
      return;
    }

    const suggestion = await suggestTaskDetails(formData.title);
    if (!suggestion) return;

    const descriptionWithTime = `${suggestion.description}\n\n⏱️ Estimated: ${suggestion.estimatedTime}`;
    setFormData(prev => ({
      ...prev,
      description: descriptionWithTime,
      priority: suggestion.priority,
    }));

    if (suggestion.tags.length > 0) {
      const matchedTagIds = tags
        .filter(tag => 
          suggestion.tags.some(suggestedTag => 
            tag.name.toLowerCase() === suggestedTag.toLowerCase()
          )
        )
        .map(tag => tag.id);
      
      if (matchedTagIds.length > 0) {
        setFormData(prev => ({ ...prev, tagIds: matchedTagIds }));
      }
    }
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

  const tagOptions = tags.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleMagicFill}
            disabled={aiLoading || formData.title.trim().length < 3}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            {aiLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Magic Fill</span>
              </>
            )}
          </button>
        </div>
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
        label="Categories"
        options={tagOptions}
        value={formData.tagIds ?? []}
        onChange={handleTagsChange}
        placeholder="Select categories..."
        loading={tagsLoading}
        className="z-[100]"
      />
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
