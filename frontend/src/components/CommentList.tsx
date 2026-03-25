import { useState } from 'react';
import { Trash2, Send } from 'lucide-react';
import { useComments } from '../hooks/useComments';
import { Button } from './ui';
import type { User } from '../types';

interface CommentListProps {
  taskId: string;
  currentUser: User | null;
}

export const CommentList = ({ taskId, currentUser }: CommentListProps) => {
  const { comments, loading, error, addComment, deleteComment } = useComments(taskId);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(newComment.trim());
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full rounded-lg shadow-sm px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 resize-none"
          rows={3}
          disabled={submitting}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!newComment.trim() || submitting}
          >
            <Send className="w-4 h-4 mr-1.5" />
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>

      <div className="space-y-3 mt-6">
        {comments.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {comment.user?.name || comment.user?.username || 'Unknown'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
                {currentUser && comment.userId === currentUser.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors flex-shrink-0"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
