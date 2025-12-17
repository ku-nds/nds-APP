import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import WeatherSection from '../components/features/WeatherSection';
import RecommendationButtons from '../components/features/RecommendationButtons';
import AdvancedFilters from '../components/features/AdvancedFilters';
import { useAppContext } from '../context/AppContext';

function CulturalEventCuration() {
  const { weatherData, setWeatherData, position, setPosition } = useAppContext();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [],
    distance: 5,
    age: 'all',
    timeRange: 'all',
  });

  useEffect(() => {
    // 1. 앱 실행 시 즉시 가짜 데이터 주입 (통신 생략)
    setFakeWeatherData();
  }, []);

  const setFakeWeatherData = () => {
    // 가짜 위치 정보
    const fakePosition = {
      latitude: 37.5407,
      longitude: 127.0702,
      guName: '서울특별시 광진구',
      region: '동북권',
      gu: '광진구',
    };

    // 가짜 날씨/대기질 정보
    const fakeWeather = {
      location: '서울특별시 광진구',
      pm10: 15,
      pm2_5: 8,
      o3: 0.02,
      airQuality: '좋음',
      airQualityColor: '#2196F3', // 파란색
    };

    setPosition(fakePosition);
    setWeatherData(fakeWeather);
  };

  const handleAdvancedFilterChange = (filters) => {
    setAdvancedFilters(filters);
  };

  // 데이터가 채워질 때까지 아주 잠깐만 대기
  if (!weatherData || !position) return null;

  return (
    <View style={styles.container}>
      <Header
        currentLocation={weatherData.location}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <WeatherSection
          location={weatherData.location}
          pm10={weatherData.pm10}
          pm2_5={weatherData.pm2_5}
          o3={weatherData.o3}
          airQuality={weatherData.airQuality}
          airQualityColor={weatherData.airQualityColor}
        />

        <RecommendationButtons
          weatherData={weatherData}
          guName={position.guName}
          latitude={position.latitude}
          longitude={position.longitude}
          region={position.region}
          gu={position.gu}
        />
      </ScrollView>

      <Footer />

      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFilterChange={handleAdvancedFilterChange}
        onApply={() => setShowAdvancedFilters(false)}
      />
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
});

export default CulturalEventCuration;