<template>
  <div class="blog-container">
    <router-link to="/" class="btn-back">
      <i class="fas fa-arrow-left"></i>
    </router-link>

    <header class="blog-header">
      <div class="header-content">
        <h1>Blog<span class="title-accent">.</span></h1>
        <p class="subtitle">Explorez nos articles sur la cybersécurité et l'IA</p>
        <button @click="toggleFilters" class="toggle-filters" :class="{ active: showFilters }">
          <i class="fas fa-sliders-h"></i>
          Filtres
        </button>
      </div>

      <div class="blog-filters" :class="{ 'filters-visible': showFilters }">
        <div class="filters-content">
          <div class="filters-row">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Rechercher un article..."
                class="search-input"
              >
            </div>
            
            <div class="select-box">
              <i class="fas fa-filter"></i>
              <select v-model="selectedCategory" class="category-select">
                <option value="">Toutes les catégories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ formatCategory(category) }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="search-stats" v-if="!loading">
      {{ filteredArticles.length }} article{{ filteredArticles.length > 1 ? 's' : '' }} trouvé{{ filteredArticles.length > 1 ? 's' : '' }}
    </div>

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
        <div class="article-image" v-if="article.image">
          <img :src="article.image" :alt="article.title">
        </div>
        <div class="article-content">
          <h2>{{ article.title }}</h2>
          <div class="article-meta">
            <span class="category">{{ formatCategory(article.category) }}</span>
            <span class="date">{{ formatDate(article.createdAt) }}</span>
          </div>
          <p class="summary">{{ article.summary }}</p>
          <router-link :to="'/blog/' + article._id" class="read-more">
            Lire la suite
          </router-link>
        </div>
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
const searchQuery = ref('');
const showFilters = ref(false);

const categories = [
  'SÉCURITÉ', 'DÉVELOPPEMENT', 'ÉTHIQUE', 'IA', 'CLOUD',
  'DONNÉES', 'API', 'RÉGULATIONS', 'INNOVATION'
];

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const filteredArticles = computed(() => {
  return articles.value
    .filter(article => article.published)
    .filter(article => {
      const matchesCategory = !selectedCategory.value || article.category === selectedCategory.value;
      const matchesSearch = !searchQuery.value || 
        article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.value.toLowerCase());
      return matchesCategory && matchesSearch;
    });
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
.blog-container {
  position: relative;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.btn-back {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(74, 158, 255, 0.1);
  border-radius: 50%;
  color: #4a9eff;
  transition: all 0.2s ease;
  z-index: 100;
}

.btn-back:hover {
  background: rgba(74, 158, 255, 0.2);
  transform: translateY(-50%) translateX(-5px);
}

.blog-header {
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
}

.header-content {
  margin-bottom: 1rem;
}

.blog-header h1 {
  font-size: 3.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -1px;
}

.title-accent {
  color: #4a9eff;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.toggle-filters {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: rgba(74, 158, 255, 0.1);
  border: 1px solid rgba(74, 158, 255, 0.2);
  border-radius: 8px;
  color: #4a9eff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: auto;
  align-self: center;
}

.toggle-filters:hover {
  background: rgba(74, 158, 255, 0.2);
  color: #4a9eff;
  border-color: rgba(74, 158, 255, 0.3);
}

.toggle-filters.active {
  background: #4a9eff;
  color: #fff;
  border-color: #4a9eff;
  width: auto;
}


.blog-filters {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.blog-filters.filters-visible {
  max-height: 500px;
  opacity: 1;
}

.filters-content {
  width: 100%;
}

.filters-row {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  gap : 4rem;
}

.search-box {
  position: relative;
  width: 320px;
  flex: 0 0 auto;
}

.select-box {
  position: relative;
  width: 220px;
  flex: 0 0 auto;
}

.search-box i, .select-box i {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4a9eff;
  font-size: 0.85rem;
  pointer-events: none;
  opacity: 0.7;
  z-index: 1;
  padding-right: 4rem;
}

.search-input, .category-select {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  background: rgba(42, 42, 42, 0.4);
  border: 1px solid rgba(74, 158, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: #666;
}

.search-input:focus, .category-select:focus {
  outline: none;
  background: rgba(42, 42, 42, 0.6);
  border-color: rgba(74, 158, 255, 0.3);
}

.category-select {
  appearance: none;
  cursor: pointer;
  padding-right: 2rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a9eff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 10px;
}

.category-select option {
  background: #1a1a1a;
  color: #fff;
  padding: 0.6rem;
}

.search-stats {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.article-card {
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.article-card h2 {
  font-size: 1.5rem;
  margin: 0 0 1rem;
  color: #fff;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.category {
  color: #4a9eff;
  font-weight: 500;
}

.date {
  color: #666;
}

.summary {
  color: #ccc;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
}

.read-more {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #4a9eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
  align-self: flex-start;
}

.read-more:hover {
  background: #3182ce;
}

.loading, .error, .no-articles {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 8px;
  color: #fff;
}

.error {
  color: #ff4a4a;
}

@media (max-width: 768px) {
  .toggle-filters {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    gap: 0.3rem;
    width: auto;
    max-width: fit-content;
  }

  .toggle-filters.active {
    width: auto;
    max-width: fit-content;
  }

  .toggle-filters i {
    font-size: 0.8rem;
  }
}

@media (max-width: 1024px) {
  .btn-back {
    position: absolute;
    left: 0;
    top: 1rem;
    transform: none;
  }

  .blog-header {
    padding-top: 4rem;
  }

  .blog-header h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 900px) {
  .filters-row {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .blog-container {
    padding: 1rem;
  }

  .blog-filters {
    width: 100%;
    right: -100%;
  }

  .blog-header {
    margin-bottom: 1rem;
  }

  .toggle-filters {
    position: relative;
    transform: none;
    width: 100%;
    justify-content: center;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
    padding: 0 1rem;
    gap: 1rem;
  }

  .search-box, .select-box {
    width: 100%;
  }

  .blog-filters.filters-visible {
    padding: 1rem 0;
  }
}
</style>
