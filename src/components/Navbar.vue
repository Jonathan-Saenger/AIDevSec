<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        AI://Dev.Sec
      </router-link>
      
      <!-- Menu Burger -->
      <button 
        class="burger-menu"
        :class="{ 'active': isMenuOpen }"
        @click="toggleMenu"
        aria-label="Menu principal"
      >
        <span class="burger-line top"></span>
        <span class="burger-line middle"></span>
        <span class="burger-line bottom"></span>
      </button>

      <!-- Liens de navigation -->
      <div 
        class="nav-links"
        :class="{ 'active': isMenuOpen }"
        @click="closeMenu"
      >
        <router-link to="/" class="nav-link">Accueil</router-link>
        <router-link to="/articles" class="nav-link">Articles</router-link>
        <router-link to="/about" class="nav-link">Présentation</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// Fermer le menu quand on clique en dehors
window.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar-container')) {
    isMenuOpen.value = false;
  }
});

// Fermer le menu au redimensionnement
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    isMenuOpen.value = false;
  }
});
</script>

<style scoped>
.navbar {
  background-color: var(--cyber-void);
  border-bottom: 2px solid;
  border-image: linear-gradient(to right, var(--neon-circuit), transparent) 1;
  padding: 1rem var(--container-padding);
  position: sticky;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start; /* Alignement à gauche */
  align-items: center;
  gap: 4rem; /* Espacement entre logo et liens */
  position: relative;
}

.logo {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 2rem;
  text-decoration: none;
  background: linear-gradient(90deg, var(--neon-circuit), var(--quantum-pink));
  -webkit-background-clip: text;
  color: transparent;
  transition: text-shadow 0.3s ease;
  z-index: 1001;
}

/* Version desktop */
@media screen and (min-width: 769px) {
  .nav-links {
    margin-left: auto; /* Déplace les liens vers la droite */
    padding-right: 2rem; /* Décale du bord */
    background: linear-gradient(
      to right,
      transparent,
      rgba(var(--neon-circuit-rgb), 0.05)
    );
    backdrop-filter: blur(2px);
  }

  .nav-link {
    position: relative;
    padding: 0.5rem 1rem;
  }

}

/* Menu Burger */
.burger-menu {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 1rem;
  z-index: 1001;
  position: relative;
  margin-left: auto;
}

.burger-line {
  display: block;
  width: 28px;
  height: 2px;
  background: var(--data-stream);
  margin: 5px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.burger-menu.active .top {
  transform: translateY(7px) rotate(45deg) skew(-5deg);
  background: var(--neon-circuit);
}

.burger-menu.active .middle {
  opacity: 0;
}

.burger-menu.active .bottom {
  transform: translateY(-7px) rotate(-45deg) skew(-5deg);
  background: var(--neon-circuit);
}

/* Liens de navigation */
.nav-links {
  display: flex;
  gap: 2rem;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.nav-link {
  font-family: var(--font-body);
  font-weight: 500;
  color: var(--data-stream);
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
}

/* Animation hover */
.nav-link::after {
  display: none; /* Désactive complètement le soulignement */
}

.nav-link:hover {
  transform: skew(-5deg);
  text-shadow: 0 0 5px var(--neon-circuit);
}

.nav-link:hover::after {
  width: 100%;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .burger-menu {
    display: block;
    margin-left: auto;
    padding: 0.5rem;
  }

  .nav-links {
    position: fixed;
    top: 60px;
    right: -100%;
    flex-direction: column;
    background: var(--cyber-void);
    border-left: 2px solid var(--neon-circuit);
    border-bottom: 2px solid var(--neon-circuit);
    padding: 2rem;
    gap: 1.5rem;
    width: 280px;
    backdrop-filter: blur(5px);
  }

  .nav-links.active {
    right: 0;
    animation: menuSlide 0.4s ease-out;
  }

  .nav-link {
    padding: 0.5rem;
    border-bottom: 1px solid rgba(var(--neon-circuit-rgb), 0.1);
    transform-origin: right;
  }

  .nav-link:hover {
    transform: skew(-5deg) translateX(-10px);
  }
}

@keyframes menuSlide {
  0% {
    right: -100%;
    opacity: 0;
  }
  100% {
    right: 0;
    opacity: 1;
  }
}
</style>