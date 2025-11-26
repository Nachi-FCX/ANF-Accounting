<template>
  <div class="success-state">
    <div class="success-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h3 class="success-title">{{ title || 'Success!' }}</h3>
    <p class="success-message">{{ message }}</p>
    <div v-if="showActions" class="success-actions">
      <button 
        v-if="primaryAction" 
        @click="$emit('primary-action')" 
        class="btn btn-primary"
        type="button"
      >
        {{ primaryAction }}
      </button>
      <button 
        v-if="secondaryAction" 
        @click="$emit('secondary-action')" 
        class="btn btn-outline"
        type="button"
      >
        {{ secondaryAction }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SuccessComponentProps } from '../types/state-types'

const props = withDefaults(defineProps<SuccessComponentProps>(), {
  showActions: true
})

const emit = defineEmits<{
  'primary-action': []
  'secondary-action': []
}>()
</script>

<style scoped lang="scss">
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981; // Green for success
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.success-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-success, #10b981);
}

.success-message {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: var(--color-text-secondary, #4a5568);
}

.success-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease-in-out;
  
  &.btn-primary {
    background: var(--color-primary, #3b82f6);
    color: white;
    
    &:hover {
      background: var(--color-primary-dark, #2563eb);
    }
  }
  
  &.btn-outline {
    background: transparent;
    color: var(--color-text-primary, #1a202c);
    border: 1px solid var(--color-border, #e2e8f0);
    
    &:hover {
      background: var(--color-background-secondary, #f7fafc);
    }
  }
}

/* Animation */
.success-state {
  animation: successFadeIn 0.5s ease-in-out;
}

.success-icon {
  animation: successBounce 0.6s ease-in-out;
}

@keyframes successFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes successBounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .success-title {
    color: var(--color-success-dark, #34d399);
  }
  
  .success-message {
    color: var(--color-text-secondary-dark, #a0aec0);
  }
  
  .btn.btn-outline {
    color: var(--color-text-primary-dark, #f7fafc);
    border-color: var(--color-border-dark, #4a5568);
    
    &:hover {
      background: var(--color-background-secondary-dark, #2d3748);
    }
  }
}
</style>
