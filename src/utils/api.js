export const fetchSuggestedTasks = async () => {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=5'
    );
    const data = await response.json();
    return data.map((item) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + item.id,
      title: item.title,
      description: 'Imported from API',
      status: item.completed ? 'completed' : 'active',
      createdAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.error('Error fetching tasks:', e);
    return [];
  }
};