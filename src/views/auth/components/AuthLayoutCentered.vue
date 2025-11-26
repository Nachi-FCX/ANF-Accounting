<template>
  <div class="auth-layout-centered">
    <div class="auth-container">
      <div class="brand-header">
        <router-link to="/" class="brand-logo">
          <!-- <img src="@/assets/img/mainasset/fcxlogo.png" alt="FinCorpX" /> -->
          <img src="@/assets/img/mainasset/fcxname.svg" alt="FinCorpX" class="brand-name" />
        </router-link>
      </div>
      
      <StateWrapper
        :loading="authStore.isLoading"
        :loading-message="(authStore.loading as any)?.message"
        :error="authStore.error"
        :success="authStore.success"
        @retry="handleRetry"
        @success-primary="handleSuccessAction"
      >
        <slot />
      </StateWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useTheme } from '@/composables/useTheme'

const authStore = useAuthStore()
const router = useRouter()
const { forceTheme } = useTheme()

// Force light theme when this component mounts
onMounted(() => {
  forceTheme('light')
})

// Restore normal theme behavior when component unmounts
onUnmounted(() => {
  forceTheme(null)
})

// Methods
const handleRetry = () => {
  // Clear error state
  authStore.clearStates()
}

const handleSuccessAction = () => {
  // Handle success action (e.g., redirect to dashboard)
  if (authStore.success?.redirectUrl) {
    router.push(authStore.success.redirectUrl)
  } else if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
}
</script>

<style scoped lang="scss">
.auth-layout-centered {
  min-height: 100vh;
 // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/patterns/dots.svg') repeat;
    opacity: 0.1;
    z-index: 1;
  }

  .auth-container {
    width: 100%;
    max-width: 430px;
    background: white;
    border-radius: 12px;
    padding: 1.75rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 2;

    .brand-header {
      text-align: center;
      margin-bottom: 1.25rem;

      .brand-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        text-decoration: none;
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-1px);
        }

        img {
          height: 40px;
          width: auto;

          &.brand-name {
            height: 32px;
          }
        }
      }
    }

    @media (max-width: 768px) {
      padding: 2rem;
      border-radius: 12px;
      max-width: 420px;
    }

    @media (max-width: 480px) {
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1rem;
      max-width: none;

      .brand-header .brand-logo img {
        height: 32px;

        &.brand-name {
          height: 24px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
}

// Force light theme for authentication pages - no automatic dark mode
.auth-layout-centered .auth-container {
  background: white !important;
  color: #1a1a1a !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
}

// High contrast mode
@media (prefers-contrast: high) {
  .auth-layout-centered .auth-container {
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .auth-layout-centered .auth-container .brand-header .brand-logo {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}

// Print styles
@media print {
  .auth-layout-centered {
    background: white;
    min-height: auto;

    .auth-container {
      background: white;
      box-shadow: none;
      border: 1px solid #000;
    }
  }
}
</style>
