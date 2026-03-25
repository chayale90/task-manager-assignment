import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../services/api';
import type { Comment } from '../types';

export const useComments = (taskId: string | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      fetchComments();
    } else {
      setComments([]);
      setLoading(false);
      setError(null);
    }
  }, [taskId]);

  const fetchComments = async () => {
    if (!taskId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Comment[]>(`/comments?taskId=${taskId}`);
      setComments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load comments';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!taskId) return;
    
    try {
      const newComment = await api.post<Comment>('/comments', {
        taskId,
        content,
      });
      setComments((prev) => [newComment, ...prev]);
      toast.success('Comment added');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add comment';
      toast.error(message);
      throw err;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete comment';
      toast.error(message);
      throw err;
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    refetch: fetchComments,
  };
};
