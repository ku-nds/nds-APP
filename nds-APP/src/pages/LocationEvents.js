import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function LocationEvents() {
  const route = useRoute();
  const navigation = useNavigation();

  // 좌표 데이터 (에러 방지용 기본값)
  const latitude = route.params?.latitude || 37.5407;
  const longitude = route.params?.longitude || 127.0702;
  const guName = route.params?.guName || '서울특별시 광진구';

  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // 주변 가짜 행사 데이터
  const mockNearbyEvents = [
    { id: 1, title: '건대 커먼그라운드 플리마켓', location: '커먼그라운드 정문', date: '2025.03.22', dist: '350m' },
    { id: 2, title: '어린이대공원 야외 음악회', location: '능동 숲속의 무대', date: '2025.03.25', dist: '800m' },
    { id: 3, title: '뚝섬 한강공원 봄꽃 걷기', location: '뚝섬 유원지 일대', date: '2025.03.28', dist: '1.2km' },
    { id: 4, title: '자양동 골목 축제', location: '자양 전통시장', date: '2025.03.30', dist: '1.5km' },
  ];

  useEffect(() => {
    // 0.5초 로딩 후 데이터 세팅
    setTimeout(() => {
      setEvents(mockNearbyEvents);
      setIsFetching(false);
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <Header currentLocation={guName} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← 뒤로 가기</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>내 주변 행사 추천</Text>

        {/* 🗺️ 실제 지도(MapView) 대신 가짜 지도 이미지를 사용합니다. */}
        <View style={styles.mapPlaceholder}>
          <Image
            source={{ uri: 'https://via.placeholder.com/600x300/e3f2fd/667eea?text=Map+View+Simulation' }}
            style={styles.fakeMapImage}
          />
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>📍 현재 {guName} 주변을 탐색 중입니다</Text>
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>가까운 순 행사 ({events.length})</Text>
          {isFetching ? (
            <ActivityIndicator size="large" color="#667eea" style={{ marginTop: 20 }} />
          ) : (
            events.map(event => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
              >
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDetail}>📍 {event.location}</Text>
                  <Text style={styles.eventDetail}>📅 {event.date}</Text>
                </View>
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>{event.dist}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  backButton: { marginBottom: 15 },
  backButtonText: { color: '#667eea', fontSize: 16, fontWeight: '500' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },

  // 가짜 지도 스타일
  mapPlaceholder: {
    height: 200,
    borderRadius: 15,
    backgroundColor: '#e3f2fd',
    overflow: 'hidden',
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1e3ff'
  },
  fakeMapImage: { width: '100%', height: '100%', position: 'absolute' },
  mapOverlay: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  mapOverlayText: { color: '#667eea', fontWeight: 'bold', fontSize: 13 },

  listSection: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#444', marginBottom: 8 },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  eventDetail: { fontSize: 13, color: '#777', marginBottom: 2 },
  distanceBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  distanceText: { fontSize: 12, color: '#2e7d32', fontWeight: 'bold' }
});

export default LocationEvents;
