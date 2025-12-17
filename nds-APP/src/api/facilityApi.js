import axiosClient from './axiosClient';

// 편의시설 관련 API
export const facilityApi = {
  // 주변 편의시설 조회
  getNearbyFacilities: (latitude, longitude, radius = 500, types = []) => {
    return axiosClient.get('/facilities/nearby', {
      params: {
        latitude,
        longitude,
        radius, // 미터 단위
        types: types.join(','), // 쉼표로 구분된 타입 목록 (예: "restaurant,cafe,parking")
      },
    });
  },

  // 특정 타입의 편의시설 조회
  getFacilitiesByType: (latitude, longitude, type, radius = 500) => {
    return axiosClient.get('/facilities/by-type', {
      params: {
        latitude,
        longitude,
        type,
        radius,
      },
    });
  },
};

