<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title neon-text">IA : Dev // Sec</h1>
        <p class="hero-slogan">La sécurité du Développement Web à l'air de l'Intelligence Artificielle</p>
      </div>
      <div class="hex-background"></div>
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

.hex-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--cyber-void);
  overflow: hidden;
  z-index: 1;
}

.hex-background::before {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 300%;
  background-image: 
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'%3E%3Ctext x='0' y='20' font-family='monospace' font-size='14' fill='%2300F3FF'%3E%0A%3Ctspan x='0'%3E01100101 01101110%3C/tspan%3E%0A%3Ctspan x='0' dy='20'%3E01100011 01110010%3C/tspan%3E%0A%3Ctspan x='0' dy='20'%3E01111001 01110000%3C/tspan%3E%0A%3Ctspan x='0' dy='20'%3E01110100 00111101%3C/tspan%3E%0A%3Ctspan x='0' dy='20'%3E01101000 00110010%3C/tspan%3E%0A%3Ctspan x='0' dy='20'%3E01100101 01101110%3C/tspan%3E%0A%3Ctspan x='0' dy='20'%3E01100011 01110010%3C/tspan%3E%0A%3Ctspan x='0' dy='20'%3E01111001 01110000%3C/tspan%3E%0A%3Ctspan x='0' dy='20'%3E01110100 00111101%3C/tspan%3E%0A%3Ctspan x='0' dy='20'%3E01101000 00110010%3C/tspan%3E%0A%3C/text%3E%3C/svg%3E");
  animation: codeFall 20s linear infinite;
  opacity: 0.1;
  filter: drop-shadow(0 0 2px var(--neon-circuit));
}

@keyframes codeFall {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(50%); }
}

.hex-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0, 243, 255, 0.05) 2px,
      rgba(0, 243, 255, 0.05) 3px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 1px,
      rgba(0, 243, 255, 0.05) 2px,
      rgba(0, 243, 255, 0.05) 3px
    );
  pointer-events: none;
}

@keyframes codeFall {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes codeFloat {
  0% { background-position: 0 0; }
  100% { background-position: 200px 200px; }
}

/* Effet scanlines pulsé */
.hex-background {
  box-shadow: inset 0 0 50px rgba(0, 243, 255, 0.1);
}

.hex-background::before {
  filter: drop-shadow(0 0 2px var(--neon-circuit));
}

/* Ajout d'un effet de terminal qui clignote */
@keyframes terminalFlicker {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.95; }
}

.hex-background {
  animation: terminalFlicker 0.1s infinite;
}

@keyframes codeFlow {
  0% { background-position: 0 0, 0 0; }
  100% { background-position: 0 600px, 0 0; }
}

@keyframes scanlines {
  from { background-position: 0 0; }
  to { background-position: 0 20px; }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-title {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.hero-slogan {
  font-family: var(--font-body);
  font-weight: 300;
  font-size: 1.5rem;
  color: var(--quantum-pink);
}

.latest-articles {
  padding: 4rem var(--container-padding);
  max-width: 1440px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  background: var(--carbon);
  padding: 1.5rem;
  border-radius: 4px;
  position: relative;
  transition: transform 0.3s ease;
  border: 1px solid transparent;
  background-image: conic-gradient(from 0deg at 50% 50%, var(--neon-circuit) 0%, transparent 25%);
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 243, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-card:hover::before {
  opacity: 1;
  filter: blur(10px);
}

.article-badge {
  background: var(--hologram-green);
  color: var(--cyber-void);
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 2px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.read-more {
  color: var(--neon-circuit);
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.read-more:hover {
  text-shadow: 0 0 5px var(--neon-circuit);
  transform: translateX(5px);
}

@media screen and (max-width: 390px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-slogan {
    font-size: 1.25rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
