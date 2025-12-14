import apiClient from './client';

export const recalculateTrades = async () => {
  try {
    const response = await apiClient.post('/trades/recalculate');
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};
