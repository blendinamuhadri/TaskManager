import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveTasks, loadTasks } from '../utils/storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

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

  const addTask = (title, description) => {
    const newTask = {
      id: uuidv4(),
      title,
      description,
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

  const importTasks = (apiTasks) => {
    saveAndSet([...apiTasks, ...tasks]);
  };

  return { tasks, addTask, deleteTask, toggleComplete, importTasks };
};