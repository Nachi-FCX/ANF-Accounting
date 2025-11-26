<template>
  <div class="loading-spinner" :class="spinnerClass">
    <div class="spinner-icon">
      <svg viewBox="0 0 50 50" class="spinner-svg">
        <circle 
          cx="25" 
          cy="25" 
          r="20" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="4" 
          stroke-linecap="round" 
          stroke-dasharray="31.416" 
          stroke-dashoffset="31.416"
          class="spinner-circle"
        >
          <animate 
            attributeName="stroke-dasharray" 
            dur="2s" 
            values="0 31.416;15.708 15.708;0 31.416" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="stroke-dashoffset" 
            dur="2s" 
            values="0;-15.708;-31.416" 
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LoadingSpinnerProps } from '../types/state-types'

const props = withDefaults(defineProps<LoadingSpinnerProps>(), {
  size: 'md',
  color: 'primary'
})

const spinnerClass = computed(() => [
  `loading-spinner--${props.size}`,
  `loading-spinner--${props.color}`
])
</script>

<style scoped lang="scss">
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  
  &--sm {
    .spinner-icon {
      width: 24px;
      height: 24px;
    }
    .loading-message {
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
  }
  
  &--md {
    .spinner-icon {
      width: 32px;
      height: 32px;
    }
    .loading-message {
      font-size: 1rem;
      margin-top: 0.75rem;
    }
  }
  
  &--lg {
    .spinner-icon {
      width: 48px;
      height: 48px;
    }
    .loading-message {
      font-size: 1.125rem;
      margin-top: 1rem;
    }
  }
  
  &--primary .spinner-icon {
    color: var(--color-primary, #007bff);
  }
  
  &--secondary .spinner-icon {
    color: var(--color-secondary, #6c757d);
  }
  
  &--accent .spinner-icon {
    color: var(--color-accent, #28a745);
  }
}

.spinner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-svg {
  width: 100%;
  height: 100%;
  animation: rotate 2s linear infinite;
}

.loading-message {
  text-align: center;
  color: var(--color-text-secondary, #6c757d);
  margin: 0;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .loading-message {
    color: var(--color-text-secondary-dark, #adb5bd);
  }
}
</style>
