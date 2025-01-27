<template>
    <div class="admin-dashboard">
      <h1>Dashboard Administrateur</h1>
      <div class="admin-stats">
        <div class="stat-card">
          <h3>Articles</h3>
          <p>{{ articlesCount }} publiés</p>
        </div>
      </div>
      
      <div class="admin-actions">
        <button @click="createNewArticle" class="action-button">
          Nouvel Article
        </button>
        <button @click="logout" class="action-button logout">
          Déconnexion
        </button>
      </div>
  
      <div class="articles-list">
        <h2>Mes Articles</h2>
        <div v-if="loading">Chargement...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else class="articles-grid">
          <div v-for="article in articles" :key="article._id" class="article-card">
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <div class="article-status" :class="{ published: article.published }">
              {{ article.published ? 'Publié' : 'Brouillon' }}
            </div>
            <div class="article-actions">
              <button @click="editArticle(article._id)">Modifier</button>
              <button @click="deleteArticle(article._id)" class="delete">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const articles = ref([]);
  const articlesCount = ref(0);
  const loading = ref(true);
  const error = ref(null);
  
  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/articles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      articles.value = response.data;
      articlesCount.value = response.data.length;
    } catch (err) {
      error.value = 'Erreur lors du chargement des articles';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  
  const createNewArticle = () => {
    router.push('/admin/article/new');
  };
  
  const editArticle = (id) => {
    router.push(`/admin/article/${id}`);
  };
  
  const deleteArticle = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchArticles();
    } catch (err) {
      error.value = 'Erreur lors de la suppression';
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };
  
  onMounted(fetchArticles);
  </script>
  
  <style scoped>
  .admin-dashboard {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    color: #4a9eff;
    margin-bottom: 2rem;
  }
  
  .admin-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
  }
  
  .admin-actions {
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
  }
  
  .action-button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .action-button:not(.logout) {
    background: #4a9eff;
    color: white;
  }
  
  .logout {
    background: #ff4a4a;
    color: white;
  }
  
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .article-card {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
    position: relative;
  }
  
  .article-status {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    background: #666;
    color: white;
    font-size: 0.9rem;
    margin: 1rem 0;
  }
  
  .article-status.published {
    background: #4caf50;
  }
  
  .article-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .article-actions button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .article-actions button:not(.delete) {
    background: #4a9eff;
    color: white;
  }
  
  .article-actions .delete {
    background: #ff4a4a;
    color: white;
  }
  </style>