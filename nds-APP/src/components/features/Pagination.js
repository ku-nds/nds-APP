import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
  };

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  if (start > 1) pages.push(1);
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < totalPages) pages.push(totalPages);

  return (
    <View style={styles.paginationBar}>
      <TouchableOpacity
        style={[styles.pageButton, page <= 1 && styles.disabled]}
        onPress={() => go(page - 1)}
        disabled={page <= 1}
      >
        <Text style={[styles.pageButtonText, page <= 1 && styles.disabledText]}>이전</Text>
      </TouchableOpacity>
      {pages.map((p, idx) => (
        <TouchableOpacity
          key={`${p}-${idx}`}
          style={[styles.pageButton, p === page && styles.active]}
          onPress={() => go(p)}
        >
          <Text style={[styles.pageButtonText, p === page && styles.activeText]}>
            {p}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.pageButton, page >= totalPages && styles.disabled]}
        onPress={() => go(page + 1)}
        disabled={page >= totalPages}
      >
        <Text style={[styles.pageButtonText, page >= totalPages && styles.disabledText]}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  paginationBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: '#667eea',
  },
  disabled: {
    opacity: 0.5,
  },
  pageButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
  },
  disabledText: {
    color: '#999',
  },
});

export default Pagination;
