import { create } from 'zustand';
import api from '../lib/axios';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('admin_token') || null,
  email: localStorage.getItem('admin_email') || null,

  get isAuthenticated() {
    return !!get().token;
  },

  login: async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    const { token, email: adminEmail } = res.data.data;

    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_email', adminEmail);

    set({ token, email: adminEmail });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    set({ token: null, email: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      set({ token: null, email: null });
      return false;
    }

    // Check if token is expired by decoding JWT payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_email');
        set({ token: null, email: null });
        return false;
      }
    } catch {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
      set({ token: null, email: null });
      return false;
    }

    return true;
  },
}));

export default useAuthStore;
