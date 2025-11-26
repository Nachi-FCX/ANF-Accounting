<template>
  <div class="error-state error-state--generic">
    <div class="error-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h3 class="error-title">{{ getErrorTitle() }}</h3>
    <p class="error-message">
      {{ customMessage || error?.message || 'An unexpected error occurred. Please try again.' }}
    </p>
    <div v-if="error?.code" class="error-code">
      <p>Error Code: <code>{{ error.code }}</code></p>
    </div>
    <div v-if="error?.details && error.details.length > 0" class="error-details">
      <details>
        <summary>Error Details</summary>
        <ul>
          <li v-for="detail in error.details" :key="detail">{{ detail }}</li>
        </ul>
      </details>
    </div>
    <div class="error-actions" v-if="showActions">
      <button 
        v-if="showRetry && isRetryable()" 
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
import type { ErrorComponentProps, ErrorState } from '../types/state-types'

interface GenericErrorProps extends ErrorComponentProps {
  error?: ErrorState
}

const props = withDefaults(defineProps<GenericErrorProps>(), {
  showRetry: true,
  showActions: true
})

const emit = defineEmits<{
  retry: []
}>()

const router = useRouter()

const getErrorTitle = () => {
  if (!props.error) return 'Error'
  
  switch (props.error.status) {
    case 400: return 'Bad Request'
    case 401: return 'Unauthorized'
    case 403: return 'Forbidden'
    case 404: return 'Not Found'
    case 500: return 'Server Error'
    default: return props.error.type === 'network' ? 'Network Error' : 'Error'
  }
}

const isRetryable = () => {
  if (!props.error) return true
  
  const nonRetryableStatuses = [401, 403, 404]
  return !nonRetryableStatuses.includes(props.error.status || 0)
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
  
  &--generic {
    .error-icon {
      color: #6b7280; // Gray for generic errors
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

.error-code {
  margin-bottom: 1.5rem;
  
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

.error-details {
  margin-bottom: 2rem;
  text-align: left;
  width: 100%;
  
  details {
    background: var(--color-background-secondary, #f7fafc);
    border-radius: 8px;
    padding: 1rem;
  }
  
  summary {
    cursor: pointer;
    font-weight: 500;
    color: var(--color-text-primary, #1a202c);
    margin-bottom: 0.5rem;
    
    &:hover {
      color: var(--color-primary, #3b82f6);
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0 0;
  }
  
  li {
    padding: 0.25rem 0;
    color: var(--color-text-secondary, #4a5568);
    font-size: 0.875rem;
    
    &:before {
      content: "•";
      color: #6b7280;
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
  
  .error-code {
    p {
      color: var(--color-text-secondary-dark, #a0aec0);
    }
    
    code {
      background: var(--color-background-secondary-dark, #2d3748);
      color: var(--color-text-primary-dark, #f7fafc);
    }
  }
  
  .error-details {
    details {
      background: var(--color-background-secondary-dark, #2d3748);
    }
    
    summary {
      color: var(--color-text-primary-dark, #f7fafc);
    }
    
    li {
      color: var(--color-text-secondary-dark, #a0aec0);
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
