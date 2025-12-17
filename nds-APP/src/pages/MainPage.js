import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import WeatherSection from '../components/features/WeatherSection';
import { useAppContext } from '../context/AppContext';

function MainPage() {
  const navigation = useNavigation();
  const { weatherData, setWeatherData, position, setPosition, userPreferences, setUserPreferences } = useAppContext();
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    setFakeData();
    checkPreferencesAndRedirect(); // 선호도 체크 로직 추가
  }, []);

  // 1. 선호도 조사 데이터가 있는지 확인하고 없으면 이동
  const checkPreferencesAndRedirect = async () => {
    try {
      const stored = await AsyncStorage.getItem('userPreferences');
      if (stored) {
        const parsedPrefs = JSON.parse(stored); // 변수명 수정 (prefs -> parsedPrefs)
        setPreferences(parsedPrefs);
        if (setUserPreferences) setUserPreferences(parsedPrefs);
      } else {
        // 데이터가 없으면 선호도 조사 페이지로 강제 이동
        // 페이지 이름이 'UserPreference' 또는 'Preference'인지 확인 필요
        navigation.navigate('UserPreference');
      }
    } catch (error) {
      console.error('선호 설정 로드 실패:', error);
    }
  };

  const setFakeData = () => {
    setPosition({
      latitude: 37.5407,
      longitude: 127.0702,
      guName: '서울특별시 광진구',
      region: '동북권',
      gu: '광진구',
    });

    setWeatherData({
      location: '서울특별시 광진구',
      pm10: 15,
      pm2_5: 8,
      o3: 0.02,
      airQuality: '좋음',
      airQualityColor: '#2196F3',
    });
  };

  const getPlaceTypeText = (type) => {
    switch (type) {
      case 'indoor': return '실내';
      case 'outdoor': return '실외';
      case 'both': return '상관없음';
      default: return '미설정';
    }
  };

  const getPricePreferenceText = (pref) => {
    switch (pref) {
      case 'free': return '무료 행사 선호';
      case 'all': return '유료/무료 상관없음';
      default: return '미설정';
    }
  };

  if (!weatherData) return null;

  return (
    <View style={styles.container}>
      <Header currentLocation={weatherData.location} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <WeatherSection
          location={weatherData.location}
          pm10={weatherData.pm10}
          pm2_5={weatherData.pm2_5}
          o3={weatherData.o3}
          airQuality={weatherData.airQuality}
          airQualityColor={weatherData.airQualityColor}
        />

        <View style={styles.recommendationSection}>
          <Text style={styles.sectionTitle}>행사 추천</Text>
          <TouchableOpacity style={[styles.recommendationButton, styles.aiButton]} onPress={() => navigation.navigate('AIRecommendation')}>
            <Text style={styles.buttonIcon}>🤖</Text>
            <View>
              <Text style={styles.buttonTitle}>AI 추천</Text>
              <Text style={styles.buttonDescription}>챗봇과 대화하며 맞춤 행사 추천받기</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.recommendationButton, styles.festivalButton]} onPress={() => navigation.navigate('FestivalSearch')}>
            <Text style={styles.buttonIcon}>🎪</Text>
            <View>
              <Text style={styles.buttonTitle}>축제 검색</Text>
              <Text style={styles.buttonDescription}>축제 키워드로 검색하기</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.recommendationButton, styles.placeButton]} onPress={() => navigation.navigate('PlaceEvents', { ...position, weatherData })}>
            <Text style={styles.buttonIcon}>🏛️</Text>
            <View>
              <Text style={styles.buttonTitle}>장소 유형별 추천</Text>
              <Text style={styles.buttonDescription}>실내/실외 행사 추천</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.recommendationButton, styles.locationButton]} onPress={() => navigation.navigate('LocationEvents', { ...position, weatherData })}>
            <Text style={styles.buttonIcon}>📍</Text>
            <View>
              <Text style={styles.buttonTitle}>위치 기반 추천</Text>
              <Text style={styles.buttonDescription}>주변 행사 찾기</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.recommendationButton, styles.categoryButton]} onPress={() => navigation.navigate('CategoryEvents', { ...position, weatherData })}>
            <Text style={styles.buttonIcon}>📚</Text>
            <View>
              <Text style={styles.buttonTitle}>카테고리별 추천</Text>
              <Text style={styles.buttonDescription}>관심 분야별 맞춤 추천</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recommendationButton, { backgroundColor: '#FFF9C4' }]}
            onPress={() => navigation.navigate('ShortestPath')}
          >
            <Text style={styles.buttonIcon}>🚀</Text>
            <View>
              <Text style={styles.buttonTitle}>행사 간 최단 경로 찾기</Text>
              <Text style={styles.buttonDescription}>3개 행사를 골라 가장 빠른 경로 안내</Text>
            </View>
          </TouchableOpacity>
        </View>

        {(preferences || userPreferences) && (
          <View style={styles.preferencesSection}>
            <Text style={styles.sectionTitle}>나의 선호 설정</Text>
            <View style={styles.preferencesCard}>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>장소 유형</Text>
                <Text style={styles.preferenceValue}>{getPlaceTypeText((preferences || userPreferences)?.placeType)}</Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>최대 거리</Text>
                <Text style={styles.preferenceValue}>{(preferences || userPreferences)?.maxDistance || 5}km</Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>가격 선호도</Text>
                <Text style={styles.preferenceValue}>{getPricePreferenceText((preferences || userPreferences)?.pricePreference)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  recommendationSection: { padding: 16, backgroundColor: '#fff', gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8, paddingLeft: 4 },
  recommendationButton: { padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width:0, height:2} },
  aiButton: { backgroundColor: '#E1F5FE' },
  festivalButton: { backgroundColor: '#FFF3E0' },
  placeButton: { backgroundColor: '#E3F2FD' },
  locationButton: { backgroundColor: '#E8F5E9' },
  categoryButton: { backgroundColor: '#F3E5F5' },
  buttonIcon: { fontSize: 28 },
  buttonTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  buttonDescription: { fontSize: 12, color: '#666', marginTop: 2 },
  preferencesSection: { padding: 16, backgroundColor: '#fff', marginTop: 8 },
  preferencesCard: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, gap: 10 },
  preferenceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preferenceLabel: { fontSize: 14, color: '#666' },
  preferenceValue: { fontSize: 14, fontWeight: 'bold', color: '#2196F3' },
});

