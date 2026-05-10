import { useState, useEffect } from 'react';
import { setAuthToken, login as apiLogin, getMe } from '../api/client';

interface User {
  id: number;
  login: string;
  full_name: string;
  role: 'admin' | 'worker';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const response = await getMe();
          setUser(response.data);
        } catch (error) {
          console.error('Ошибка получения пользователя', error);
          setAuthToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (login: string, password: string) => {
    try {
      const response = await apiLogin(login, password);
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Ошибка входа', error);
      return false;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return { user, loading, login, logout };
};