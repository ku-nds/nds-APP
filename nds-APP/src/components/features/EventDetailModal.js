import React from 'react';
import { Modal, View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';

const EventDetailModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const formatKoreanDate = (dateStr) => {
    if (!dateStr) return '미정';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      })
      .replace(/\./g, '')
      .replace(/월/, '월 ')
      .replace(/일/, '일 ');
    } catch {
      return dateStr;
    }
  };

  const handleLinkPress = async (url) => {
    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.modalHero}>
              <Image
                source={{ uri: event.main_image || 'https://via.placeholder.com/1200x600?text=No+Image' }}
                style={styles.modalHeroImg}
                resizeMode="cover"
              />
              <View style={styles.modalTopTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{event.category}</Text>
                </View>
                <View style={[styles.tag, event.type_info === '실내' ? styles.indoor : styles.outdoor]}>
                  <Text style={styles.tagText}>{event.type_info || '일반'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{event.event_name}</Text>

              <View style={styles.modalRow}>
                <Text style={styles.modalIcon}>📍</Text>
                <View style={styles.modalRowContent}>
                  <Text style={styles.modalLabel}>장소</Text>
                  <Text style={styles.modalValue}>{event.place || '미정'}</Text>
                </View>
              </View>

              <View style={styles.modalRow}>
                <Text style={styles.modalIcon}>📅</Text>
                <View style={styles.modalRowContent}>
                  <Text style={styles.modalLabel}>일시</Text>
                  <Text style={styles.modalValue}>
                    {formatKoreanDate(event.start_date)}
                    {event.end_date && event.end_date !== event.start_date && ` ~ ${formatKoreanDate(event.end_date)}`}
                  </Text>
                </View>
              </View>

              {event.time && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalIcon}>🕐</Text>
                  <View style={styles.modalRowContent}>
                    <Text style={styles.modalLabel}>시간</Text>
                    <Text style={styles.modalValue}>{event.time}</Text>
                  </View>
                </View>
              )}

              {event.fee && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalIcon}>💰</Text>
                  <View style={styles.modalRowContent}>
                    <Text style={styles.modalLabel}>요금</Text>
                    <Text style={styles.modalValue}>{event.fee}</Text>
                  </View>
                </View>
              )}

              {event.description && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>상세 정보</Text>
                  <Text style={styles.modalDescription}>{event.description}</Text>
                </View>
              )}

              {event.homepage && (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => handleLinkPress(event.homepage)}
                >
                  <Text style={styles.linkButtonText}>홈페이지 보기</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  scrollView: {
    flex: 1,
  },
  modalHero: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  modalHeroImg: {
    width: '100%',
    height: '100%',
  },
  modalTopTags: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  indoor: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  outdoor: {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
    gap: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  modalIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  modalRowContent: {
    flex: 1,
    gap: 4,
  },
  modalLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 16,
    color: '#333',
  },
  modalSection: {
    marginTop: 8,
    gap: 8,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  linkButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#667eea',
    borderRadius: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailModal;
