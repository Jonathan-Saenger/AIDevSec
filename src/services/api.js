import axios from 'axios';
import router from '../router';

// Création d'une instance Axios avec la configuration de base
const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
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
    (response) => response,
    async (error) => {
        if (error.response) {
            // Gestion des erreurs d'authentification
            if (error.response.status === 401) {
                // Supprimer les informations d'authentification
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Rediriger vers la page d'accueil
                if (router.currentRoute.value.name !== 'home') {
                    router.push('/');
                }
            }
            
            // Gestion des erreurs de permission
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