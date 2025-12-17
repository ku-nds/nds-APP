import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import WeatherCard from './WeatherCard';

function WeatherSection({ location, pm10, pm2_5, o3, airQuality, airQualityColor }) {
  return (
    <View style={styles.weatherSection}>
      <View style={styles.locationHeader}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationDetails}>
            <Text style={styles.locationName}>{location}</Text>
            <Text style={styles.locationStatus}>현재 위치</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weatherCards}
      >
        <WeatherCard 
          icon="🌫️"
          value={pm10}
          label="미세먼지"
          bgColor="#FFF3F3"
          iconColor="#D32F2F"
        />
        <WeatherCard 
          icon="☁️"
          value={pm2_5}
          label="초미세먼지"
          bgColor="#FFF3F3"
          iconColor="#F57C00"
        />
        <WeatherCard 
          icon="⚡"
          value={o3 ? o3.toFixed(3) : '0.000'}
          label="오존"
          bgColor="#E1F5FE"
          iconColor="#00BCD4"
        />
        <WeatherCard 
          icon="🍃"
          value={airQuality}
          label="대기질"
          bgColor="#FFF3F3"
          iconColor={airQualityColor || "#43A047"}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherSection: {
    padding: 16,
    backgroundColor: '#fff',
    gap: 16,
  },
  locationHeader: {
    gap: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationIcon: {
    fontSize: 20,
  },
  locationDetails: {
    gap: 2,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationStatus: {
    fontSize: 12,
    color: '#666',
  },
  weatherCards: {
    gap: 12,
    paddingRight: 16,
  },
});

export default WeatherSection;
