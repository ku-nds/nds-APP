import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function FestivalSearch() {
  const navigation = useNavigation();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [festivals, setFestivals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 검색 시 보여줄 가짜 축제 데이터 목록
  const mockFestivals = [
    {
      id: 1,
      title: '2025 석촌호수 벚꽃축제',
      date: '2025.04.05 - 04.12',
      location: '송파구 석촌호수 일대',
      category: '축제/벚꽃',
      imageUrl: 'https://via.placeholder.com/100', // 실제 이미지 대신 플레이스홀더
    },
    {
      id: 2,
      title: '광진구 어린이날 동화축제',
      date: '2025.05.04 - 05.06',
      location: '어린이대공원',
      category: '가족/어린이',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: 3,
      title: '한강 달빛 야시장',
      date: '2025.06.01 - 08.31',
      location: '반포한강공원',
      category: '음식/마켓',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: 4,
      title: '서울 재즈 페스티벌 2025',
      date: '2025.05.24 - 05.26',
      location: '올림픽공원',
      category: '음악/공연',
      imageUrl: 'https://via.placeholder.com/100',
    },
  ];

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // 0.5초 뒤에 가짜 데이터 로드 (실제 검색하는 느낌)
    setTimeout(() => {
      // 키워드가 포함된 것만 필터링하는 척 하기
      const filtered = mockFestivals.filter(f => f.title.includes(searchKeyword) || searchKeyword.length < 2);
      setFestivals(filtered.length > 0 ? filtered : mockFestivals); // 검색 결과 없으면 전체 보여주기
      setIsLoading(false);
    }, 500);
  };

  // EventCard를 직접 구현 (컴포넌트 파일 에러 방지용)
  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>📅 {item.date}</Text>
        <Text style={styles.cardLocation}>📍 {item.location}</Text>
      </View>
      <View style={styles.imagePlaceholder}>
        <Text style={{color: '#ccc', fontSize: 10}}>Image</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>축제 검색</Text>
        <Text style={styles.headerSubtitle}>원하는 축제를 검색해보세요 (Demo)</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          placeholder="축제 이름 (예: 벚꽃, 한강)"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
        </View>
      ) : hasSearched ? (
        <FlatList
          data={festivals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>전국 방방곡곡의 축제를 찾아보세요!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#fff', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  searchContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', gap: 10 },
  searchInput: { flex: 1, backgroundColor: '#f1f3f5', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16 },
  searchButton: { backgroundColor: '#2196F3', borderRadius: 8, paddingHorizontal: 20, justifyContent: 'center' },
  searchButtonText: { color: '#fff', fontWeight: 'bold' },
  listContent: { padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { color: '#666' },
  placeholderText: { color: '#adb5bd', fontSize: 16 },

  // 가짜 카드 스타일
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, flexDirection: 'row', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width:0, height:2} },
  cardInfo: { flex: 1 },
  cardCategory: { color: '#2196F3', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  cardDate: { fontSize: 13, color: '#666', marginBottom: 2 },
  cardLocation: { fontSize: 13, color: '#666' },
  imagePlaceholder: { width: 80, height: 80, backgroundColor: '#f1f3f5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginLeft: 12 }
});

export default FestivalSearch;

