import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { api } from '../services/api';
import type { Task, TaskFilters, TaskFormData } from '../types';

interface PendingDeletion {
  task: Task;
  timeoutId: ReturnType<typeof setTimeout>;
  toastId: string | number;
}

export const useTasks = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const pendingDeletionsRef = useRef<Map<string, PendingDeletion>>(new Map());

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      pendingDeletionsRef.current.forEach((pending) => {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        fetch(`${API_URL}/tasks/${pending.task.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          keepalive: true,
        });
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      pendingDeletionsRef.current.forEach((pending) => {
        clearTimeout(pending.timeoutId);
      });
    };
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const searchParams = Object.fromEntries(
      Object.entries(filters ?? {}).filter(
        (entry): entry is [string, string] => entry[1] !== undefined
      )
    );
    const queryParams = new URLSearchParams(searchParams).toString();
    const data = await api.get<Task[]>(`/tasks?${queryParams}`);
    setTasks(data);
    setLoading(false);
  };

  const createTask = async (taskData: TaskFormData) => {
    try {
      const newTask = await api.post<Task>('/tasks', taskData);
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully');
      return newTask;
    } catch (error) {
      toast.error('Failed to create task. Please try again.');
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: Partial<TaskFormData>) => {
    try {
      const updatedTask = await api.put<Task>(`/tasks/${id}`, taskData);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      toast.success('Task updated');
      return updatedTask;
    } catch (error) {
      toast.error('Failed to update task. Please try again.');
      throw error;
    }
  };

  const executePendingDeletion = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      pendingDeletionsRef.current.delete(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      const pending = pendingDeletionsRef.current.get(id);
      if (pending) {
        setTasks((prevTasks) => [...prevTasks, pending.task].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
        pendingDeletionsRef.current.delete(id);
        toast.error('Failed to delete task. Task restored.');
      }
    }
  };

  const deleteTask = async (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (!taskToDelete) return;

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    const toastId = toast.success('Task deleted', {
      action: {
        label: 'Undo',
        onClick: () => restoreTask(id),
      },
      duration: 5000,
    });

    const timeoutId = setTimeout(() => {
      executePendingDeletion(id);
    }, 5000);

    pendingDeletionsRef.current.set(id, {
      task: taskToDelete,
      timeoutId,
      toastId,
    });
  };

  const restoreTask = (id: string) => {
    const pending = pendingDeletionsRef.current.get(id);
    if (!pending) return;

    clearTimeout(pending.timeoutId);
    toast.dismiss(pending.toastId);
    pendingDeletionsRef.current.delete(id);

    setTasks((prevTasks) => [...prevTasks, pending.task].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));

    toast.success('Task restored');
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    restoreTask,
    refetch: fetchTasks,
  };
};
