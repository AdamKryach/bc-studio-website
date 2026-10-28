import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => ({ success: false }),
  logout: async () => {},
  checkAuth: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    try {
      const res = await api.checkAuth();
      if (res.authenticated && res.user) {
        setIsAuthenticated(true);
        setUser(res.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only check auth if on /admin routes to avoid unnecessary overhead on public browsing
    if (window.location.pathname.startsWith('/admin')) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.login(username, password);
      if (res.success && res.user) {
        setIsAuthenticated(true);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
