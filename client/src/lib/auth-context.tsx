import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

type UserType = 'consumer' | 'business' | null;

interface User {
  id: string;
  name: string;
  type: UserType;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (type: 'consumer' | 'business', data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Simulate checking auth session
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('syntera_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const login = (type: 'consumer' | 'business', data: any) => {
    const dummyUser: User = {
      id: '123',
      name: data.username || data.businessName || 'User',
      type,
      email: data.email
    };
    setUser(dummyUser);
    localStorage.setItem('syntera_user', JSON.stringify(dummyUser));
    setLocation('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('syntera_user');
    setLocation('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
