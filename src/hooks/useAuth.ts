
import { useEffect, useState } from 'react';
import { AuthService } from '@/services/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage if exists
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login(email, password);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, loading, login, logout };
}
