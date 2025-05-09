// src/api/api.js

import axios from 'axios';

// Create Axios instance with backend base URL
const api = axios.create({
  baseURL: 'https://teamcollab-1m84.onrender.com/api', // Ensure /api is included
  timeout: 10000, // Optional: timeout after 10s if no response
});

// Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: log errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error?.response || error);
    return Promise.reject(error);
  }
);

export default api;
