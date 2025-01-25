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
  min-height: 100vh;
  padding-bottom: 60px; /* Pour compenser le footer */
}
</style>
