import apiClient from './client';

export const createTrade = async (tradeData) => {
  try {
    const response = await apiClient.post('/trades', tradeData);
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const getTrades = async (filters = {}) => {
  try {
    // Clean up empty filter values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const response = await apiClient.get('/trades', { params: cleanFilters });
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const getTradeById = async (id) => {
  try {
    const response = await apiClient.get(`/trades/${id}`);
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const updateTrade = async (id, data) => {
  try {
    const response = await apiClient.put(`/trades/${id}`, data);
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const deleteTrade = async (id) => {
  try {
    const response = await apiClient.delete(`/trades/${id}`);
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};