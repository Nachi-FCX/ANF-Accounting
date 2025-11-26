<template>
  <div v-if="visible" class="loading-overlay" :class="overlayClass">
    <div class="loading-overlay-content">
      <LoadingSpinner :size="size" :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import type { LoadingOverlayProps } from '../types/state-types'

const props = withDefaults(defineProps<LoadingOverlayProps>(), {
  size: 'md',
  blur: true,
  fullscreen: false
})

const overlayClass = computed(() => [
  {
    'loading-overlay--blur': props.blur,
    'loading-overlay--fullscreen': props.fullscreen
  }
])
</script>

<style scoped lang="scss">
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  
  &--blur {
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
  
  &--fullscreen {
    position: fixed;
    z-index: 9999;
  }
}

.loading-overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--color-surface, #ffffff);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .loading-overlay {
    background: rgba(0, 0, 0, 0.8);
  }
  
  .loading-overlay-content {
    background: var(--color-surface-dark, #2d3748);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

/* Animation */
.loading-overlay {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
