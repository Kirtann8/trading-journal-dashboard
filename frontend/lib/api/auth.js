import apiClient from './client';
import { saveToken, removeToken } from '../auth-storage';

export const register = async (email, password, username, firstName, lastName) => {
  try {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      username,
      profile: {
        firstName,
        lastName
      }
    });
    
    // Backend returns { success, message, data: { user, token } }
    if (response.data.data?.token) {
      saveToken(response.data.data.token);
    }
    
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    // Backend returns { success, message, data: { user, token } }
    if (response.data.data?.token) {
      saveToken(response.data.data.token);
    }
    
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    // Optional: Call logout endpoint to invalidate token on server
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Continue with logout even if API call fails
    console.warn('Logout API call failed:', error.message);
  } finally {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await apiClient.put('/profile', data);
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const deleteAccount = async () => {
  try {
    const response = await apiClient.delete('/auth/account');
    removeToken();
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};