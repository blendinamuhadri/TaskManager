import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Modal, StyleSheet, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { saveTasks, loadTasks } from '../utils/storage';
import TaskItem from '../components/TaskItem';
import EmptyState from '../components/EmptyState';
import { fetchSuggestedTasks } from '../utils/api';

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const saved = await loadTasks();
      setTasks(saved);
    };
    load();
  }, []);

  const saveAndSet = (updated) => {
    setTasks(updated);
    saveTasks(updated);
  };

  const addTask = (t, d) => {
    const newTask = {
      id: generateId(),
      title: t,
      description: d,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    saveAndSet([newTask, ...tasks]);
  };

  const deleteTask = (id) => {
    saveAndSet(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    saveAndSet(
      tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'active' : 'completed' }
          : t
      )
    );
  };

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === 'active') return t.status === 'active';
        if (filter === 'completed') return t.status === 'completed';
        return true;
      })
      .filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
  }, [tasks, filter, search]);

  const handleAdd = () => {
    let valid = true;
    if (!title.trim() || title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      valid = false;
    } else {
      setTitleError('');
    }
    if (!description.trim()) {
      setDescError('Description cannot be empty');
      valid = false;
    } else {
      setDescError('');
    }
    if (!valid) return;
    addTask(title.trim(), description.trim());
    setTitle('');
    setDescription('');
    setModalVisible(false);
  };

  const handleImport = async () => {
    setImporting(true);
    const apiTasks = await fetchSuggestedTasks();
    saveAndSet([...apiTasks, ...tasks]);
    setImporting(false);
    Alert.alert('Success!', '5 tasks imported from API!');
  };

  const handleDelete = (id) => {
  if (window.confirm('Are you sure you want to delete this task?')) {
    deleteTask(id);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSub}>{tasks.length} tasks in total</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.importBtn} onPress={handleImport} disabled={importing}>
            {importing
              ? <ActivityIndicator size="small" color="#6C63FF" />
              : <Text style={styles.importBtnText}>⬇ Import</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Tasks..."
          value={search}
          onChangeText={(text) => setSearch(text)}
          placeholderTextColor="#bbb"
        />
      </View>

      <View style={styles.filterRow}>
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'completed', label: 'Completed' },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0
          ? <EmptyState />
          : filtered.map((item) => (
            <TaskItem
              key={item.id}
              task={item}
              onToggle={() => toggleComplete(item.id)}
              onDelete={() => handleDelete(item.id)}
              onPress={() => navigation.navigate('TaskDetail', { task: item })}
            />
          ))
        }
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Task</Text>

            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, titleError ? styles.inputError : null]}
              placeholder="e.g., Shopping..."
              value={title}
              onChangeText={setTitle}
              maxLength={60}
            />
            {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea, descError ? styles.inputError : null]}
              placeholder="Enter description..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            {descError ? <Text style={styles.errorText}>{descError}</Text> : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setTitle('');
                  setDescription('');
                  setTitleError('');
                  setDescError('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1a1a2e' },
  headerSub: { fontSize: 13, color: '#999', marginTop: 2 },
  headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  importBtn: {
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  importBtnText: { color: '#6C63FF', fontWeight: '600', fontSize: 13 },
  addBtn: {
    backgroundColor: '#6C63FF',
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 24, lineHeight: 28 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    elevation: 1,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#333' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#ebebf5' },
  filterBtnActive: { backgroundColor: '#6C63FF' },
  filterText: { fontSize: 13, color: '#888' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 20 },
  label: { fontSize: 13, color: '#555', fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  inputError: { borderColor: '#e74c3c' },
  errorText: { fontSize: 12, color: '#e74c3c', marginBottom: 10 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelText: { color: '#888', fontWeight: '600' },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#6C63FF', alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});