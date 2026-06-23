import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📋</Text>
      <Text style={styles.title}>No tasks yet</Text>
      <Text style={styles.subtitle}>
        Press the + button to add your first task
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', color: '#1a1a2e', marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});