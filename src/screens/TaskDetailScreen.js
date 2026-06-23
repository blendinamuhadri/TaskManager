import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export default function TaskDetailScreen({ route }) {
  const { task } = route.params;
  const isCompleted = task.status === 'completed';

  const formattedDate = new Date(task.createdAt).toLocaleDateString('sq-AL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.badge, isCompleted ? styles.badgeDone : styles.badgeActive]}>
          <Text style={[styles.badgeText, isCompleted ? styles.badgeTextDone : styles.badgeTextActive]}>
            {isCompleted ? '✓ Përfunduar' : '● Aktive'}
          </Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Përshkrimi</Text>
        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.dateRow}>
          <Text style={styles.dateIcon}>📅</Text>
          <View>
            <Text style={styles.dateLabel}>Data e krijimit</Text>
            <Text style={styles.dateValue}>{formattedDate}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f8' },
  content: { padding: 24 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  badgeActive: { backgroundColor: '#fff3e0' },
  badgeDone: { backgroundColor: '#e8f5e9' },
  badgeText: { fontSize: 13, fontWeight: '600' },
  badgeTextActive: { color: '#e67e22' },
  badgeTextDone: { color: '#27ae60' },
  title: { fontSize: 26, fontWeight: '700', color: '#1a1a2e', lineHeight: 34, marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  description: { fontSize: 15, color: '#444', lineHeight: 24, marginBottom: 30 },
  dateRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, gap: 14 },
  dateIcon: { fontSize: 28 },
  dateLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  dateValue: { fontSize: 14, fontWeight: '600', color: '#333' },
});