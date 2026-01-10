import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const userData = {
          _id: data._id,
          username: data.username,
          email: data.email,
          name: data.name,
          role: data.role,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        return { success: true, user: userData };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };
  
  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const user = {
          _id: data._id,
          username: data.username,
          email: data.email,
          name: data.name,
          role: data.role,
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', data.token);
        return { success: true, user: user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  
  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};