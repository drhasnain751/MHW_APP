import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await api.get('/users/profile');
        setUser(response.data);
      }
    } catch (e) {
      console.log('Restoring token failed', e);
      await AsyncStorage.removeItem('userToken');
    }
    setIsLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/auth', { email, password });
      await AsyncStorage.setItem('userToken', response.data.token);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/users', { name, email, password });
      await AsyncStorage.setItem('userToken', response.data.token);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
