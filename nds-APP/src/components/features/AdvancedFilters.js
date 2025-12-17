import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';

function AdvancedFilters({ isOpen, onClose, filters, onFilterChange, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleCategoryToggle = (category) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      categories: [],
      distance: 5,
      age: 'all',
      timeRange: 'all'
    });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  const categories = ['전시', '공연', '축제', '교육', '체험', '기타'];

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterHeaderTitle}>상세 필터</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>행사 카테고리</Text>
              <View style={styles.categoryGrid}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      localFilters.categories.includes(category) && styles.categoryChipActive
                    ]}
                    onPress={() => handleCategoryToggle(category)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      localFilters.categories.includes(category) && styles.categoryChipTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>거리 반경: {localFilters.distance}km</Text>
              <View style={styles.distanceButtons}>
                {[1, 3, 5, 10, 15, 20].map(dist => (
                  <TouchableOpacity
                    key={dist}
                    style={[
                      styles.distanceButton,
                      localFilters.distance === dist && styles.distanceButtonActive
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, distance: dist })}
                  >
                    <Text style={[
                      styles.distanceButtonText,
                      localFilters.distance === dist && styles.distanceButtonTextActive
                    ]}>
                      {dist}km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>시간대</Text>
              {[
                { value: 'all', label: '전체' },
                { value: 'morning', label: '오전 (09:00-12:00)' },
                { value: 'afternoon', label: '오후 (12:00-18:00)' },
                { value: 'evening', label: '저녁 (18:00-24:00)' }
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() => setLocalFilters({ ...localFilters, timeRange: option.value })}
                >
                  <View style={styles.radioCircle}>
                    {localFilters.timeRange === option.value && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>연령대</Text>
              {[
                { value: 'all', label: '전체' },
                { value: 'child', label: '어린이 (5-12세)' },
                { value: 'teen', label: '청소년 (13-19세)' },
                { value: 'adult', label: '성인 (20세 이상)' }
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() => setLocalFilters({ ...localFilters, age: option.value })}
                >
                  <View style={styles.radioCircle}>
                    {localFilters.age === option.value && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>적용하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 24,
    color: '#666',
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
    gap: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  distanceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  distanceButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  distanceButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  distanceButtonTextActive: {
    color: '#fff',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#667eea',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  filterActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AdvancedFilters;
