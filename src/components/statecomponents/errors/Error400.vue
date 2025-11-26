<template>
  <div class="error-state error-state--400">
    <div class="error-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h3 class="error-title">Bad Request</h3>
    <p class="error-message">
      {{ customMessage || 'The request contains invalid data. Please check your input and try again.' }}
    </p>
    <div v-if="details && details.length > 0" class="error-details">
      <ul>
        <li v-for="detail in details" :key="detail">{{ detail }}</li>
      </ul>
    </div>
    <div class="error-actions" v-if="showActions">
      <button 
        v-if="showRetry" 
        @click="$emit('retry')" 
        class="btn btn-primary"
        type="button"
      >
        Try Again
      </button>
      <button 
        v-if="showHome" 
        @click="goHome" 
        class="btn btn-outline"
        type="button"
      >
        Go Home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { ErrorComponentProps } from '../types/state-types'

const props = withDefaults(defineProps<ErrorComponentProps>(), {
  showRetry: true,
  showHome: false,
  showActions: true
})

const emit = defineEmits<{
  retry: []
}>()

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  max-width: 500px;
  margin: 0 auto;
  
  &--400 {
    .error-icon {
      color: #f59e0b; // Warning yellow
    }
  }
}

.error-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text-primary, #1a202c);
}

.error-message {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: var(--color-text-secondary, #4a5568);
}

.error-details {
  margin-bottom: 2rem;
  text-align: left;
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    background: var(--color-background-secondary, #f7fafc);
    border-radius: 8px;
    padding: 1rem;
  }
  
  li {
    padding: 0.25rem 0;
    color: var(--color-text-secondary, #4a5568);
    font-size: 0.875rem;
    
    &:before {
      content: "•";
      color: #f59e0b;
      margin-right: 0.5rem;
    }
  }
}

.error-actions {
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

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .error-title {
    color: var(--color-text-primary-dark, #f7fafc);
  }
  
  .error-message {
    color: var(--color-text-secondary-dark, #a0aec0);
  }
  
  .error-details ul {
    background: var(--color-background-secondary-dark, #2d3748);
  }
  
  .error-details li {
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
