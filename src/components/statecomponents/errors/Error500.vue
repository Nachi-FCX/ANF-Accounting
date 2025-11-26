<template>
  <div class="error-state error-state--500">
    <div class="error-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
        <path d="M8 12L10 14L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
      </svg>
    </div>
    <h3 class="error-title">Server Error</h3>
    <p class="error-message">
      {{ customMessage || 'Something went wrong on our end. Please try again later.' }}
    </p>
    <div v-if="showContact" class="error-contact">
      <p>If the problem persists, please contact support:</p>
      <a href="mailto:support@fincorpx.com" class="contact-link">
        support@fincorpx.com
      </a>
    </div>
    <div v-if="errorId" class="error-id">
      <p>Error ID: <code>{{ errorId }}</code></p>
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
  showContact: true,
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
  
  &--500 {
    .error-icon {
      color: #dc2626; // Red for server error
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

.error-contact {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--color-background-secondary, #f7fafc);
  border-radius: 8px;
  border-left: 4px solid var(--color-primary, #3b82f6);
  
  p {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #4a5568);
  }
  
  .contact-link {
    color: var(--color-primary, #3b82f6);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.error-id {
  margin-bottom: 2rem;
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #4a5568);
  }
  
  code {
    background: var(--color-background-secondary, #f7fafc);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.75rem;
    color: var(--color-text-primary, #1a202c);
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
  
  .error-contact {
    background: var(--color-background-secondary-dark, #2d3748);
    
    p {
      color: var(--color-text-secondary-dark, #a0aec0);
    }
  }
  
  .error-id {
    p {
      color: var(--color-text-secondary-dark, #a0aec0);
    }
    
    code {
      background: var(--color-background-secondary-dark, #2d3748);
      color: var(--color-text-primary-dark, #f7fafc);
    }
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
