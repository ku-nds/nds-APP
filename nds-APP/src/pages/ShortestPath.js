import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 400;

function ShortestPath() {
  const navigation = useNavigation();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const dummyEvents = [
    { id: 1, title: '건대 커먼그라운드', x: 20, y: 70 },
    { id: 2, title: '어린이대공원', x: 75, y: 20 },
    { id: 3, title: '뚝섬 한강공원', x: 45, y: 85 },
    { id: 4, title: '성수 문화창고', x: 15, y: 40 },
    { id: 5, title: '광진구민 센터', x: 80, y: 60 },
  ];

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
      setShowResult(false);
    } else {
      if (selectedIds.length >= 3) return;
      setSelectedIds([...selectedIds, id]);
    }
  };

  // 화살표 선 그리기 컴포넌트
  const DrawArrow = ({ start, end }) => {
    const x1 = (start.x * width) / 100;
    const y1 = (start.y * MAP_HEIGHT) / 100;
    const x2 = (end.x * width) / 100;
    const y2 = (end.y * MAP_HEIGHT) / 100;

    const distance = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    return (
      <View style={[styles.lineWrapper, {
        width: distance,
        left: x1,
        top: y1,
        transform: [{ rotate: `${angle}deg` }]
      }]}>
        <View style={styles.yellowLine} />
        <View style={styles.arrowHead} />
      </View>
    );
  };

  // 선택된 행사 객체들을 순서대로 가져옴
  const selectedEvents = selectedIds.map(id => dummyEvents.find(e => e.id === id));

  return (
    <View style={styles.container}>
      <Header currentLocation="경로 탐색" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← 돌아가기</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>최단 경로 분석 결과</Text>
        <Text style={styles.subTitle}>선택한 3개 지점을 잇는 가장 효율적인 동선입니다.</Text>

        <View style={styles.chipGroup}>
          {dummyEvents.map(ev => (
            <TouchableOpacity
              key={ev.id}
              style={[styles.chip, selectedIds.includes(ev.id) && styles.activeChip]}
              onPress={() => toggleSelect(ev.id)}
            >
              <Text style={[styles.chipText, selectedIds.includes(ev.id) && {color:'#fff'}]}>{ev.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.mainBtn}
          onPress={() => selectedIds.length === 3 ? setShowResult(true) : Alert.alert("행사 3개를 골라주세요!")}
        >
          <Text style={styles.mainBtnText}>TSP 알고리즘 경로 시뮬레이션</Text>
        </TouchableOpacity>

        {showResult && (
          <>
            <View style={styles.mapFrame}>
              <Image
                source={require('../assets/seoul_map.png')}
                style={styles.mapImage}
                resizeMode="cover"
              />

              {/* 화살표: 1->2, 2->3 */}
              <DrawArrow start={selectedEvents[0]} end={selectedEvents[1]} />
              <DrawArrow start={selectedEvents[1]} end={selectedEvents[2]} />

              {/* 마커 및 이름표 */}
              {selectedEvents.map((ev, index) => (
                <View key={ev.id} style={[styles.markerContainer, { left: `${ev.x}%`, top: `${ev.y}%` }]}>
                  <View style={styles.markerCircle}>
                    <Text style={styles.markerNum}>{index + 1}</Text>
                  </View>
                  <View style={styles.markerLabel}>
                    <Text style={styles.markerLabelText}>{ev.title}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* 📝 하단 결과 텍스트 영역 */}
            <View style={styles.resultTextBox}>
              <Text style={styles.resultBoxTitle}>📊 최적 이동 순서</Text>
              {selectedEvents.map((ev, index) => (
                <View key={ev.id} style={styles.routeRow}>
                  <View style={styles.stepNum}><Text style={styles.stepNumText}>{index + 1}</Text></View>
                  <Text style={styles.routeEventName}>{ev.title}</Text>
                  {index < 2 && <Text style={styles.routeArrow}>▼</Text>}
                </View>
              ))}
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryText}>총 이동거리: <Text style={styles.bold}>약 4.2km</Text></Text>
                <Text style={styles.summaryText}>예상 소요시간: <Text style={styles.bold}>48분</Text></Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  backBtn: { marginBottom: 10 },
  backBtnText: { color: '#667eea', fontWeight: 'bold' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subTitle: { fontSize: 13, color: '#888', marginTop: 5 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 20 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  activeChip: { backgroundColor: '#667eea', borderColor: '#667eea' },
  chipText: { fontSize: 13, color: '#444' },
  mainBtn: { backgroundColor: '#333', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  mainBtnText: { color: '#fff', fontWeight: 'bold' },

  // 지도 프레임
  mapFrame: { width: '100%', height: MAP_HEIGHT, borderRadius: 15, overflow: 'hidden', position: 'relative', backgroundColor: '#e0e0e0', elevation: 5 },
  mapImage: { width: '100%', height: '100%', position: 'absolute', opacity: 0.8 },

  // 화살표 스타일
  lineWrapper: { position: 'absolute', height: 6, justifyContent: 'center', zIndex: 5, transformOrigin: 'left' },
  yellowLine: { width: '100%', height: 4, backgroundColor: '#FFD700', borderRadius: 2, borderWidth: 1, borderColor: '#DAA520' },
  arrowHead: {
    position: 'absolute', right: -6, width: 0, height: 0,
    borderTopWidth: 8, borderTopColor: 'transparent',
    borderBottomWidth: 8, borderBottomColor: 'transparent',
    borderLeftWidth: 12, borderLeftColor: '#FFD700'
  },

  // 마커 및 텍스트 레이블
  markerContainer: { position: 'absolute', zIndex: 10, alignItems: 'center', marginLeft: -15, marginTop: -15 },
  markerCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ff5252', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  markerNum: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  markerLabel: { marginTop: 4, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  markerLabelText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  // 하단 결과 텍스트 영역
  resultTextBox: { marginTop: 25, backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3 },
  resultBoxTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  routeRow: { alignItems: 'center', marginBottom: 10 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  stepNumText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  routeEventName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  routeArrow: { color: '#ccc', marginVertical: 5 },
  summaryInfo: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15, flexDirection: 'row', justifyContent: 'space-around' },
  summaryText: { fontSize: 14, color: '#666' },
  bold: { fontWeight: 'bold', color: '#667eea' }
});

export default ShortestPath;