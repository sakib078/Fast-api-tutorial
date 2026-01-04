import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('momento_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, _password: string) => {
    // Simulate login - replace with actual API call
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      is_active: true,
      is_superuser: false,
      is_verified: true,
    };
    setUser(mockUser);
    localStorage.setItem('momento_user', JSON.stringify(mockUser));
    localStorage.setItem('momento_token', 'mock_token_' + Date.now());
  };

  const signup = async (email: string, _password: string) => {
    // Simulate signup - replace with actual API call
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      is_active: true,
      is_superuser: false,
      is_verified: false,
    };
    setUser(mockUser);
    localStorage.setItem('momento_user', JSON.stringify(mockUser));
    localStorage.setItem('momento_token', 'mock_token_' + Date.now());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('momento_user');
    localStorage.removeItem('momento_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
