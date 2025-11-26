<template>
  <div class="social-login-buttons" :class="`layout-${layout}`">
    <button
      v-for="provider in providers"
      :key="provider"
      @click="handleSocialLogin(provider)"
      :class="`social-btn social-btn-${provider}`"
      :disabled="loading === provider"
      type="button"
    >
      <LoadingSpinner v-if="loading === provider" size="sm" />
      <i v-else :class="getProviderIcon(provider)"></i>
      <span v-if="showLabels" class="provider-label">{{ getProviderLabel(provider) }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { LoadingSpinner } from '@/components/statecomponents'
import type { SocialProvider } from '../types/auth-types'
import { SOCIAL_PROVIDERS } from '../constants/auth-constants'

interface Props {
  providers: SocialProvider[]
  layout?: 'horizontal' | 'grid' | 'vertical'
  showLabels?: boolean
  loading?: SocialProvider | null
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'horizontal',
  showLabels: false,
  loading: null
})

const emit = defineEmits<{
  'social-login': [provider: SocialProvider]
}>()

const getProviderIcon = (provider: SocialProvider): string => {
  return SOCIAL_PROVIDERS[provider.toUpperCase() as keyof typeof SOCIAL_PROVIDERS]?.icon || 'pi pi-sign-in'
}

const getProviderLabel = (provider: SocialProvider): string => {
  return SOCIAL_PROVIDERS[provider.toUpperCase() as keyof typeof SOCIAL_PROVIDERS]?.name || provider
}

const getProviderColor = (provider: SocialProvider): string => {
  return SOCIAL_PROVIDERS[provider.toUpperCase() as keyof typeof SOCIAL_PROVIDERS]?.color || '#6b7280'
}

const handleSocialLogin = (provider: SocialProvider) => {
  emit('social-login', provider)
}
</script>

<style scoped lang="scss">
.social-login-buttons {
  display: flex;
  gap: 0.75rem;

  &.layout-horizontal {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  &.layout-vertical {
    flex-direction: column;
  }

  &.layout-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
    gap: 0.75rem;
    max-width: 300px;
    margin: 0 auto;
  }

  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    min-height: 44px;

    &:hover:not(:disabled) {
      border-color: #9ca3af;
      background: #f9fafb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    i {
      font-size: 1.125rem;
    }

    .provider-label {
      white-space: nowrap;
    }

    // Provider-specific styling - simplified
    &.social-btn-google {
      i { color: #ea4335; }
      &:hover:not(:disabled) {
        border-color: #ea4335;
        background: rgba(234, 67, 53, 0.05);
      }
    }

    &.social-btn-linkedin {
      i { color: #0a66c2; }
      &:hover:not(:disabled) {
        border-color: #0a66c2;
        background: rgba(10, 102, 194, 0.05);
      }
    }

    &.social-btn-apple {
      i { color: #000; }
      &:hover:not(:disabled) {
        border-color: #000;
        background: rgba(0, 0, 0, 0.05);
      }
    }

    &.social-btn-facebook {
      i { color: #1877f2; }
      &:hover:not(:disabled) {
        border-color: #1877f2;
        background: rgba(24, 119, 242, 0.05);
      }
    }

    &.social-btn-microsoft {
      i { color: #00a1f1; }
      &:hover:not(:disabled) {
        border-color: #00a1f1;
        background: rgba(0, 161, 241, 0.05);
      }
    }

    &.social-btn-twitter {
      i { color: #1da1f2; }
      &:hover:not(:disabled) {
        border-color: #1da1f2;
        background: rgba(29, 161, 242, 0.05);
      }
    }

    &.social-btn-yahoo {
      i { color: #720e9e; }
      &:hover:not(:disabled) {
        border-color: #720e9e;
        background: rgba(114, 14, 158, 0.05);
      }
    }
  }

  // Layout-specific adjustments
  &.layout-horizontal .social-btn {
    flex: 1;
    min-width: 120px;
    max-width: 160px;
  }

  &.layout-vertical .social-btn {
    width: 100%;
    justify-content: flex-start;
    padding: 1rem;
  }

  &.layout-grid .social-btn {
    aspect-ratio: 1;
    padding: 0.5rem;
    
    .provider-label {
      display: none;
    }
  }

  // Responsive design
  @media (max-width: 768px) {
    &.layout-horizontal {
      flex-direction: column;
      
      .social-btn {
        width: 100%;
        max-width: none;
      }
    }

    &.layout-grid {
      grid-template-columns: repeat(4, 1fr);
      max-width: 240px;
    }
  }

  @media (max-width: 480px) {
    gap: 0.5rem;

    .social-btn {
      padding: 0.625rem;
      font-size: 0.8rem;

      i {
        font-size: 1.1rem;
      }
    }

    &.layout-grid {
      grid-template-columns: repeat(3, 1fr);
      max-width: 180px;
    }
  }
}

// Enhanced dark mode support
@media (prefers-color-scheme: dark) {
  .social-login-buttons .social-btn {
    background: #1e293b;
    border-color: #475569;
    color: #f1f5f9;

    &::before {
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    }

    &:hover:not(:disabled) {
      background: #334155;
      border-color: #64748b;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    // Dark mode provider-specific adjustments
    &.social-btn-google:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(234, 67, 53, 0.1) 0%, rgba(234, 67, 53, 0.05) 100%);
    }

    &.social-btn-linkedin:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(10, 102, 194, 0.1) 0%, rgba(10, 102, 194, 0.05) 100%);
    }

    &.social-btn-apple:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    }

    &.social-btn-facebook:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(24, 119, 242, 0.1) 0%, rgba(24, 119, 242, 0.05) 100%);
    }

    &.social-btn-microsoft:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(0, 161, 241, 0.1) 0%, rgba(0, 161, 241, 0.05) 100%);
    }

    &.social-btn-twitter:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(29, 161, 242, 0.1) 0%, rgba(29, 161, 242, 0.05) 100%);
    }

    &.social-btn-yahoo:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(114, 14, 158, 0.1) 0%, rgba(114, 14, 158, 0.05) 100%);
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .social-login-buttons .social-btn {
    border-width: 3px;
    
    &:hover:not(:disabled) {
      border-width: 3px;
    }

    &:focus {
      outline: 3px solid #4f46e5;
      outline-offset: 2px;
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .social-login-buttons .social-btn {
    transition: background-color 0.2s ease, border-color 0.2s ease;
    
    &::before {
      display: none;
    }
    
    &:hover:not(:disabled) {
      transform: none;
    }

    &:active:not(:disabled) {
      transform: none;
    }

    i {
      transition: none;

      &:hover {
        transform: none;
      }
    }
  }
}

// Focus styles for accessibility
.social-login-buttons .social-btn:focus {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

// Loading state enhancements
.social-login-buttons .social-btn:disabled {
  position: relative;
  
  &.loading {
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid #e2e8f0;
      border-top: 2px solid #4f46e5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

// Print styles
@media print {
  .social-login-buttons {
    display: none;
  }
}
</style>
