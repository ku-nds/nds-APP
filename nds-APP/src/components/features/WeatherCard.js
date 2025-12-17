import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function WeatherCard({ icon, value, label, bgColor, iconColor }) {
  return (
    <View style={[styles.weatherCard, { backgroundColor: bgColor }]}>
      <Text style={[styles.weatherIcon, { color: iconColor }]}>
        {icon}
      </Text>
      <View style={styles.weatherContent}>
        <Text style={styles.weatherValue}>{value}</Text>
        <Text style={styles.weatherLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    minHeight: 70,
  },
  weatherIcon: {
    fontSize: 28,
  },
  weatherContent: {
    flex: 1,
    gap: 4,
  },
  weatherValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default WeatherCard;
