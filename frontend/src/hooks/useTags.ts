import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Tag } from '../types';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Tag[]>('/tags')
      .then((data) => setTags(data))
      .catch(() => setTags([]))
      .finally(() => setLoading(false));
  }, []);

  return { tags, loading };
};
