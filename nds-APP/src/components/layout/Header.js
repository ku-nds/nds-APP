import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Header({ onUserMenuClick, onNotificationClick, onSettingsClick, currentLocation }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <View style={styles.logoSection}>
          <Text style={styles.logoIcon}>🏛️</Text>
          <View style={styles.logoText}>
            <Text style={styles.mainTitle}>서울 스마트시티</Text>
            <Text style={styles.subTitle}>문화행사 큐레이션</Text>
          </View>
        </View>
        
        {currentLocation && (
          <View style={styles.locationBadge}>
            <Text style={styles.locationBadgeIcon}>📍</Text>
            <Text style={styles.locationBadgeText}>{currentLocation}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    gap: 2,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subTitle: {
    fontSize: 12,
    color: '#666',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  locationBadgeIcon: {
    fontSize: 14,
  },
  locationBadgeText: {
    fontSize: 12,
    color: '#666',
  },
});

export default Header;
