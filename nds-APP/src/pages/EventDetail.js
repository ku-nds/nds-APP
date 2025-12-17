import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

function EventDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  // 이전 페이지에서 ID를 못 받았을 경우를 대비해 기본값 설정
  const { eventId } = route.params || { eventId: 'default_id' };

  const [event, setEvent] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEventDetail();
  }, [eventId]);

  const fetchEventDetail = async () => {
    try {
      setIsLoading(true);

      // 1. 실제 API 대신 0.5초 뒤에 가짜 데이터를 세팅합니다.
      setTimeout(() => {
        // 가짜 행사 상세 데이터
        const mockEvent = {
          id: eventId,
          title: "2025 광진 가을 음악 축제",
          category: "공연/음악",
          location: "어린이대공원 야외음악당",
          date: "2025.10.15 - 2025.10.17",
          time: "18:30 ~ 21:00",
          price: "무료 (사전 예약 필수)",
          isIndoor: false,
          description: "깊어가는 가을 밤, 광진구민과 함께하는 클래식과 재즈의 향연에 여러분을 초대합니다. 국내 정상급 아티스트들이 선보이는 수준 높은 공연을 즐겨보세요. 미세먼지 수치가 낮은 쾌적한 야외에서 진행될 예정입니다.",
          contact: "광진문화재단 (02-450-1234)",
          image: "https://via.placeholder.com/800x600/667eea/ffffff?text=Festival+Poster",
          latitude: 37.5495,
          longitude: 127.0815,
        };

        // 2. 가짜 주변 편의시설 데이터
        const mockFacilities = [
          { name: "어린이대공원역 공영주차장", type: "주차장", distance: 150 },
          { name: "세븐일레븐 건대점", type: "편의점", distance: 300 },
          { name: "화양동 카페거리", type: "카페/음식점", distance: 450 },
          { name: "광진구민체육센터 화장실", type: "공공화장실", distance: 100 },
        ];

        setEvent(mockEvent);
        setFacilities(mockFacilities);
        setIsLoading(false);
      }, 500);

    } catch (error) {
      console.error('행사 상세 정보 조회 실패:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.loadingText}>정보를 불러오고 있습니다...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>행사 정보를 찾을 수 없습니다.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{color: '#667eea', marginTop: 20}}>뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 오버레이 */}
      <TouchableOpacity
        style={styles.floatingBackBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 메인 포스터 */}
        {event.image && (
          <Image
            source={{ uri: event.image }}
            style={styles.poster}
            resizeMode="cover"
          />
        )}

        {/* 행사 상세 정보 */}
        <View style={styles.detailSection}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>카테고리</Text>
            <Text style={styles.infoValue}>{event.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>장소</Text>
            <Text style={styles.infoValue}>{event.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>날짜</Text>
            <Text style={styles.infoValue}>{event.date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>시간</Text>
            <Text style={styles.infoValue}>{event.time}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>가격</Text>
            <Text style={styles.infoValue}>{event.price}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>장소 유형</Text>
            <Text style={styles.infoValue}>{event.isIndoor ? '🏠 실내' : '☀️ 실외'}</Text>
          </View>

          {event.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>상세 설명</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          <View style={[styles.infoRow, { marginTop: 20 }]}>
            <Text style={styles.infoLabel}>문의</Text>
            <Text style={styles.infoValue}>{event.contact}</Text>
          </View>
        </View>

        {/* 주변 편의시설 섹션 */}
        {facilities.length > 0 && (
          <View style={styles.facilitiesSection}>
            <Text style={styles.sectionTitle}>📍 주변 편의시설</Text>
            <Text style={styles.sectionSubtitle}>행사장 근처에서 이용 가능해요</Text>
            {facilities.map((facility, index) => (
              <View key={index} style={styles.facilityCard}>
                <View style={{flex: 1}}>
                  <Text style={styles.facilityName}>{facility.name}</Text>
                  <Text style={styles.facilityType}>{facility.type}</Text>
                </View>
                {facility.distance && (
                  <View style={styles.distBadge}>
                    <Text style={styles.facilityDistance}>{facility.distance}m</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { paddingBottom: 40 },
  centerContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#f44336' },
  floatingBackBtn: {
    position: 'absolute', top: 50, left: 20, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)', width: 40, height: 40,
    borderRadius: 20, justifyContent: 'center', alignItems: 'center'
  },
  backBtnText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  poster: { width: width, height: width * 0.8, backgroundColor: '#e0e0e0' },
  detailSection: { backgroundColor: '#fff', padding: 20, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 20 },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  infoLabel: { fontSize: 14, color: '#888', width: 70 },
  infoValue: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  descriptionContainer: { marginTop: 15, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  descriptionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  description: { fontSize: 15, color: '#555', lineHeight: 24 },
  facilitiesSection: { backgroundColor: '#fff', padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  sectionSubtitle: { fontSize: 13, color: '#999', marginBottom: 15 },
  facilityCard: {
    flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 15,
    borderRadius: 12, marginBottom: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#eee'
  },
  facilityName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  facilityType: { fontSize: 13, color: '#666', marginTop: 2 },
  distBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  facilityDistance: { fontSize: 12, color: '#2e7d32', fontWeight: 'bold' },
});

export default EventDetail;

