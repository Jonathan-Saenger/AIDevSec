import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    getUser: (state) => state.user
  },

  actions: {
    async login(email, password) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password
        });

        this.token = response.data.token;
        this.user = response.data.user;

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Configuration axios pour inclure le token dans les requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de connexion';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    },

    initializeAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },

    async checkAuth() {
      if (!this.token) return false;
      
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.user = response.data;
        return true;
      } catch (error) {
        this.logout();
        return false;
      }
    }
  }
});