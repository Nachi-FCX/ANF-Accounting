<template>
  <div class="empty-state">
    <div class="empty-icon">
      <svg v-if="!icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 7H6C4.89543 7 4 7.89543 4 9V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V9C20 7.89543 19.1046 7 18 7H15M9 7V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7M9 7H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 11V17M9 14H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
      </svg>
      <img v-else :src="icon" :alt="title || 'Empty'" />
    </div>
    <h3 class="empty-title">{{ title || 'No Data Available' }}</h3>
    <p class="empty-message">{{ message }}</p>
    <div v-if="showAction && actionText" class="empty-actions">
      <button 
        @click="$emit('action')" 
        class="btn btn-primary"
        type="button"
      >
        {{ actionText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmptyStateProps } from '../types/state-types'

const props = withDefaults(defineProps<EmptyStateProps>(), {
  showAction: false,
  showActions: true
})

const emit = defineEmits<{
  action: []
}>()
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af; // Light gray for empty state
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.6;
  }
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text-primary, #1a202c);
}

.empty-message {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: var(--color-text-secondary, #4a5568);
  max-width: 400px;
}

.empty-actions {
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
}

/* Animation */
.empty-state {
  animation: emptyFadeIn 0.5s ease-in-out;
}

.empty-icon {
  animation: emptyFloat 3s ease-in-out infinite;
}

@keyframes emptyFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes emptyFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .empty-title {
    color: var(--color-text-primary-dark, #f7fafc);
  }
  
  .empty-message {
    color: var(--color-text-secondary-dark, #a0aec0);
  }
  
  .empty-icon {
    color: var(--color-text-tertiary-dark, #718096);
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .empty-state {
    padding: 3rem 1rem;
  }
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 1.5rem;
  }
  
  .empty-title {
    font-size: 1.125rem;
  }
  
  .empty-message {
    font-size: 0.875rem;
  }
}
</style>
