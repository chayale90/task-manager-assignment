import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../services/api';
import type { Task, TaskFilters, TaskFormData } from '../types';

export const useTasks = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

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
      setTasks([...tasks, newTask]);
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

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task. Please try again.');
      throw error;
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
