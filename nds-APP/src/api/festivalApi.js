import axiosClient from './axiosClient';

// 축제 검색 관련 API
export const festivalApi = {
  // 축제 키워드 검색
  searchFestivals: (keyword, params = {}) => {
    return axiosClient.get('/festivals/search', {
      params: {
        keyword,
        ...params,
      },
    });
  },

  // 인기 축제 조회
  getPopularFestivals: (params = {}) => {
    return axiosClient.get('/festivals/popular', { params });
  },

  // 진행 중인 축제 조회
  getOngoingFestivals: (params = {}) => {
    return axiosClient.get('/festivals/ongoing', { params });
  },
};

