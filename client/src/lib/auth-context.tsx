import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

type UserType = 'consumer' | 'business' | null;

interface User {
  id: string;
  username?: string | null;
  businessName?: string | null;
  name: string;
  type: UserType;
  category?: string | null;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (type: 'consumer' | 'business', data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('syntera_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const login = async (type: 'consumer' | 'business', data: any) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          type,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Authentication failed');
      }

      const userData = await response.json();
      const formattedUser: User = {
        id: userData.id,
        username: userData.username,
        businessName: userData.businessName,
        name: userData.username || userData.businessName || 'User',
        type,
        email: userData.email,
        category: userData.category
      };
      
      setUser(formattedUser);
      localStorage.setItem('syntera_user', JSON.stringify(formattedUser));
      setLocation('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('syntera_user');
    setLocation('/home');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
