import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import axios from 'axios';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        setError('获取用户信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('未登录');

      const response = await axios.patch('/api/users/me', updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data);
    } catch (err) {
      setError('更新用户信息失败');
      throw err;
    }
  };

  return { user, loading, error, updateUser };
}; 