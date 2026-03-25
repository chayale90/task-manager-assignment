import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<User[]>('/users')
      .then((data) => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
};
