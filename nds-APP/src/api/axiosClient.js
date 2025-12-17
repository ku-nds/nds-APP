import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.API_URL || 'http://localhost:3001/api';

if (!BASE_URL) {
  // 개발 중 환경변수 누락 확인용 경고
  // eslint-disable-next-line no-console
  console.warn('API_URL is not defined');
}

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request Interceptor - 요청 전 처리
axiosClient.interceptors.request.use(
  async (config) => {
    // 토큰이 있다면 헤더에 추가
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - 응답 후 처리
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 401 Unauthorized - 토큰 만료 등
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
      } catch (e) {
        console.error('Error removing token:', e);
      }
      // 네비게이션은 컴포넌트에서 처리
    }
    
    // 403 Forbidden
    if (error.response?.status === 403) {
      console.error('접근 권한이 없습니다.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

