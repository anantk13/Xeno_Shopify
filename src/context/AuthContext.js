import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const savedTenant = localStorage.getItem('currentTenant');

      if (token && savedTenant) {
        // Verify token with backend
        const response = await authAPI.verify();
        setIsAuthenticated(true);
        setCurrentTenant(response.tenant);
        
        // Update cached tenant data if backend has newer info
        localStorage.setItem('currentTenant', JSON.stringify(response.tenant));
      } else {
        setIsAuthenticated(false);
        setCurrentTenant(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      setIsAuthenticated(true);
      setCurrentTenant(response.tenant);
      
      toast.success(`Welcome back, ${response.tenant.name}!`);
      return { success: true, data: response };
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      setIsAuthenticated(true);
      setCurrentTenant(response.tenant);
      
      toast.success(`Welcome, ${response.tenant.name}! Your account has been created.`);
      return { success: true, data: response };
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentTenant(null);
    authAPI.logout();
    toast.success('Logged out successfully');
  };

  const updateTenantData = (updatedTenant) => {
    setCurrentTenant(updatedTenant);
    localStorage.setItem('currentTenant', JSON.stringify(updatedTenant));
  };

  const value = {
    isAuthenticated,
    currentTenant,
    loading,
    login,
    register,
    logout,
    updateTenantData,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};