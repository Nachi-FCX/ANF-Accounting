<template>
  <div class="error-state error-state--network">
    <div class="error-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 9V15M12 15L9 12M12 15L15 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
      </svg>
    </div>
    <h3 class="error-title">Connection Error</h3>
    <p class="error-message">
      {{ customMessage || 'Unable to connect to the server. Please check your internet connection.' }}
    </p>
    <div v-if="retryCount > 0" class="retry-info">
      <p>Retry attempt: {{ retryCount }}/{{ maxRetries }}</p>
      <div v-if="retryDelay > 0" class="retry-countdown">
        Retrying in {{ countdown }} seconds...
      </div>
    </div>
    <div class="error-actions" v-if="showActions">
      <button 
        v-if="showRetry" 
        @click="handleRetry" 
        class="btn btn-primary"
        type="button"
        :disabled="isRetrying"
      >
        {{ isRetrying ? 'Retrying...' : 'Try Again' }}
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ErrorComponentProps } from '../types/state-types'

interface NetworkErrorProps extends ErrorComponentProps {
  retryDelay?: number
  maxRetries?: number
}

const props = withDefaults(defineProps<NetworkErrorProps>(), {
  showRetry: true,
  showActions: true,
  retryDelay: 5,
  maxRetries: 3
})

const emit = defineEmits<{
  retry: []
}>()

const router = useRouter()
const retryCount = ref(0)
const countdown = ref(0)
const isRetrying = ref(false)
let countdownInterval: number | null = null

const handleRetry = () => {
  if (retryCount.value >= props.maxRetries) {
    return
  }
  
  retryCount.value++
  isRetrying.value = true
  
  if (props.retryDelay > 0) {
    countdown.value = props.retryDelay
    countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownInterval!)
        isRetrying.value = false
        emit('retry')
      }
    }, 1000)
  } else {
    isRetrying.value = false
    emit('retry')
  }
}

const goHome = () => {
  router.push('/')
}

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
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
  
  &--network {
    .error-icon {
      color: #f59e0b; // Orange for network issues
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

.retry-info {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--color-background-secondary, #f7fafc);
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
  
  p {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #4a5568);
  }
  
  .retry-countdown {
    font-size: 0.875rem;
    color: #f59e0b;
    font-weight: 500;
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.btn-primary {
    background: var(--color-primary, #3b82f6);
    color: white;
    
    &:hover:not(:disabled) {
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
  
  .retry-info {
    background: var(--color-background-secondary-dark, #2d3748);
    
    p {
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
