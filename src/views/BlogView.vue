<template>
  <div class="blog-page">
    <header class="blog-header">
      <h1>Blog</h1>
      <div class="category-filter">
        <select v-model="selectedCategory" class="form-control">
          <option value="">Toutes les catégories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ formatCategory(category) }}
          </option>
        </select>
      </div>
    </header>

    <div class="articles-grid">
      <div v-if="loading" class="loading">
        Chargement des articles...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else-if="filteredArticles.length === 0" class="no-articles">
        Aucun article trouvé dans cette catégorie.
      </div>
      
      <article v-else v-for="article in filteredArticles" :key="article._id" class="article-card">
        <h2>{{ article.title }}</h2>
        <div class="article-meta">
          <span class="category">{{ formatCategory(article.category) }}</span>
          <span class="date">{{ formatDate(article.createdAt) }}</span>
        </div>
        <p class="summary">{{ article.summary }}</p>
        <router-link :to="'/blog/' + article._id" class="read-more">
          Lire la suite
        </router-link>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { secureApi } from '../services/api';

const articles = ref([]);
const loading = ref(false);
const error = ref('');
const selectedCategory = ref('');

const categories = [
  'SÉCURITÉ', 'DÉVELOPPEMENT', 'ÉTHIQUE', 'IA', 'CLOUD',
  'DONNÉES', 'API', 'RÉGULATIONS', 'INNOVATION'
];

const filteredArticles = computed(() => {
  return articles.value
    .filter(article => article.published)
    .filter(article => !selectedCategory.value || article.category === selectedCategory.value);
});

const formatCategory = (category) => {
  return category.charAt(0) + category.slice(1).toLowerCase();
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchArticles = async () => {
  try {
    loading.value = true;
    const response = await secureApi.getArticles();
    articles.value = response;
  } catch (err) {
    error.value = 'Erreur lors du chargement des articles';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchArticles);
</script>

<style scoped>
.blog-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.category-filter {
  width: 200px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.category {
  background-color: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.summary {
  margin: 1rem 0;
  color: #444;
  line-height: 1.5;
}

.read-more {
  display: inline-block;
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}

.loading, .error, .no-articles {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
}
</style>