<template>
  <div class="home">
    <section class="hero" id="hero">
      <div class="hero-content">
        <h1 class="hero-title neon-text">IA : Dev // Sec</h1>
        <p class="hero-slogan">La sécurité du Développement Web à l'ère de l'Intelligence Artificielle</p>
      </div>
      <div class="cyber-background">
         <div class="cyber-particles"></div>
      </div>
    </section>

    <section class="latest-articles" id="latest-articles">
      <h2 class="section-title neon-text">Derniers Articles</h2>
      <div class="articles-grid">
        <article v-for="i in 3" :key="i" class="article-card">
          <div class="article-badge">IA & SÉCURITÉ</div>
          <h3>Article Title {{ i }}</h3>
          <p>Description de l'article avec un aperçu du contenu...</p>
          <router-link :to="'/article/' + i" class="read-more">Lire plus</router-link>
        </article>
      </div>
      <div class="view-all-articles">
        <router-link to="/blog" class="view-all-link">
          <span>Consulter tous les articles dans le Blog</span>
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
    </section>

    <section class="presentation" id="presentation">
      <h2 class="section-title neon-text">Présentation</h2>
      <div class="presentation-content">
        <div class="text-content">
          <h3>Ce qui je suis avant tout : un passionné ...</h3>
          <p>...de Développement Web, des nouvelles tendances de l'intelligence artificielle et des solutions à la sécurité. Contenu de ma présentation</p>
        </div>
        <div class="image-content">
          <img src="https://via.placeholder.com/400x200" alt="Image de présentation">
        </div>
      </div>
    </section>

    <section class="contact" id="contact">
      <h2 class="section-title neon-text">Contact</h2>
      <form class="contact-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Nom & Prénom</label>
          <input type="text" id="name" v-model="form.name" :disabled="loading" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" :disabled="loading" required />
        </div>
        <div class="form-group">
          <label for="message">Votre Message</label>
          <textarea id="message" v-model="form.message" rows="5" :disabled="loading" required></textarea>
        </div>
        <button type="submit" class="terminal-btn" :disabled="loading">
          {{ loading ? 'Envoi en cours...' : 'Envoyer' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { secureApi } from '../services/api';

// État pour les articles
const latestArticles = ref([]);
const loading = ref(false);

// État pour le formulaire de contact
const form = ref({
    name: '',
    email: '',
    message: '',
});

// Récupérer les 3 derniers articles publiés
const fetchLatestArticles = async () => {
  try {
    loading.value = true;
    const articles = await secureApi.getArticles();
    latestArticles.value = articles
      .filter(article => article.published)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
  } finally {
    loading.value = false;
  }
};

// Soumission du formulaire de contact
const submitForm = async () => {
  try {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Formulaire soumis :', form.value);
    this.value.name = '';
    this.value.email = '';
    this.value.message = '';
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error);
  } finally {
    loading.value = false;
    alert('Message envoyé avec succès !');
  }
};

onMounted(() => {
  fetchLatestArticles();
});
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* TEMPLATE D'ACCUEIL */
.cyber-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(
      15deg, 
      var(--cyber-void) 0%, 
      rgba(16, 24, 42, 0.98) 100%
    ),
    linear-gradient(
      to right,
      rgba(var(--neon-circuit-rgb), 0.02) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(var(--neon-circuit-rgb), 0.02) 1px,
      transparent 1px
    );
  background-size: 20px 20px;
  z-index: 1;
  overflow: hidden;
}

.cyber-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(
      45deg,
      transparent 65%,
      rgba(var(--neon-circuit-rgb), 0.03) 100%
    ),
    repeating-linear-gradient(
      30deg,
      transparent 0%,
      transparent 1px,
      rgba(var(--neon-circuit-rgb), 0.04) 2px,
      rgba(var(--neon-circuit-rgb), 0.04) 3px
    );
  animation: grid-flow 40s linear infinite;
}

