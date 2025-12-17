import axiosClient from './axiosClient';

// AI 추천 관련 API
export const aiRecommendationApi = {
  // AI 챗봇과 대화
  chat: (message, context = {}) => {
    return axiosClient.post('/ai-recommendation/chat', {
      message,
      context, // 사용자 선호 설정, 위치 정보 등
    });
  },

  // AI 기반 행사 추천
  getRecommendations: (preferences) => {
    return axiosClient.post('/ai-recommendation/recommend', {
      preferences,
    });
  },
};

