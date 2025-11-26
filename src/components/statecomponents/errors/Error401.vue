<template>
  <div class="error-state error-state--401">
    <div class="error-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" stroke-width="2"/>
        <path d="M12 1V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 21V23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M1 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M21 12H23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <h3 class="error-title">Authentication Required</h3>
    <p class="error-message">
      {{ customMessage || 'You need to sign in to access this resource.' }}
    </p>
    <div class="error-actions" v-if="showActions">
      <button 
        @click="handleSignIn" 
        class="btn btn-primary"
        type="button"
      >
        Sign In
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
import { useRouter, useRoute } from 'vue-router'
import type { ErrorComponentProps } from '../types/state-types'

const props = withDefaults(defineProps<ErrorComponentProps>(), {
  showHome: true,
  showActions: true
})

const router = useRouter()
const route = useRoute()

const handleSignIn = () => {
  const redirect = props.redirectAfterAuth || route.fullPath
  router.push(`/signin?redirect=${encodeURIComponent(redirect)}`)
}

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
  
  &--401 {
    .error-icon {
      color: #dc2626; // Red for unauthorized
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
