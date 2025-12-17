import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

function EventCard({ event, onPress }) {
  if (!event) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '미정';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const image = event.main_image || event.image || 'https://via.placeholder.com/600x400?text=No+Image';
  const category = event.category || '기타';
  const isIndoor = event.type_info === '실내';
  const title = event.event_name || event.title || '제목 없음';
  const location = event.place || event.location || '장소 미정';
  const district = event.district || '';
  const startDate = formatDate(event.start_date || event.date);
  const endDate = formatDate(event.end_date);
  const distance = event.distance;

  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      <View style={styles.eventImageWrapper}>
        <Image 
          source={{ uri: image }} 
          style={styles.eventImage}
          resizeMode="cover"
        />
        <View style={styles.eventBadges}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{category}</Text>
          </View>
          <View style={[styles.indoorBadge, isIndoor ? styles.indoor : styles.outdoor]}>
            <Text style={styles.indoorBadgeText}>
              {isIndoor ? '🏠 실내' : '🌳 실외'}
            </Text>
          </View>
          {distance && (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceBadgeText}>{distance}km</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{title}</Text>
        
        <View style={styles.eventInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>
              {location}{district ? ` (${district})` : ''}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>
              {startDate}{endDate && endDate !== startDate ? ` ~ ${endDate}` : ''}
            </Text>
          </View>
          {event.organizer && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👤</Text>
              <Text style={styles.infoText}>주최: {event.organizer}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  indoorBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indoor: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  outdoor: {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
  },
  indoorBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventDetails: {
    padding: 16,
    gap: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  distance: {
    marginTop: 4,
  },
  distanceBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default EventCard;
