<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <h1>Dashboard Administrateur</h1>
      <div class="admin-actions">
        <button @click="createNewArticle" class="action-button primary">
          <i class="fas fa-plus"></i> Nouvel Article
        </button>
        <button @click="logout" class="action-button danger">
          <i class="fas fa-sign-out-alt"></i> Déconnexion
        </button>
      </div>
    </header>

    <div class="admin-stats">
      <div class="stat-card">
        <h3>Articles</h3>
        <p>{{ articles.length }} total</p>
        <p>{{ publishedCount }} publiés</p>
      </div>
      <div class="stat-card">
        <h3>Dernière modification</h3>
        <p>{{ lastModified }}</p>
      </div>
    </div>

    <div class="articles-section">
      <div class="articles-header">
        <h2>Gestion des Articles</h2>
        <div class="articles-filters">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher un article..."
            class="search-input"
          >
          <select v-model="statusFilter" class="status-filter">
            <option value="all">Tous</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading-spinner">
        Chargement...
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-else class="articles-grid">
        <div v-for="article in filteredArticles" 
             :key="article._id" 
             class="article-card"
             :class="{ 'published': article.published }">
          <div class="article-header">
            <h3>{{ article.title }}</h3>
            <span class="status-badge" :class="{ 'published': article.published }">
              {{ article.published ? 'Publié' : 'Brouillon' }}
            </span>
          </div>
          
          <p class="article-summary">{{ article.summary }}</p>
          
          <div class="article-metadata">
            <span>
              <i class="fas fa-calendar"></i>
              {{ formatDate(article.updatedAt) }}
            </span>
            <span>
              <i class="fas fa-tag"></i>
              {{ article.category || 'Non catégorisé' }}
            </span>
          </div>

          <div class="article-actions">
            <button @click="editArticle(article._id)" class="btn-edit">
              <i class="fas fa-edit"></i> Modifier
            </button>
            <button @click="togglePublish(article)" class="btn-publish">
              <i class="fas" :class="article.published ? 'fa-eye-slash' : 'fa-eye'"></i>
              {{ article.published ? 'Dépublier' : 'Publier' }}
            </button>
            <button @click="deleteArticle(article._id)" class="btn-delete">
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { secureApi } from '../services/api';

const router = useRouter();
const articles = ref([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const statusFilter = ref('all');

// Statistiques calculées
const publishedCount = computed(() => 
  articles.value.filter(article => article.published).length
);

const lastModified = computed(() => {
  if (!articles.value.length) return 'Aucun article';
  const latest = [...articles.value].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  )[0];
  return formatDate(latest.updatedAt);
});

// Articles filtrés
const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'all' ||
                         (statusFilter.value === 'published' && article.published) ||
                         (statusFilter.value === 'draft' && !article.published);
    return matchesSearch && matchesStatus;
  });
});

// Fonctions
const fetchArticles = async () => {
  try {
    loading.value = true;
    const response = await secureApi.getArticles();
    articles.value = response; 
  } catch (err) {
    error.value = 'Erreur lors du chargement des articles';
    console.error('Erreur complète:', err);
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

const togglePublish = async (article) => {
  try {
    await secureApi.updateArticle(article._id, {
      ...article,
      published: !article.published
    });
    await fetchArticles();
  } catch (err) {
    error.value = 'Erreur lors de la modification du statut';
  }
};

const deleteArticle = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
  
  try {
    await secureApi.deleteArticle(id);
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(fetchArticles);
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  color: #4a9eff;
  margin-bottom: 0.5rem;
}

.articles-section {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
}

.articles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.articles-filters {
  display: flex;
  gap: 1rem;
}

.search-input, .status-filter {
  padding: 0.5rem 1rem;
  border: 1px solid #333;
  border-radius: 4px;
  background: #2a2a2a;
  color: #fff;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.article-card {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s;
}

.article-card:hover {
  transform: translateY(-2px);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  background: #333;
}

.status-badge.published {
  background: #4a9eff;
  color: white;
}

.article-summary {
  color: #999;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-metadata {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button, .btn-edit, .btn-publish, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.action-button.primary {
  background: #4a9eff;
  color: white;
}

.action-button.danger {
  background: #dc3545;
  color: white;
}

.btn-edit {
  background: #2a2a2a;
  color: #4a9eff;
}

.btn-publish {
  background: #2a2a2a;
  color: #28a745;
}

.btn-delete {
  background: #2a2a2a;
  color: #dc3545;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #dc3545;
  text-align: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .articles-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .articles-filters {
    width: 100%;
    flex-direction: column;
  }
}
</style>