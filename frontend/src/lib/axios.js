import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://dot-computer.onrender.com/api'
    : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout — Render free tier cold starts take 20-50s
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData (CSV upload)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 + retry on timeout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry once on timeout (Render cold start)
    if (error.code === 'ECONNABORTED' && !config._retried) {
      config._retried = true;
      return api(config);
    }

    // Retry once on network error (server waking up)
    if (!error.response && !config._retried) {
      config._retried = true;
      // Wait 3 seconds before retry
      await new Promise((r) => setTimeout(r, 3000));
      return api(config);
    }

    if (error.response && error.response.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (isAdminRoute) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    }

    // Rate limit hit
    if (error.response && error.response.status === 429) {
      console.warn('Rate limit hit. Please wait a moment.');
    }

    return Promise.reject(error);
  }
);

export default api;
