import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { loginCustomer, fetchCustomerById } from '../services/api';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext) as AuthContextType;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      fetchCustomerById(parseInt(userId))
        .then(data => {
          setUser(data);
          setIsAuthenticated(true);
        })
        .catch(error => {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { customer, token } = await loginCustomer(email, password);
      setUser(customer);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', customer.id.toString());
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, setUser: updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};