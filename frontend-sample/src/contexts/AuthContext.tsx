import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '@/lib/api';
import { UsertoRegister, currentUser } from '@/types/user';


interface AuthContextType {
  user: currentUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<currentUser | null>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    let mounted = true;
    
    getCurrentUser()
      .then((me) => {
        if (mounted) setUser(me);
      })
      .catch((err) => {
        // Silently handle 401: it just means we show the login button
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };


  }, []);


  const login = async (email: string, _password: string) => {

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', _password);
    formData.append('grant_type', 'password');

    setLoading(true);
    try {

      await loginUser(formData);
      const me = await getCurrentUser();
      setUser(me);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, _password: string) => {

    const userToRegister: UsertoRegister = {
      email: email,
      password: _password,
      is_active: true,
      is_superuser: false,
      is_verified: false,
    };

    setLoading(true);

    try {
      const registeredUser = await registerUser(userToRegister);
      setUser(registeredUser);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {

    await logoutUser();
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
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

