import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('spp_token'));
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.success && response.token) {
        localStorage.setItem('spp_token', response.token);
        setToken(response.token);
        setUser(response.user);
        toast.success(`Welcome back, ${response.user.name}!`);
        return { success: true, user: response.user };
      }
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.success && response.token) {
        localStorage.setItem('spp_token', response.token);
        setToken(response.token);
        setUser(response.user);
        toast.success('Account created successfully!');
        return { success: true, user: response.user };
      }
      throw new Error(response.message || 'Registration failed');
    } catch (err) {
      toast.error(err.message || 'Registration error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('spp_token');
    setToken(null);
    setUser(null);
    toast.info('You have logged out.');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.success && response.user) {
        setUser(response.user);
        toast.success('Profile updated successfully!');
        return { success: true, user: response.user };
      }
      throw new Error(response.message || 'Could not update profile');
    } catch (err) {
      toast.error(err.message || 'Profile update failed');
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
