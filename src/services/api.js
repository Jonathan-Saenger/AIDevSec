import axios from 'axios';
import router from '../router';

// Création d'une instance Axios avec la configuration de base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour les requêtes
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

// Intercepteur pour les réponses
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        if (error.response) {
            // Gestion des erreurs d'authentification
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                if (router.currentRoute.value.name !== 'home') {
                    router.push('/');
                }
            }
            
            if (error.response.status === 403) {
                console.error('Accès non autorisé');
            }
        }
        return Promise.reject(error);
    }
);

// Méthodes API sécurisées
export const secureApi = {
    // Articles
    getArticles: () => api.get('/api/articles'),
    getArticle: (id) => api.get(`/api/articles/${id}`),
    createArticle: (data) => api.post('/api/articles', data),
    updateArticle: (id, data) => api.put(`/api/articles/${id}`, data),
    deleteArticle: (id) => api.delete(`/api/articles/${id}`),
    
    // Authentification
    login: (credentials) => api.post('/api/auth/login', credentials),
    getProfile: () => api.get('/api/auth/profile'),
    
    // Méthode utilitaire pour vérifier l'authentification
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return !!(token && user.role === 'admin');
    }
};

export default api;
