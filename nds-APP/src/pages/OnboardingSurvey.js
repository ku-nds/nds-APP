import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../context/AppContext';

function OnboardingSurvey() {
  const navigation = useNavigation();
  const { setUserPreferences } = useAppContext();
  
  const [preferences, setPreferences] = useState({
    placeType: null, // 'indoor', 'outdoor', 'both'
    maxDistance: 5, // km
    pricePreference: null, // 'free', 'all'
  });

  const handlePlaceTypeSelect = (type) => {
    setPreferences({ ...preferences, placeType: type });
  };

  const handlePricePreferenceSelect = (preference) => {
    setPreferences({ ...preferences, pricePreference: preference });
  };

  const handleDistanceChange = (distance) => {
    setPreferences({ ...preferences, maxDistance: distance });
  };

  const handleComplete = async () => {
    if (!preferences.placeType || !preferences.pricePreference) {
      alert('모든 항목을 선택해주세요.');
      return;
    }

    try {
      // AsyncStorage에 저장
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Context에 저장
      if (setUserPreferences) {
        setUserPreferences(preferences);
      }

      // 메인 화면으로 이동
      navigation.replace('MainPage');
    } catch (error) {
      console.error('선호 설정 저장 실패:', error);
      alert('설정 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>맞춤 추천을 위한 설정</Text>
        <Text style={styles.subtitle}>원하시는 옵션을 선택해주세요</Text>
      </View>

      {/* 1. 실내/실외 선택 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. 장소 유형</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              preferences.placeType === 'indoor' && styles.optionButtonSelected
            ]}
            onPress={() => handlePlaceTypeSelect('indoor')}
          >
            <Text style={[
              styles.optionText,
              preferences.placeType === 'indoor' && styles.optionTextSelected
            ]}>
              실내
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              preferences.placeType === 'outdoor' && styles.optionButtonSelected
            ]}
            onPress={() => handlePlaceTypeSelect('outdoor')}
          >
            <Text style={[
              styles.optionText,
              preferences.placeType === 'outdoor' && styles.optionTextSelected
            ]}>
              실외
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              preferences.placeType === 'both' && styles.optionButtonSelected
            ]}
            onPress={() => handlePlaceTypeSelect('both')}
          >
            <Text style={[
              styles.optionText,
              preferences.placeType === 'both' && styles.optionTextSelected
            ]}>
              상관없음
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. 최대 거리 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. 최대 거리 (km)</Text>
        <View style={styles.distanceContainer}>
          <TextInput
            style={styles.distanceInput}
            value={preferences.maxDistance.toString()}
            onChangeText={(text) => {
              const num = parseInt(text) || 0;
              if (num >= 0 && num <= 50) {
                handleDistanceChange(num);
              }
            }}
            keyboardType="numeric"
            placeholder="5"
          />
          <Text style={styles.distanceUnit}>km</Text>
        </View>
        <View style={styles.distanceButtons}>
          {[1, 3, 5, 10, 20].map((distance) => (
            <TouchableOpacity
              key={distance}
              style={[
                styles.distanceButton,
                preferences.maxDistance === distance && styles.distanceButtonSelected
              ]}
              onPress={() => handleDistanceChange(distance)}
            >
              <Text style={[
                styles.distanceButtonText,
                preferences.maxDistance === distance && styles.distanceButtonTextSelected
              ]}>
                {distance}km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3. 가격 선호도 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. 가격 선호도</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              preferences.pricePreference === 'free' && styles.optionButtonSelected
            ]}
            onPress={() => handlePricePreferenceSelect('free')}
          >
            <Text style={[
              styles.optionText,
              preferences.pricePreference === 'free' && styles.optionTextSelected
            ]}>
              무료 행사 선호
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              preferences.pricePreference === 'all' && styles.optionButtonSelected
            ]}
            onPress={() => handlePricePreferenceSelect('all')}
          >
            <Text style={[
              styles.optionText,
              preferences.pricePreference === 'all' && styles.optionTextSelected
            ]}>
              유료/무료 상관없음
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 완료 버튼 */}
      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 32,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
  },
  optionTextSelected: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  distanceUnit: {
    fontSize: 16,
    color: '#666',
  },
  distanceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  distanceButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  distanceButtonText: {
    fontSize: 14,
    color: '#666',
  },
  distanceButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingSurvey;

