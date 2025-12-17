import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';

export const DEFAULT_LOCATION = {
  latitude: 37.5407,
  longitude: 127.0702,
};

export const DEFAULT_LOCATION_NAME = '서울특별시 광진구 건국대학교';

const REST_API_KEY = process.env.KAKAO_REST_API_KEY;

/**
 * Android 위치 권한 요청
 */
const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '앱이 현재 위치를 사용하기 위해 위치 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('위치 권한 요청 실패:', err);
      return false;
    }
  }
  return true; // iOS는 Info.plist에서 처리
};

/**
 * 사용자의 현재 위치를 가져오는 유틸리티 함수
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentLocation = async () => {
  // Android에서 권한 요청
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    console.warn('위치 권한이 거부되었습니다. 기본 위치를 사용합니다.');
    return DEFAULT_LOCATION;
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('위치 가져오기 실패:', error);
        // 에러 발생 시 기본 위치 반환
        resolve(DEFAULT_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

/**
 * 위도와 경도를 주소 (자치구 이름 포함)로 변환 (역지오코딩)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<string>} 주소 문자열 (자치구 이름 포함)
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    console.log('역지오코딩 시도:', latitude, longitude);
    
    if (!REST_API_KEY || REST_API_KEY === 'YOUR_KAKAO_REST_API_KEY') {
      console.warn('⚠️ Kakao REST API 키가 설정되지 않았습니다. 기본 위치명을 사용합니다.');
      return DEFAULT_LOCATION_NAME; 
    }

    // Kakao REST API 호출: 좌표를 행정 구역 코드로 변환 (coord2regioncode)
    const response = await fetch(
      // Kakao API는 경도(x)와 위도(y) 순서를 요구합니다.
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
      {
        headers: {
          Authorization: `KakaoAK ${REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    
    if (data.documents && data.documents.length > 0) {
      // 'H' (행정구역) 타입의 주소를 찾습니다.
      const regionH = data.documents.find(doc => doc.region_type === 'H'); 
      
      if (regionH) {
         // 시/도, 구/군 주소를 반환합니다. (예: 서울특별시 강남구)
         const address = `${regionH.region_1depth_name} ${regionH.region_2depth_name}`;
         console.log('역지오코딩 성공:', address);
         return address;
      }
    }

    // 결과가 없으면 기본 위치명 반환
    console.warn('역지오코딩 결과 없음, 기본 위치명 사용');
    return DEFAULT_LOCATION_NAME;

  } catch (error) {
    console.error('역지오코딩 실패:', error);
    // 에러 발생 시 기본 위치명 반환
    return DEFAULT_LOCATION_NAME;
  }
};


