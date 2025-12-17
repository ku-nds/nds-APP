import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAppContext } from '../context/AppContext';

function CategoryEvents() {
  const navigation = useNavigation();
  const { position: globalPosition } = useAppContext();
  const guName = globalPosition?.guName || '서울특별시 광진구';

  const [category, setCategory] = useState('전체');
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const categories = useMemo(() => [
    '전체', '클래식', '뮤지컬/오페라', '축제-문화/예술', '전시/미술', '교육/체험', '기타'
  ], []);

  // 가짜 통합 데이터베이스
  const mockDatabase = [
    { id: 1, title: '베토벤 교향곡의 밤', category: '클래식', location: '예술의 전당', date: '2025.03.20' },
    { id: 2, title: '지킬 앤 하이드', category: '뮤지컬/오페라', location: '샤롯데씨어터', date: '2025.03.25' },
    { id: 3, title: '서울 미디어 아트전', category: '전시/미술', location: 'DDP', date: '2025.04.01' },
    { id: 4, title: '어린이 창의력 캠프', category: '교육/체험', location: '광진청소년센터', date: '2025.05.05' },
    { id: 5, title: '한강 K-POP 페스티벌', category: '축제-문화/예술', location: '뚝섬한강공원', date: '2025.06.12' },
    { id: 6, title: '모차르트 레퀴엠', category: '클래식', location: '세종문화회관', date: '2025.03.28' },
    { id: 7, title: '반 고흐 몰입형 전시', category: '전시/미술', location: '성수동 에스팩토리', date: '2025.04.15' },
  ];

  useEffect(() => {
    filterEvents('전체');
  }, []);

  const filterEvents = (selected) => {
    setIsFetching(true);
    setCategory(selected);

    // 0.3초 뒤에 필터링 (부드러운 전환 효과)
    setTimeout(() => {
      if (selected === '전체') {
        setEvents(mockDatabase);
      } else {
        const filtered = mockDatabase.filter(e => e.category === selected);
        setEvents(filtered);
      }
      setIsFetching(false);
    }, 300);
  };

  return (
    <View style={styles.container}>
      <Header currentLocation={guName} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← 뒤로 가기</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>카테고리별 추천</Text>

        {/* 카테고리 칩 선택 영역 */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>장르를 선택하세요</Text>
          <View style={styles.categoryButtons}>
            {categories.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.categoryBtn, category === c && styles.categoryBtnActive]}
                onPress={() => filterEvents(c)}
              >
                <Text style={[styles.categoryBtnText, category === c && styles.categoryBtnTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 결과 리스트 */}
        <View style={styles.listSection}>
          {isFetching ? (
            <ActivityIndicator size="large" color="#667eea" style={{ marginTop: 50 }} />
          ) : (
            <>
              <Text style={styles.listCount}>총 {events.length}건의 행사</Text>
              {events.length > 0 ? (
                events.map(event => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCard}
                    onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                  >
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{event.category}</Text>
                    </View>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventInfo}>📍 {event.location}</Text>
                    <Text style={styles.eventInfo}>📅 {event.date}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>해당 카테고리에 행사가 없습니다.</Text>
                </View>
              )}
            </>
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
  categorySection: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, color: '#666', marginBottom: 12, fontWeight: '600' },
  categoryButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  categoryBtnActive: { backgroundColor: '#667eea', borderColor: '#667eea' },
  categoryBtnText: { fontSize: 13, color: '#666' },
  categoryBtnTextActive: { color: '#fff', fontWeight: 'bold' },
  listSection: { flex: 1 },
  listCount: { fontSize: 14, color: '#888', marginBottom: 15 },
  eventCard: { backgroundColor: '#fff', padding: 16, borderRadius: 15, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  categoryTag: { backgroundColor: '#f0f2ff', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, marginBottom: 8 },
  categoryTagText: { fontSize: 11, color: '#667eea', fontWeight: 'bold' },
  eventTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  eventInfo: { fontSize: 13, color: '#777', marginBottom: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#bbb', fontSize: 16 }
});

export default CategoryEvents;
