import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../services/api';
import type { AiSuggestion } from '../types';

export const useAiSuggestions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const suggestTaskDetails = async (title: string): Promise<AiSuggestion | null> => {
    if (!title.trim()) {
      toast.error('Please enter a task title first');
      return null;
    }

    setIsLoading(true);
    try {
      toast.loading('✨ AI is thinking...', { id: 'ai-loading' });
      
      const suggestion = await api.post<AiSuggestion>('/tasks/suggest', { title: title.trim() });
      
      toast.dismiss('ai-loading');
      toast.success('✨ Magic suggestions applied!');
      
      return suggestion;
    } catch (error: any) {
      toast.dismiss('ai-loading');
      
      let errorMessage = error?.response?.data?.message || 'AI Assistant is unavailable. Please try again.';
      
      if (error?.response?.status === 429) {
        errorMessage = 'הקסם נח לרגע, נסי שוב בעוד דקה 🪄';
      }
      
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    suggestTaskDetails,
  };
};
