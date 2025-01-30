<template>
  <div class="article-detail">
    <div v-if="loading" class="loading">
      Chargement de l'article...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <article v-else class="article-content">
      <!-- Image de couverture -->
      <div v-if="article.image" class="cover-image">
        <img :src="article.image" :alt="article.title">
      </div>

      <!-- En-tête de l'article -->
      <header class="article-header">
        <div class="article-meta">
          <span class="category">{{ formatCategory(article.category) }}</span>
          <span class="date">{{ formatDate(article.createdAt) }}</span>
        </div>
        <h1>{{ article.title }}</h1>
      </header>

      <!-- Corps de l'article -->
      <div class="article-body" v-html="article.content"></div>

      <!-- Navigation -->
      <div class="article-navigation">
        <router-link to="/blog" class="back-link">
          <i class="fas fa-arrow-left"></i>
          Retour aux articles
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { secureApi } from '../services/api'

const route = useRoute()
const router = useRouter()
const article = ref({})
const loading = ref(true)
const error = ref('')

const formatCategory = (category) => {
  return category ? category.charAt(0) + category.slice(1).toLowerCase() : ''
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchArticle = async () => {
  try {
    loading.value = true
    const response = await secureApi.getArticle(route.params.id)
    if (response) {
      article.value = response
    } else {
      throw new Error('Article non trouvé')
    }
  } catch (err) {
    console.error('Erreur lors du chargement de l\'article:', err)
    error.value = 'Impossible de charger l\'article'
    router.push('/blog')
  } finally {
    loading.value = false
  }
}

onMounted(fetchArticle)
</script>

<style scoped>
.article-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.cover-image {
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-header {
  margin-bottom: 2rem;
  text-align: center;
}

.article-meta {
  display: flex;
  justify-content: center;
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

.article-header h1 {
  font-size: 2.5rem;
  color: #fff;
  margin: 0;
  line-height: 1.3;
}

.article-body {
  color: #fff;
  line-height: 1.8;
  font-size: 1.1rem;
}

.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2rem 0;
}

.article-body :deep(h2) {
  color: #4a9eff;
  margin: 2rem 0 1rem;
  font-size: 1.8rem;
}

.article-body :deep(h3) {
  color: #4a9eff;
  margin: 1.5rem 0 1rem;
  font-size: 1.5rem;
}

.article-body :deep(p) {
  margin: 1.5rem 0;
}

.article-body :deep(blockquote) {
  border-left: 3px solid #4a9eff;
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: #a0aec0;
}

.article-body :deep(pre) {
  background: #2d3748;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 2rem 0;
}

.article-body :deep(code) {
  background: #2d3748;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.article-navigation {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #2d3748;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a9eff;
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.2s;
}

.back-link:hover {
  transform: translateX(-5px);
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  background: #1a1a1a;
  border-radius: 8px;
  color: #fff;
}

.error {
  color: #ff4a4a;
}

@media (max-width: 768px) {
  .article-detail {
    padding: 1rem;
  }

  .cover-image {
    height: 250px;
    margin: -1rem -1rem 2rem -1rem;
    border-radius: 0;
  }

  .article-header h1 {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>