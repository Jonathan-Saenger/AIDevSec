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
      <p class="section-intro"> Parce que la technologie évolue sans cesse et très rapidement, les articles sont régulièrement 
          mis à jour plutôt que recréés systématiquement. Restez informé, anticipez les défis et façonnez l'avenir du web 
          en toute sécurité avec l'intelligence artificielle.</p>
      <div v-if="loading" class="loading">
        Chargement des articles...
      </div>
      <div v-else class="articles-grid">
        <article v-for="article in latestArticles" :key="article._id" class="article-card">
          <div class="article-image" v-if="article.image">
            <img :src="article.image" :alt="article.title">
          </div>
          <div class="article-content">
            <div class="article-badge">{{ article.category }}</div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <router-link :to="'/blog/' + article._id" class="read-more">Lire plus</router-link>
          </div>
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
      <h2 class="section-title neon-text">Développeur à l’ère de l’IA : S’adapter, Innover, Sécuriser</h2>
      <div class="presentation-content">
        <div class="text-content">
          <h3>L’intelligence artificielle révolutionne le développement web. Loin d’être une menace, elle offre aux développeurs une opportunité unique 
            d’optimiser leur code, d’accélérer le processus de création et d'offrir aux professionnels de nouveaux outils pour répondre aux mutations de leur marché. 
            Mais ces avancées soulèvent aussi un défi majeur : la cybersécurité.</h3>
          <p>Je suis Jonathan Saenger, développeur web passionné par l'évolution technologique. Je suis heureux de vous partager de nouvelles pratiques de développement à l'ère de l'intelligence artificielle. 
            Développeur web fullstack, j'étudie actuellement le Cloud Computing et me forme sur l'Intelligence Artificielle. Tout cela me permet d'explorer comment notre façon
            de travailler est en pleine transformation avec la sécurité, plus que jamais, placé au coeur de notre priorité.<br><br>
            À travers ce blog, je partage ma vision d'un développement web moderne où l'IA devient un allié puissant pour doper notre apprentissage, optimiser nos processus de développement 
            et stimuler notre créativité. Que vous soyez un professionnel et/ou passionné de tech, j'essaierais de vous partager autant de
            ressources utiles pour naviguer dans cette ère numérique en pleine transformation.</p>
        </div>
        <div class="image-content">
          <img src="/portrait.png" alt="Portrait de Jonathan Saenger" class="portrait-image">
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.home section {
  width: 100%;
  position: relative;
  margin: 2rem 0;
  background: linear-gradient(to bottom, rgba(16, 16, 24, 0.95), rgba(16, 16, 24, 0.85));
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.5rem var(--container-padding);
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  padding: 1.75rem 2rem;
  background: rgba(20, 25, 35, 0.5);
  border: 1px solid rgba(74, 158, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.form-group label {
  font-family: var(--font-heading);
  color: rgba(74, 158, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(16, 16, 24, 0.6);
  border: 1px solid rgba(74, 158, 255, 0.2);
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.95rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: rgba(74, 158, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.1);
  background: rgba(16, 16, 24, 0.8);
}

.form-group input:hover,
.form-group textarea:hover {
  border-color: rgba(74, 158, 255, 0.3);
}

.terminal-btn {
  background: rgba(74, 158, 255, 0.1);
  color: rgba(74, 158, 255, 0.9);
  border: 1px solid rgba(74, 158, 255, 0.3);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  width: 200px;
  margin: 1rem auto 0;
  position: relative;
  overflow: hidden;
}

.terminal-btn:hover {
  background: rgba(74, 158, 255, 0.2);
  border-color: rgba(74, 158, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.15);
}

.terminal-btn:active {
  transform: translateY(0);
}

.terminal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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

.hero {
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.article-card {
  background: rgba(26, 26, 26, 0.8);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 158, 255, 0.1);
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(74, 158, 255, 0.15);
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
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-content {
  padding: 1.5rem;
}

.article-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(74, 158, 255, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  backdrop-filter: blur(5px);
  z-index: 1;
}

.article-card h3 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: #fff;
  line-height: 1.4;
}

.article-card p {
  color: #ccc;
  margin: 1rem 0;
  line-height: 1.6;
}

.read-more {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #4a9eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s, transform 0.2s;
  font-weight: 500;
}

.read-more:hover {
  background: #3182ce;
  transform: translateX(5px);
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

  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .article-card {
    margin: 0 1rem;
  }
}

.presentation {
  padding: 2rem var(--container-padding);
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.presentation-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.text-content {
  flex: 1;
}

.image-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.portrait-image {
  width: 400px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(74, 158, 255, 0.15);
  transition: transform 0.3s ease;
}

.portrait-image:hover {
  transform: scale(1.02);
}

@media (max-width: 1200px) {
  .portrait-image {
    width: 350px;
  }
}

@media (max-width: 1024px) {
  .presentation-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .portrait-image {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .presentation-content {
    padding: 0 1rem;
  }

  .portrait-image {
    width: 250px;
  }
}

.scroll-section {
  scroll-snap-align: start;
}

section {
  scroll-margin-top: 80px; 
}

.section-intro {
  max-width: 950px;
  margin: 0 auto 3rem;
  text-align: center;
  color: #a0a0a0;
  font-size: 1.1rem;
  line-height: 1.6;
  padding: 0 1.5rem;
  position: relative;
}

.section-intro::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -1.5rem;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4a9eff, transparent);
}

@media (max-width: 768px) {
  .section-intro {
    font-size: 1rem;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }

  .section-intro::before {
    width: 40px;
    bottom: -1rem;
  }
}

@media (max-width: 768px) {
  .contact {
    padding: 1rem var(--container-padding);
  }

  .contact-form {
    padding: 1.25rem;
    margin: 0.75rem;
  }

  .terminal-btn {
    width: 100%;
    max-width: none;
    margin-top: 0.75rem;
  }
}
</style>