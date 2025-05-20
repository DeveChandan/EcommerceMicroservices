import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { loginCustomer, fetchCustomerById, updateCustomer } from '../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext) as AuthContextType;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const checkAuth = async () => {
      if (token && userId) {
        try {
          const userData = await fetchCustomerById(parseInt(userId));
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setUser(null);
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { customer, token } = await loginCustomer(email, password);
      setUser(customer);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', customer.id.toString());
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cartItems');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }
    try {
      const updatedUserData = await updateCustomer(user.id, userData);
      setUser(updatedUserData);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      setUser: updateUser,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};