import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { EmptyState } from '../components/EmptyState';
import { NoResultsState } from '../components/NoResultsState';
import { FilterBar } from '../components/FilterBar';
import { Navbar } from '../components/Navbar';
import { Button, Card } from '../components/ui';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { useTags } from '../hooks/useTags';
import { useFilterPresets } from '../hooks/useFilterPresets';
import type { TaskFilters, TaskFormData } from '../types';

const paramsToFilters = (params: URLSearchParams): TaskFilters => {
  const filters: TaskFilters = {};
  const status = params.get('status');
  const priority = params.get('priority');
  const search = params.get('search');
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (search) filters.search = search;
  return filters;
};

const filtersToParams = (filters: TaskFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.search) params.search = filters.search;
  return params;
};

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = paramsToFilters(searchParams);

  const { tasks, loading, createTask, updateTask, deleteTask, restoreTask } = useTasks(filters);
  const { logout, user } = useAuth();
  const { users, loading: usersLoading } = useUsers();
  const { tags, loading: tagsLoading } = useTags();
  const { presets, savePreset, deletePreset } = useFilterPresets();
  const navigate = useNavigate();

  const handleFiltersChange = useCallback(
    (newFilters: TaskFilters) => {
      setSearchParams(filtersToParams(newFilters), { replace: true });
    },
    [setSearchParams]
  );

  const handleApplyPreset = useCallback(
    (preset: import('../hooks/useFilterPresets').FilterPreset) => {
      setSearchParams(filtersToParams(preset.filters), { replace: true });
    },
    [setSearchParams]
  );

  const handleCreateTask = async (taskData: TaskFormData) => {
    await createTask(taskData);
    setShowForm(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const hasActiveFilters = Boolean(filters.status || filters.priority || filters.search);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            {user != null && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Welcome back, {user.name || user.username}
              </p>
            )}
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'secondary' : 'primary'}
          >
            {showForm ? 'Cancel' : (
              <>
                <Plus className="w-4 h-4 mr-1.5 inline" />
                New Task
              </>
            )}
          </Button>
        </div>

        {/* Task form with smooth reveal */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showForm ? 'max-h-[800px] opacity-100 mb-8' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <Card>
            <TaskForm 
              key={showForm ? 'open' : 'closed'} 
              onSubmit={handleCreateTask}
              users={users}
              usersLoading={usersLoading}
              tags={tags}
              tagsLoading={tagsLoading}
            />
          </Card>
        </div>

        {/* Filter bar */}
        <Card className="mb-6">
          <FilterBar
            filters={filters}
            onChange={handleFiltersChange}
            presets={presets}
            onSavePreset={savePreset}
            onDeletePreset={deletePreset}
            onApplyPreset={handleApplyPreset}
          />
        </Card>

        {/* Task list or empty/no-results state */}
        {!loading && tasks.length === 0 ? (
          hasActiveFilters ? (
            <NoResultsState onClearFilters={() => handleFiltersChange({})} />
          ) : (
            <EmptyState onCreateTask={() => setShowForm(true)} />
          )
        ) : (
          <TaskList 
            tasks={tasks} 
            loading={loading} 
            deleteTask={deleteTask} 
            updateTask={updateTask}
            restoreTask={restoreTask}
            users={users}
            usersLoading={usersLoading}
            tags={tags}
            tagsLoading={tagsLoading}
          />
        )}
      </div>
    </div>
  );
};
