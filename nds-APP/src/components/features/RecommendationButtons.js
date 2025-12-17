import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function RecommendationButtons({ weatherData, guName, latitude, longitude, region, gu }) {
  const navigation = useNavigation();

  const handleCardClick = (type) => {
    navigation.navigate(type === 'place-type' ? 'PlaceEvents' : type === 'location' ? 'LocationEvents' : 'CategoryEvents', {
      latitude,
      longitude,
      guName,
      weatherData,
      region,
      gu,
    });
  };

  return (
    <View style={styles.recommendationButtonsSection}>
      <Text style={styles.sectionTitle}>행사 추천 필터</Text>
      <View style={styles.recommendationCards}>
        <TouchableOpacity 
          style={[styles.recommendationCard, styles.blue]} 
          onPress={() => handleCardClick('place-type')}
        >
          <Text style={styles.cardIcon}>🏛️</Text>
          <Text style={styles.cardTitle}>장소 유형</Text>
          <Text style={styles.cardDescription}>날씨에 따른 실내/실외 행사 추천</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.recommendationCard, styles.green]} 
          onPress={() => handleCardClick('location')}
        >
          <Text style={styles.cardIcon}>📍</Text>
          <Text style={styles.cardTitle}>위치 기반</Text>
          <Text style={styles.cardDescription}>3km 내 가까운 행사 추천</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.recommendationCard, styles.purple]} 
          onPress={() => handleCardClick('category')}
        >
          <Text style={styles.cardIcon}>📚</Text>
          <Text style={styles.cardTitle}>행사 카테고리</Text>
          <Text style={styles.cardDescription}>관심 분야별 맞춤 추천</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recommendationButtonsSection: {
    padding: 16,
    backgroundColor: '#fff',
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  recommendationCards: {
    gap: 12,
  },
  recommendationCard: {
    padding: 20,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blue: {
    backgroundColor: '#E3F2FD',
  },
  green: {
    backgroundColor: '#E8F5E9',
  },
  purple: {
    backgroundColor: '#F3E5F5',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecommendationButtons;
