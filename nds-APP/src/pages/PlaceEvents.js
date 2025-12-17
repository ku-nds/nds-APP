import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAppContext } from '../context/AppContext';

function PlaceTypeEvents() {
  const route = useRoute();
  const navigation = useNavigation();
  const { weatherData: globalWeather, position: globalPosition } = useAppContext();

  // 1. 데이터 우선순위 설정 (전달받은 데이터 혹은 전역 데이터)
  const weatherData = route.params?.weatherData || globalWeather;
  const guName = route.params?.guName || globalPosition?.guName || '서울특별시 광진구';

  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedPlaceType, setSelectedPlaceType] = useState('all');

  // 2. 가짜 통합 행사 데이터베이스
  const mockDatabase = [
    { id: 1, title: '광진 실내 배드민턴 대회', type: 'indoor', location: '광진구민체육센터', date: '2025.03.20', category: '스포츠' },
    { id: 2, title: '어린이대공원 숲속 산책', type: 'outdoor', location: '어린이대공원', date: '2025.03.21', category: '힐링' },
    { id: 3, title: '도서관 북 콘서트', type: 'indoor', location: '광진정보도서관', date: '2025.03.25', category: '문화' },
    { id: 4, title: '한강 야외 요가 클래스', type: 'outdoor', location: '뚝섬한강공원', date: '2025.03.22', category: '레저' },
    { id: 5, title: '미술관 현대 작가전', type: 'indoor', location: '자양문화센터', date: '2025.03.28', category: '전시' },
    { id: 6, title: '구의공원 플리마켓', type: 'outdoor', location: '구의공원', date: '2025.03.29', category: '장터' },
  ];

  useEffect(() => {
    // 앱 실행 시 미세먼지 수치에 따라 초기 타입 설정 (81 이상이면 실내 추천)
    const pm10Value = weatherData?.pm10 || 0;
    const initialType = pm10Value >= 81 ? 'indoor' : 'outdoor';
    setSelectedPlaceType(initialType);
    filterEvents(initialType);
    setIsLoading(false);
  }, []);

  // 3. 타입에 따른 데이터 필터링 함수
  const filterEvents = (type) => {
    if (type === 'all') {
      setEvents(mockDatabase);
    } else {
      const filtered = mockDatabase.filter(event => event.type === type);
      setEvents(filtered);
    }
  };

  const handlePlaceTypeClick = (type) => {
    setSelectedPlaceType(type);
    filterEvents(type);
  };

  // 대기질에 따른 추천 메시지 로직
  const getRecommendationMessage = () => {
    const pm10Value = weatherData?.pm10 || 0;
    return pm10Value >= 81
      ? { text: '🌫️ 대기질 나쁨! 실내 활동을 권장해요', color: '#FFEBEE', textColor: '#D32F2F' }
      : { text: '☀️ 대기질 좋음! 야외 활동하기 딱 좋아요', color: '#E8F5E9', textColor: '#2E7D32' };
  };

  const recommendation = getRecommendationMessage();

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Header currentLocation={guName} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← 뒤로 가기</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>장소 유형별 추천</Text>

        {/* 대기질 정보 카드 */}
        <View style={styles.airQualityCard}>
          <Text style={styles.cardTitle}>현재 대기질 상태</Text>
          <View style={styles.airRow}>
            <Text style={styles.airLabel}>미세먼지</Text>
            <Text style={styles.airValue}>{weatherData?.pm10} µg/m²</Text>
          </View>
          <View style={[styles.banner, { backgroundColor: recommendation.color }]}>
            <Text style={[styles.bannerText, { color: recommendation.textColor }]}>{recommendation.text}</Text>
          </View>
        </View>

        {/* 탭 버튼 */}
        <View style={styles.tabContainer}>
          {['all', 'indoor', 'outdoor'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.tabBtn, selectedPlaceType === type && styles.tabBtnActive]}
              onPress={() => handlePlaceTypeClick(type)}
            >
              <Text style={[styles.tabBtnText, selectedPlaceType === type && styles.tabBtnTextActive]}>
                {type === 'all' ? '전체' : type === 'indoor' ? '🏠 실내' : '☀️ 실외'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 이벤트 리스트 */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>추천 행사 ({events.length})</Text>
          {events.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventBadge}>
                <Text style={styles.eventBadgeText}>{event.category}</Text>
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDetail}>📍 {event.location}</Text>
              <Text style={styles.eventDetail}>📅 {event.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  backButton: { marginBottom: 15 },
  backButtonText: { color: '#667eea', fontSize: 16 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  airQualityCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 2, marginBottom: 20 },
  cardTitle: { fontSize: 14, color: '#888', marginBottom: 10 },
  airRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  airLabel: { fontSize: 16, color: '#444' },
  airValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  banner: { padding: 12, borderRadius: 8, alignItems: 'center' },
  bannerText: { fontWeight: 'bold', fontSize: 14 },
  tabContainer: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  tabBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#eee', alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#667eea' },
  tabBtnText: { color: '#666', fontWeight: '500' },
  tabBtnTextActive: { color: '#fff' },
  listSection: { gap: 15 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  eventCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderLeftWidth: 5, borderLeftColor: '#667eea', elevation: 1 },
  eventBadge: { backgroundColor: '#f0f2ff', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 8 },
  eventBadgeText: { fontSize: 12, color: '#667eea', fontWeight: 'bold' },
  eventTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  eventDetail: { fontSize: 14, color: '#666', marginBottom: 2 }
});

export default PlaceTypeEvents;
