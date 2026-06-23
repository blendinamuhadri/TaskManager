import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function TaskItem({ task, onToggle, onDelete, onPress }) {
  const isCompleted = task.status === 'completed';

  return (
    <View style={styles.card}>
      <Pressable
        style={[styles.checkbox, isCompleted && styles.checkboxDone]}
        onPress={onToggle}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>

      <Pressable style={styles.info} onPress={onPress}>
        <Text style={[styles.title, isCompleted && styles.titleDone]}>
          {task.title}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {task.description}
        </Text>
        <Text style={styles.date}>
          {new Date(task.createdAt).toLocaleDateString()}
        </Text>
      </Pressable>

      <Pressable style={styles.deleteBtn} onPress={onDelete}>
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: '#6C63FF',
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 2 },
  titleDone: { textDecorationLine: 'line-through', color: '#999' },
  desc: { fontSize: 12, color: '#888', marginBottom: 4 },
  date: { fontSize: 11, color: '#bbb' },
  deleteBtn: { padding: 6 },
  deleteText: { fontSize: 16, color: '#ccc' },
});