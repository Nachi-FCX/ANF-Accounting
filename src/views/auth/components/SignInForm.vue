<template>
  <div class="signin-form auth-form-base">
    <div class="form-header">
      <h2>Welcome back</h2>
      <p class="form-subtitle">Sign in to your FinCorpX account</p>
    </div>
    
    <form @submit.prevent="handleSignIn" class="form-content">
      <!-- Email/Mobile Input -->
      <FcxInputtext
        name="emailOrMobile"
        label="Email or Mobile"
        placeholder="Enter your email or mobile number"
        autocomplete="username"
        required
        v-model="formData.emailOrMobile"
        class="form-group"
      />

      <!-- Password Input -->
      <div class="form-group">
        <div class="password-header">
          <span class="password-label">Password</span>
          <router-link to="/auth/forgot-password" class="forgot-link">
            Forgot password?
          </router-link>
        </div>
        <FcxPassword
          name="password"
          placeholder="Enter your password"
          autocomplete="current-password"
          required
          :toggle-mask="true"
          :show-strength="false"
          v-model="formData.password"
        />
      </div>

      <!-- Remember Me -->
      <FcxCheckbox
        name="rememberMe"
        label="Remember me for 30 days"
        :binary="true"
        v-model="formData.rememberMe"
        class="form-group checkbox-group"
      />

      <!-- Submit Button -->
      <FcxButton
        type="submit"
        label="Sign In"
        severity="primary"
        size="large"
        :block="true"
        :loading="isLoading"
        :disabled="!isFormValid || isLoading"
        class="submit-btn"
      />
      
      <!-- Social Login Section -->
      <div class="social-section">
        <div class="divider">
          <span>or continue with</span>
        </div>
        <SocialLoginButtons 
          :providers="['google', 'linkedin', 'apple']"
          layout="horizontal"
          :show-labels="false"
          @social-login="handleSocialSignIn"
        />
      </div>
      
      <!-- Sign up link -->
      <div class="auth-link">
        <p>Don't have an account? 
          <router-link to="/auth/signup" class="link">Create account</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import SocialLoginButtons from './SocialLoginButtons.vue'
import type { SignInFormData, SocialProvider } from '../types/auth-types'
import { STORAGE_KEYS } from '../constants/auth-constants'

const authStore = useAuthStore()
const router = useRouter()

// Form data
const formData = ref<SignInFormData>({
  emailOrMobile: '',
  password: '',
  rememberMe: false
})

// Computed properties
const isLoading = computed(() => authStore.isLoading)
const isFormValid = computed(() => {
  return formData.value.emailOrMobile && formData.value.password
})

// Methods
const handleSignIn = async () => {
  try {
    // Basic validation - Fcx components handle detailed validation
    if (!isFormValid.value) {
      return
    }
    
    const result = await authStore.signIn(formData.value)
    
    if (result.success) {
      if (result.emailVerificationRequired) {
        // Email verification is required - set up OTP verification
        
        // First clear any existing states
        authStore.clearStates()
        
        // Set up OTP verification state
        authStore.setOtpVerificationState({
          isVerifying: false,
          verificationMethod: 'email',
          contactInfo: formData.value.emailOrMobile,
          verificationId: 'manual-email-verification',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          canResend: true,
          resendCooldown: 0,
          attemptsRemaining: 3
        })
        
        // Clear signup data to indicate this is signin flow
        authStore.setSignupFormData(null)
        
        // Set auth step to OTP verification
        authStore.setAuthStep('otp-verification')
      } else {
        // Email is verified - proceed to dashboard
        setTimeout(() => {
          // Check if there's a redirect query parameter
          const redirectPath = router.currentRoute.value.query.redirect as string
          if (redirectPath) {
            router.push(redirectPath)
          } else {
            router.push('/dashboard')
          }
        }, 1500) // 1.5 seconds to show the welcome message
      }
    }
  } catch (error) {
    console.error('Sign in error:', error)
  }
}

const handleSocialSignIn = async (provider: SocialProvider) => {
  try {
    const result = await authStore.signInWithSocial(provider)
    
    if (result.success) {
      // Wait a moment to show the success message, then redirect
      setTimeout(() => {
        // Check if there's a redirect query parameter
        const redirectPath = router.currentRoute.value.query.redirect as string
        if (redirectPath) {
          router.push(redirectPath)
        } else {
          router.push('/dashboard')
        }
      }, 1500) // 1.5 seconds to show the welcome message
    }
  } catch (error) {
    console.error('Social sign in error:', error)
  }
}

// Initialize form with remembered data
onMounted(() => {
  const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
  const lastEmail = localStorage.getItem(STORAGE_KEYS.LAST_EMAIL)
  
  if (rememberMe && lastEmail) {
    formData.value.emailOrMobile = lastEmail
    formData.value.rememberMe = true
  }
})
</script>

<style scoped lang="scss">
@use '../styles/auth-form-common' as *;

.signin-form {
  // SignIn-specific styles only
  .form-content {
    .password-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      
      .password-label {
        font-size: 0.8rem;
        font-weight: 500;
        color: #374151;
      }
      
      .forgot-link {
        font-size: 0.8rem;
        color: #4f46e5;
        text-decoration: none;
        font-weight: 500;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// Responsive design for SignIn-specific elements
@media (max-width: 480px) {
  .signin-form {
    .form-content {
      .password-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
    }
  }
}

// Dark mode support for SignIn-specific elements
@media (prefers-color-scheme: dark) {
  .signin-form {
    .form-content {
      .password-header {
        .password-label {
          color: #d1d5db;
        }
      }
    }
  }
}
</style>
