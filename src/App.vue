<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Navbar />
  <main class="main-content">
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped>
.main-content {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 60px;
  overflow-x: hidden; /* Empêche le débordement horizontal */
}

/* Ajout d'une reset global */
@layer base {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    width: 100%;
    scroll-behavior: smooth;
  }
  
  body {
    width: 100%;
    overflow-x: hidden;
  }
}
</style>
