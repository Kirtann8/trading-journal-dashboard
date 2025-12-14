import apiClient from './client';

export const getProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
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

export const getStats = async () => {
  try {
    const response = await apiClient.get('/profile/stats');
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const getProfileStats = async () => {
  try {
    const response = await apiClient.get('/profile/stats');
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};