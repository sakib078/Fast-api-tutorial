import React, { createContext, useContext, useState, ReactNode } from 'react';
import { registerUser } from '@/lib/api';
import { UsertoRegister, currentUser } from '@/types/user';


interface AuthContextType {
  user: currentUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<currentUser | null>();
  

  const login = async (email: string, _password: string) => {
    
    const mockUser: currentUser = {
      id: crypto.randomUUID(),
      email,
      is_active: true,
      is_superuser: false,
      is_verified: true,
    };
    setUser(mockUser);
  };

  const signup = async (email: string, _password: string) => {

    const userToRegister: UsertoRegister = {
      email: email,
      password: _password,
      is_active: true,
      is_superuser: false,
      is_verified: false,
    };

    const registeredUser: currentUser = await registerUser(userToRegister);

    setUser(registeredUser);
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

