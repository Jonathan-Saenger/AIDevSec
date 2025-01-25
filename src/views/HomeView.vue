<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title neon-text">IA : Dev // Sec</h1>
        <p class="hero-slogan">La sécurité du Développement Web à l'ère de l'Intelligence Artificielle</p>
      </div>
      <div class="cyber-background">
         <div class="cyber-particles"></div>
      </div>
    </section>

    <section class="latest-articles">
      <h2 class="section-title neon-text">Derniers Articles</h2>
      <div class="articles-grid">
        <article v-for="i in 3" :key="i" class="article-card">
          <div class="article-badge">IA & SÉCURITÉ</div>
          <h3>Article Title {{ i }}</h3>
          <p>Description de l'article avec un aperçu du contenu...</p>
          <router-link :to="'/article/' + i" class="read-more">Lire plus</router-link>
        </article>
      </div>
    </section>
  </div>
</template>

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
  padding: 4rem var(--container-padding);
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
</style>