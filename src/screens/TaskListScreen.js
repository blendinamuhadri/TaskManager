import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  Modal, StyleSheet, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { useTasks } from '../hooks/useTasks';
import TaskItem from '../components/TaskItem';
import EmptyState from '../components/EmptyState';
import { fetchSuggestedTasks } from '../utils/api';

export default function TaskListScreen({ navigation }) {
  const { tasks, addTask, deleteTask, toggleComplete, importTasks } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [importing, setImporting] = useState(false);

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === 'active') return t.status === 'active';
        if (filter === 'completed') return t.status === 'completed';
        return true;
      })
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, filter, search]);

  const handleAdd = () => {
    let valid = true;
    if (!title.trim() || title.trim().length < 3) {
      setTitleError('Titulli duhet të ketë të paktën 3 karaktere');
      valid = false;
    } else {
      setTitleError('');
    }
    if (!description.trim()) {
      setDescError('Përshkrimi nuk mund të jetë bosh');
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
    importTasks(apiTasks);
    setImporting(false);
    Alert.alert('Sukses!', 'U importuan 5 detyra nga API!');
  };

  const handleDelete = (id) => {
    Alert.alert('Fshi detyrën', 'Je i sigurt?', [
      { text: 'Anulo', style: 'cancel' },
      { text: 'Fshi', style: 'destructive', onPress: () => deleteTask(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Detyrat e mia</Text>
          <Text style={styles.headerSub}>{tasks.length} detyra gjithsej</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.importBtn} onPress={handleImport} disabled={importing}>
            {importing ? (
              <ActivityIndicator size="small" color="#6C63FF" />
            ) : (
              <Text style={styles.importBtnText}>⬇ Import</Text>
            )}
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
          placeholder="Kërko detyra..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#bbb"
        />
      </View>

      <View style={styles.filterRow}>
        {['all', 'active', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Të gjitha' : f === 'active' ? 'Aktive' : 'Përfunduara'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleComplete(item.id)}
            onDelete={() => handleDelete(item.id)}
            onPress={() => navigation.navigate('TaskDetail', { task: item })}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Detyrë e re</Text>

            <Text style={styles.label}>Titulli *</Text>
            <TextInput
              style={[styles.input, titleError ? styles.inputError : null]}
              placeholder="p.sh. Bëj pazar..."
              value={title}
              onChangeText={setTitle}
              maxLength={60}
            />
            {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

            <Text style={styles.label}>Përshkrimi *</Text>
            <TextInput
              style={[styles.input, styles.textArea, descError ? styles.inputError : null]}
              placeholder="Shkruaj përshkrimin..."
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
                <Text style={styles.cancelText}>Anulo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveText}>Shto</Text>
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