// services/ai.js
const FALLBACK = [
  'Initialize project repository',
  'Design UI wireframes',
  'Implement authentication',
  'Build basic CRUD endpoints',
  'Write unit tests'
].join('\n');

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const suggestTasks = async (projectName, description) => {
  try {
    const res = await fetch(`${BASE_URL}/suggest-tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectTitle: projectName, description }),
    });

    if (!res.ok) throw new Error(`Network error: ${res.statusText}`);
    const { tasks } = await res.json();
    if (Array.isArray(tasks)) return tasks.join('\n');
    return typeof tasks === 'string' ? tasks : FALLBACK;
  } catch (err) {
    console.error('suggestTasks error:', err);
    return `⚠️ Could not fetch AI suggestions. Here’s a sample:\n${FALLBACK}`;
  }
};