export default MainPage;


/*
  const fetchWeatherData = async () => {
    console.log('🌍 fetchWeatherData 함수 실행 시작');
    try {
      const { latitude, longitude } = await getCurrentLocation();
      console.log('📍 현재 위치:', latitude, longitude);
      
      if (!latitude || !longitude) {
        throw new Error('위치 정보를 가져올 수 없습니다.');
      }

      const guName = await reverseGeocode(latitude, longitude);
      const { region, gu } = mapAddressToRegion(guName);
      console.log('🗺️ 추출된 지역 =>', region, gu);

      setPosition({ latitude, longitude, guName, region, gu });

      let airQualityData;
      try {
        airQualityData = await getSeoulAirQuality(region, gu);
        console.log('✅ 서울시 대기질 데이터:', airQualityData);
      } catch (error) {
        console.error('⚠️ 서울시 API 호출 실패:', error);
        airQualityData = {
          pm10: 81,
          pm25: 45,
          o3: 0.035,
          regionName: '도심권',
          airQualityGrade: '나쁨',
          airQualityIndex: 54,
        };
      }

      const finalWeatherData = {
        location: guName,
        pm10: airQualityData.pm10,
        pm2_5: airQualityData.pm25,
        o3: airQualityData.o3,
        airQuality: airQualityData.airQualityGrade,
        airQualityColor: getAirQualityColor(airQualityData.airQualityGrade),
      };

      setWeatherData(finalWeatherData);
      console.log('🌤️ setWeatherData 완료:', finalWeatherData);
    } catch (error) {
      console.error('❌ 위치 또는 날씨 데이터를 가져오는데 실패했습니다:', error);

      const fallbackWeather = {
        location: '서울특별시 광진구',
        pm10: 81,
        pm2_5: 45,
        o3: 0.035,
        airQuality: '나쁨',
        airQualityColor: '#F44336',
      };

      setWeatherData(fallbackWeather);
      setPosition({
        latitude: 37.5407,
        longitude: 127.0702,
        guName: '서울특별시 광진구',
        region: '서울특별시',
        gu: '광진구',
      });
    }
  };

  const getPlaceTypeText = (type) => {
    switch (type) {
      case 'indoor': return '실내';
      case 'outdoor': return '실외';
      case 'both': return '상관없음';
      default: return '-';
    }
  };

  const getPricePreferenceText = (pref) => {
    switch (pref) {
      case 'free': return '무료 행사 선호';
      case 'all': return '유료/무료 상관없음';
      default: return '-';
    }
  };

  // 로딩 상태 표시
  if (!weatherData && !position) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#666' }}>위치 정보를 가져오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        currentLocation={weatherData?.location || position?.guName || '서울특별시 광진구'}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <WeatherSection
          location={weatherData?.location || position?.guName || '서울특별시 광진구'}
          pm10={weatherData?.pm10 || 81}
          pm2_5={weatherData?.pm2_5 || 45}
          o3={weatherData?.o3 || 0.035}
          airQuality={weatherData?.airQuality || '나쁨'}
          airQualityColor={weatherData?.airQualityColor || '#F44336'}
        />


        <View style={styles.recommendationSection}>
          <Text style={styles.sectionTitle}>행사 추천</Text>
          
          <TouchableOpacity
            style={[styles.recommendationButton, styles.aiButton]}
            onPress={() => navigation.navigate('AIRecommendation')}
          >
            <Text style={styles.buttonIcon}>🤖</Text>
            <Text style={styles.buttonTitle}>AI 추천</Text>
            <Text style={styles.buttonDescription}>챗봇과 대화하며 맞춤 행사 추천받기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recommendationButton, styles.festivalButton]}
            onPress={() => navigation.navigate('FestivalSearch')}
          >
            <Text style={styles.buttonIcon}>🎪</Text>
            <Text style={styles.buttonTitle}>축제 검색</Text>
            <Text style={styles.buttonDescription}>축제 키워드로 검색하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recommendationButton, styles.placeButton]}
            onPress={() => navigation.navigate('PlaceEvents', {
              latitude: position?.latitude,
              longitude: position?.longitude,
              guName: position?.guName,
              weatherData,
              region: position?.region,
              gu: position?.gu,
            })}
          >
            <Text style={styles.buttonIcon}>🏛️</Text>
            <Text style={styles.buttonTitle}>장소 유형별 행사 추천</Text>
            <Text style={styles.buttonDescription}>실내/실외 행사 추천</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recommendationButton, styles.locationButton]}
            onPress={() => navigation.navigate('LocationEvents', {
              latitude: position?.latitude,
              longitude: position?.longitude,
              guName: position?.guName,
              weatherData,
              region: position?.region,
              gu: position?.gu,
            })}
          >
            <Text style={styles.buttonIcon}>📍</Text>
            <Text style={styles.buttonTitle}>위치 기반 행사 추천</Text>
            <Text style={styles.buttonDescription}>주변 행사 찾기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recommendationButton, styles.categoryButton]}
            onPress={() => navigation.navigate('CategoryEvents', {
              latitude: position?.latitude,
              longitude: position?.longitude,
              guName: position?.guName,
              weatherData,
              region: position?.region,
              gu: position?.gu,
            })}
          >
            <Text style={styles.buttonIcon}>📚</Text>
            <Text style={styles.buttonTitle}>카테고리별 행사 추천</Text>
            <Text style={styles.buttonDescription}>관심 분야별 맞춤 추천</Text>
          </TouchableOpacity>
        </View>


        {(preferences || userPreferences) && (
          <View style={styles.preferencesSection}>
            <Text style={styles.sectionTitle}>나의 선호 설정</Text>
            <View style={styles.preferencesCard}>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>장소 유형:</Text>
                <Text style={styles.preferenceValue}>
                  {getPlaceTypeText((preferences || userPreferences)?.placeType)}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>최대 거리:</Text>
                <Text style={styles.preferenceValue}>
                  {(preferences || userPreferences)?.maxDistance || 5}km
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>가격 선호도:</Text>
                <Text style={styles.preferenceValue}>
                  {getPricePreferenceText((preferences || userPreferences)?.pricePreference)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  recommendationSection: {
    padding: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recommendationButton: {
    padding: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiButton: {
    backgroundColor: '#E1F5FE',
  },
  festivalButton: {
    backgroundColor: '#FFF3E0',
  },
  placeButton: {
    backgroundColor: '#E3F2FD',
  },
  locationButton: {
    backgroundColor: '#E8F5E9',
  },
  categoryButton: {
    backgroundColor: '#F3E5F5',
  },
  buttonIcon: {
    fontSize: 32,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonDescription: {
    fontSize: 14,
    color: '#666',
  },
  preferencesSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  preferencesCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#666',
  },
  preferenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});

export default MainPage;

*/