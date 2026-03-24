import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import type { TaskFilters, TaskFormData } from '../types';

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [filters] = useState<TaskFilters>({});
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks(filters);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleCreateTask = async (taskData: TaskFormData) => {
    await createTask(taskData);
    setShowForm(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            {user != null && (
              <p className="text-sm text-slate-600 mt-1">
                Welcome, {user.name || user.username}!
              </p>
            )}
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'secondary' : 'primary'}
          >
            {showForm ? 'Cancel' : 'New Task'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <TaskForm onSubmit={handleCreateTask} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">Tasks</h2>
          <TaskList 
            tasks={tasks} 
            loading={loading} 
            deleteTask={deleteTask} 
            updateTask={updateTask} 
          />
        </div>
      </div>
    </div>
  );
};
