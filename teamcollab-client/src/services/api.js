import axios from 'axios';

// Ensure baseURL always ends with /api
const baseURL = import.meta.env.VITE_API_URL || 'https://teamcollab-1-gbpq.onrender.com/api';

const API = axios.create({
  baseURL: baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`
});
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
