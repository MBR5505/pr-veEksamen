// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/user`, { withCredentials: true });
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      console.error("Auth error:", error);
      setUser(null);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/auth/login`, 
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.msg || 'Login failed');
      return { success: false, error: error.response?.data?.msg || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      return { success: true };
    } catch (error) {
      setError('Logout failed');
      return { success: false, error: 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/auth/register`, 
        userData,
        { withCredentials: true }
      );
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.msg || 'Registration failed');
      return { success: false, error: error.response?.data?.msg || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = () => {
    fetchCurrentUser();
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};