import axios from 'axios';
import router from '@/router';

const API_URL = '/api/auth';

export async function refreshTokens() {
  const refreshToken = localStorage.getItem('refreshToken');
  const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');

  if (!refreshToken || new Date(refreshTokenExpiration) < new Date()) {
    console.log(refreshTokenExpiration);
    console.log(refreshToken);
    localStorage.clear();
    router.push({ name: 'Auth' });
    throw new Error('Refresh token is invalid or expired.');
  }

  try {
    const response = await axios.post(`${API_URL}/refreshTokens`, { refreshToken });

    if (response.status === 200) {
      const { accessToken, refreshToken: newRefreshToken, refreshTokenExpiration: newExpiration } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('refreshTokenExpiration', newExpiration);

      return accessToken;
    }
  } catch (error) {
    localStorage.clear();
    router.push({ name: 'Auth' });
    throw new Error('Failed to refresh tokens.');
  }
}
