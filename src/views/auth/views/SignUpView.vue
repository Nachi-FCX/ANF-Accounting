<template>
  <AuthLayoutCentered>
    <div class="signup-view">
      <!-- Dynamic content based on auth step -->
      <transition name="slide-fade" mode="out-in">
        <SignUpForm 
          v-if="authStore.authStep === 'idle' || authStore.authStep === 'email-input'"
          key="signup-form"
        />
        <OtpVerificationForm 
          v-else-if="authStore.authStep === 'otp-verification'"
          key="otp-form"
        />
        <GSTINVerificationForm 
          v-else-if="authStore.authStep === 'gstin-verification'"
          key="gstin-form"
        />
     
      </transition>
    </div>
  </AuthLayoutCentered>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayoutCentered from '../components/AuthLayoutCentered.vue'
import SignUpForm from '../components/SignUpForm.vue'
import OtpVerificationForm from '../components/OtpVerificationForm.vue'
import GSTINVerificationForm from '../components/GSTINVerificationForm.vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

// Clear state when SignUp page loads (only if not in an active signup flow)
onMounted(() => {
  // Only reset if we're not in the middle of a signup flow
  if (authStore.authStep === 'success' || authStore.authStep === 'profile-completion') {
    authStore.resetAuthFlow()
  }
  
  // Clear any error/success states but preserve signup data if it exists
  authStore.clearStates()
})

// Computed properties
const currentStep = computed(() => {
  switch (authStore.authStep) {
    case 'idle':
    case 'email-input':
      return 1
    case 'otp-verification':
      return 2
    case 'gstin-verification':
      return 3
    case 'success':
      return 4
    default:
      return 1
  }
})

// Watch for successful authentication and navigate to dashboard
watch(() => authStore.authStep, (currentStep) => {
  if (currentStep === 'success' && authStore.isAuthenticated) {
    // 2 second delay to show success message
    setTimeout(() => {
      const redirectPath = router.currentRoute.value.query.redirect as string
      if (redirectPath) {
        router.push(redirectPath)
      } else {
        router.push('/dashboard')
      }
    }, 2000)
  }
}, { immediate: true })

// Methods
const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped lang="scss">
.signup-view {
  width: 100%;
  max-width: 100%;
  padding: 0;
  min-height: auto;

  .success-view {
    text-align: center;
    padding: 3rem 0;
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.02) 0%, rgba(16, 185, 129, 0.02) 100%);
    border-radius: 16px;
    margin: 1rem 0;

    .success-icon {
      width: 96px;
      height: 96px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2.5rem auto;
      box-shadow: 0 12px 32px rgba(16, 185, 129, 0.3);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
        animation: shimmer 2s infinite;
      }

      i {
        font-size: 3rem;
        color: white;
        z-index: 1;
        position: relative;
      }
    }

    h2 {
      font-size: 2.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 1.5rem 0;
      letter-spacing: -0.025em;
    }

    p {
      font-size: 1.125rem;
      color: #64748b;
      line-height: 1.7;
      margin: 0 0 3rem 0;
      max-width: 450px;
      margin-left: auto;
      margin-right: auto;
    }

    .get-started-btn {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white;
      border: none;
      padding: 1.25rem 2.5rem;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 auto;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }

      &:hover {
        background: linear-gradient(135deg, #4338ca 0%, #5b21b6 100%);
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(79, 70, 229, 0.4);

        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(0);
      }

      i {
        font-size: 1rem;
        transition: transform 0.3s ease;
      }

      &:hover i {
        transform: translateX(2px);
      }
    }

    @media (max-width: 768px) {
      padding: 2.5rem 1rem;

      .success-icon {
        width: 80px;
        height: 80px;

        i {
          font-size: 2.5rem;
        }
      }

      h2 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }

      .get-started-btn {
        padding: 1rem 2rem;
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      padding: 2rem 0.5rem;

      .success-icon {
        width: 72px;
        height: 72px;

        i {
          font-size: 2.25rem;
        }
      }

      h2 {
        font-size: 1.75rem;
      }

      p {
        font-size: 0.95rem;
      }

      .get-started-btn {
        padding: 0.875rem 1.75rem;
        font-size: 0.95rem;
      }
    }
  }
}

// Enhanced animations
@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

// Transitions with improved easing
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(24px) scale(0.98);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-24px) scale(0.98);
}

// Dark mode enhancements
@media (prefers-color-scheme: dark) {
  .signup-view {
    .success-view {
      background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);

      h2 {
        background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      p {
        color: #94a3b8;
      }
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .signup-view {
    .success-view .get-started-btn {
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .signup-view {
    .success-view {
      .success-icon::before {
        animation: none;
      }

      .get-started-btn {
        transition: background-color 0.2s ease;

        &:hover {
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
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: none;
  }

  @keyframes shimmer {
    0%, 100% {
      transform: none;
    }
  }
}

// Focus styles for accessibility
.signup-view {
  .success-view .get-started-btn:focus {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
}
</style>
