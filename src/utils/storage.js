import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@tasks';

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
};

export const loadTasks = async () => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading tasks:', e);
    return [];
  }
};
export const clearTasks = async () => {
  try {
    await AsyncStorage.removeItem('@tasks');
  } catch (e) {
    console.error('Error clearing tasks:', e);
  }
};