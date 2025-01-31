<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>À propos</h3>
        <p>Exploration de la sécurité du développement web à l'ère de l'intelligence artificielle.</p>
      </div>
      
      <div class="footer-section">
        <h3>Contact</h3>
        <p>jonathan.saenger.pro@gmail.com</p>
      </div>

      <div class="footer-section">
        <h3>Rejoingnez-moi</h3>
        <div class="social-links">
          <a href="https://www.linkedin.com/in/jonathansaenger/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://github.com/Jonathan-Saenger" target="_blank" rel="noopener">GitHub</a>
          <a href="https://x.com/SaengerPro" target="_blank" rel="noopener">X</a>
          <a href="https://codepen.io/Jonathan-Saenger" target="_blank" rel="noopener">CodePen</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} AIDevSec. Tous droits réservés.</p>
      <span class="admin-link" @click="showLoginForm" title="Administration">·</span>
    </div>

    <!-- Login Form Modal -->
    <LoginForm ref="loginForm" />
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import LoginForm from './LoginForm.vue';

const loginForm = ref(null);
const currentYear = computed(() => new Date().getFullYear());

const showLoginForm = () => {
  loginForm.value?.toggleVisibility();
};
</script>

<style scoped>
.footer {
  background-color: #1a1a1a;
  color: #fff;
  padding: 3rem 2rem 1rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: #4a9eff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-section p {
  color: #999;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: #999;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #4a9eff;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  position: relative;
}

.admin-link {
  cursor: pointer;
  display: inline-block;
  padding: 0 0.5rem;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  font-size: 1.2rem;
  vertical-align: middle;
}

.admin-link:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
