<template>
  <footer class="footer">
    <div class="footer-container">
      <button class="terminal-btn" @click="toggleTerminal">
        TERMINAL
        <div class="scanline"></div>
      </button>
    </div>
  </footer>
</template>

<script setup>
const toggleTerminal = () => {
  // Terminal functionality to be implemented
  console.log('Terminal toggled');
}
</script>

<style scoped>
.footer {
  background-color: var(--carbon);
  padding: 2rem var(--container-padding);
  position: relative;
  overflow: hidden;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
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
}

.terminal-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 243, 255, 0.2),
    transparent
  );
  animation: scanline 2s linear infinite;
}

.terminal-btn:hover {
  background: rgba(0, 243, 255, 0.1);
  text-shadow: 0 0 5px var(--neon-circuit);
  transform: scale(1.05);
}

.terminal-btn:hover::before {
  animation: scanline 1s linear infinite;
}

@keyframes hologram {
  0% {
    opacity: 0.5;
    transform: perspective(500px) rotateX(0deg);
  }
  100% {
    opacity: 1;
    transform: perspective(500px) rotateX(360deg);
  }
}

.terminal-btn:hover {
  animation: hologram 2s infinite linear;
}
</style>
