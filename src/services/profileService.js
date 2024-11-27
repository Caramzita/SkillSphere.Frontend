import { createAxiosInstance } from '@/services/axiosInstance';

const axiosInstance8084 = createAxiosInstance(8084);
const accessToken = localStorage.getItem('accessToken');

export const checkProfileExistence = async () => {
  try {
    const response = await axiosInstance8084.get('/users/profile/check', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error checking profile existence:', error);

    if (error.response?.status === 401) {
      return { success: false, error: 'Unauthorized' };
    }

    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};