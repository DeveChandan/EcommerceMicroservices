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
          // For development environment, use mock data
          if (process.env.NODE_ENV === 'development' && token === 'mock-token-for-development') {
            const mockUser = {
              id: parseInt(userId),
              firstName: 'Demo',
              lastName: 'User',
              email: 'demo@example.com',
              address: '123 Demo Street',
              phoneNumber: '555-123-4567'
            };
            setUser(mockUser);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
          
          // For production, make the API call
          const userData = await fetchCustomerById(parseInt(userId));
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
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
      // For development environment, mock the login
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockUser = {
          id: 1,
          firstName: 'Demo',
          lastName: 'User',
          email: email,
          address: '123 Demo Street',
          phoneNumber: '555-123-4567'
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('token', 'mock-token-for-development');
        localStorage.setItem('userId', '1');
        return;
      }
      
      // Production code
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
    
    // You might also want to clear other user-related data from localStorage
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
      // For development, mock the update
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        return;
      }
      
      // In production, call the API
      // const updatedUserData = await updateCustomer(user.id, userData);
      // setUser(updatedUserData);
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