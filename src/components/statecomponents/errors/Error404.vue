<template>
  <div class="error-state error-state--404">
    <div class="error-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 8L13 13M13 8L8 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
      </svg>
    </div>
    <h3 class="error-title">Page Not Found</h3>
    <p class="error-message">
      {{ customMessage || "The page you're looking for doesn't exist or has been moved." }}
    </p>
    <div class="error-actions" v-if="showActions">
      <button 
        @click="goHome" 
        class="btn btn-primary"
        type="button"
      >
        Go Home
      </button>
      <button 
        @click="goBack" 
        class="btn btn-outline"
        type="button"
      >
        Go Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { ErrorComponentProps } from '../types/state-types'

const props = withDefaults(defineProps<ErrorComponentProps>(), {
  showActions: true
})

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
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
  
  &--404 {
    .error-icon {
      color: #6366f1; // Purple for not found
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
  
  .btn.btn-outline {
    color: var(--color-text-primary-dark, #f7fafc);
    border-color: var(--color-border-dark, #4a5568);
    
    &:hover {
      background: var(--color-background-secondary-dark, #2d3748);
    }
  }
}
</style>