.cyber-background::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 300%;
  background-image: 
    linear-gradient(
      to bottom,
      transparent 45%,
      rgba(var(--neon-circuit-rgb), 0.02) 50%,
      transparent 55%
    );
  animation: scan 8s linear infinite;
  filter: blur(1px);
}

@keyframes grid-flow {
  0% { background-position: 0 0; }
  100% { background-position: 400px 400px; }
}

@keyframes scan {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(50%); }
}

/* Effets de particules discrètes */
.cyber-particles {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(
      circle at 20% 80%,
      rgba(var(--neon-circuit-rgb), 0.03) 0%,
      transparent 15%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(var(--neon-circuit-rgb), 0.03) 0%,
      transparent 15%
    );
  animation: particles-pulse 20s alternate infinite;
}

@keyframes particles-pulse {
  from { opacity: 0.3; transform: scale(0.98); }
  to { opacity: 0.6; transform: scale(1.02); }
}

@keyframes grid-pulse {
  0% { background-position: 0 0; }
  100% { background-position: 240px 240px; }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
}

.hero-title {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.hero-slogan {
  font-family: var(--font-body);
  font-weight: 300;
  font-size: 1.5rem;
  color: var(--quantum-pink);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.latest-articles {
  padding: 2rem var(--container-padding);
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  background: var(--carbon);
  padding: 1.5rem;
  border-radius: 8px;
  position: relative;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(var(--neon-circuit-rgb), 0.1) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-card:hover::before {
  opacity: 1;
}

.article-badge {
  background: rgba(var(--hologram-green-rgb), 0.9);
  color: var(--cyber-void);
  display: inline-block;
  padding: 0.25rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.read-more {
  color: var(--neon-circuit);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.read-more:hover {
  text-shadow: 0 0 8px rgba(var(--neon-circuit-rgb), 0.4);
}

.view-all-articles {
  text-align: center;
  margin-top: 2rem;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #2c3e50, #3498db);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: transform 0.2s;
}

.view-all-link:hover {
  transform: translateY(-2px);
}

.view-all-link i {
  transition: transform 0.2s;
}

.view-all-link:hover i {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-slogan {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

/* TEMPLATE DE PRESENTATION */
.presentation {
  padding: 2rem var(--container-padding);
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.presentation-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.text-content {
  flex: 1;
}

.image-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .presentation-content {
    flex-direction: column;
  }

  .image-content {
    order: 2; /* Image au milieu en mobile */
  }

  .text-content {
    order: 3; /* Texte en bas en mobile */
    text-align: center;
    padding-right: 1rem;
    padding-bottom: 1rem;
  }

  .presentation h2 {
    order: 1; /* Titre en haut en mobile */
  }
}

/* TEMPLATE DE CONTACT */
.contact {
  padding: 1rem var(--container-padding);
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-family: var(--font-heading);
  color: var(--neon-circuit);
  font-size: 1.1rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid var(--neon-circuit);
  background: transparent;
  color: var(--neon-circuit);
  font-family: var(--font-body);
  font-size: 1rem;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--quantum-pink);
  outline: none;
}

.terminal-btn {
  background: transparent;
  color: var(--neon-circuit);
  border: 2px solid var(--neon-circuit);
  padding: 0.75rem 2rem;
  font-family: var(--font-heading);
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border-radius: 4px;
  margin-top: 1rem;
  width: 50%; 
  max-width: 200px; 
  margin-left: auto; 
  margin-right: auto; 
}

.terminal-btn:hover {
  background: rgba(0, 243, 255, 0.1);
  text-shadow: 0 0 5px var(--neon-circuit);
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .contact {
    padding: 2rem var(--container-padding);
  }

  .form-group input,
  .form-group textarea {
    font-size: 0.9rem;
  }

  .terminal-btn {
    width: 60%; 
    max-width: 150px; 
    font-size: 0.9rem;
    padding: 0.5rem 1.5rem;
  }
}

.scroll-section {
  scroll-snap-align: start;
}

</style>