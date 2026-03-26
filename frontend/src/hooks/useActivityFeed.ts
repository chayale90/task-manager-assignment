import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface Activity {
  id: string;
  taskId: string;
  userId: string;
  type: 'TASK_CREATED' | 'STATUS_CHANGED' | 'PRIORITY_CHANGED' | 'ASSIGNEE_CHANGED' | 'COMMENT_ADDED' | 'TASK_DELETED';
  description: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    username: string;
    name: string | null;
  };
}

export const useActivityFeed = (taskId: string | null) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) {
      setActivities([]);
      return;
    }

    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<Activity[]>(`/tasks/${taskId}/activity`);
        setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setError('Failed to load activity feed');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [taskId]);

  return { activities, loading, error };
};
