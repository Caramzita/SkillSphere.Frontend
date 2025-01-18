import axios from 'axios';
import { refreshTokens } from '@/services/authService';

export function createAxiosInstance(basePath = '/api') {
    const instance = axios.create({
        baseURL: `${basePath}`,
        headers: { 'Content-Type': 'application/json' },
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            console.error('Interceptor caught error:', error.response?.status);
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshTokens();
                if (newAccessToken) {
                  localStorage.setItem('accessToken', newAccessToken);
                  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                  return instance(originalRequest);
                }
              } catch (refreshError) {
                console.error('Error refreshing tokens:', refreshError);
                return Promise.reject(refreshError);
              }
            }

            return Promise.reject(error);
        }
    );

        instance.interceptors.request.use((config) => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
              config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        });

        return instance;
}