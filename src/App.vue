<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import Toast from 'primevue/toast'

// Initialize i18n and set up direction
const { initializeDirection } = useI18n()

onMounted(() => {
  initializeDirection()
})
</script>

<template>
  <div id="app">
    <Toast />
    <router-view />
  </div>
</template>

<style lang="scss">
/* Import sidebar styles globally - @use must be first */
@use './components/layout/sidebar/styles/sidebar.scss';

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

#app {
  height: 100vh;
}

/* Global Thin Scrollbar Styles */
/* Light theme scrollbar */
:root {
  --scrollbar-width: 6px;
  --scrollbar-track: transparent;
  --scrollbar-thumb: #d1d5db;
  --scrollbar-thumb-hover: #9ca3af;
  --scrollbar-thumb-active: #6b7280;
}

/* Dark theme scrollbar */
:root[data-theme="dark"] {
  --scrollbar-thumb: #4b5563;
  --scrollbar-thumb-hover: #6b7280;
  --scrollbar-thumb-active: #9ca3af;
}

/* Webkit browsers (Chrome, Safari, Edge) */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

*::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
}

*::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 3px;
}

*::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

*::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}

*::-webkit-scrollbar-thumb:active {
  background: var(--scrollbar-thumb-active);
}

*::-webkit-scrollbar-corner {
  background: var(--scrollbar-track);
}

/* Firefox */
html {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}



/* Content padding */
.main-content > * {
  padding: 2rem;
  color: var(--main-text);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>
