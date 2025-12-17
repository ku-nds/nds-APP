import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Footer() {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerContent}>
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>데이터 출처</Text>
          <Text style={styles.footerText}>서울시 공공데이터포털</Text>
        </View>
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>최종 업데이트</Text>
          <Text style={styles.footerText}>2025년 10월 27일</Text>
        </View>
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>클라우드 웹 서비스 8팀</Text>
          <Text style={styles.footerText}>010-5466-9471</Text>
        </View>
      </View>
      <View style={styles.footerBottom}>
        <Text style={styles.footerBottomText}>&copy; 2025 서울 스마트시티. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerContent: {
    gap: 16,
    marginBottom: 16,
  },
  footerSection: {
    gap: 4,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
    alignItems: 'center',
  },
  footerBottomText: {
    fontSize: 11,
    color: '#999',
  },
});

export default Footer;
