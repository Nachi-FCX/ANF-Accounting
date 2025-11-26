<template>
  <div class="otp-verification-form auth-form-base">
    <div class="form-header">
      <h2>{{ getVerificationTitle() }}</h2>
      <p class="form-subtitle">
        {{ getVerificationSubtitle() }}
      </p>
    </div>
    
    <form @submit.prevent="handleVerifyOtp" class="form-content">
      <!-- Editable Contact Info Field -->
      <FcxInputtext
        name="contactInfo"
        :label="getContactInfoLabel()"
        :model-value="editableContactInfo"
        @update:model-value="handleContactInfoChange"
        :required="true"
        :disabled="isVerifying"
        :placeholder="getContactInfoPlaceholder()"
        class="form-group contact-info-field"
      />
      <!-- OTP Input Field -->
      <FcxOtp
        name="otpCode"
        label="Enter verification code"
        :length="OTP_CONFIG.LENGTH"
        :model-value="otpCode"
        @update:model-value="handleOtpInput"
        @complete="handleOtpComplete"
        :error="showValidationError ? authStore.error?.message : undefined"
        :disabled="isVerifying"
        :auto-focus="true"
        :required="false"
        class="form-group"
      />

      <!-- Timer and Resend -->
      <div class="otp-timer-section">
        <div v-if="!otpVerification.canResend" class="timer">
          <i class="pi pi-clock"></i>
          <span>Resend code in {{ formatTime(otpVerification.resendCooldown) }}</span>
        </div>
        <FcxButton
          v-else
          type="button"
          label="Resend code"
          icon="pi pi-refresh"
          severity="secondary"
          variant="text"
          size="small"
          :loading="isResending"
          @click="handleResendOtp"
          class="resend-btn"
        />
      </div>

      <!-- Verify Button -->
      <FcxButton
        type="submit"
        :label="getSubmitButtonLabel()"
        severity="primary"
        size="large"
        :block="true"
        :loading="isVerifying"
        :disabled="!isOtpComplete || isVerifying"
        class="submit-btn"
      />

      <!-- Additional Info -->
      <div class="verification-info">
        <div class="info-item">
          <i class="pi pi-info-circle"></i>
          <span>Code expires in {{ formatTime(timeUntilExpiry) }}</span>
        </div>
        <div class="info-item">
          <i class="pi pi-shield"></i>
          <span>{{ otpVerification.attemptsRemaining }} attempts remaining</span>
        </div>
      </div>

      <!-- Back to previous step -->
      <div class="auth-link">
        <FcxButton
          type="button"
          :label="getBackButtonLabel()"
          icon="pi pi-arrow-left"
          severity="secondary"
          variant="text"
          size="small"
          @click="goBack"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { OTP_CONFIG } from '../constants/auth-constants'
import FcxOtp from '@/components/formcomponents/FcxOtp.vue'
import FcxButton from '@/components/buttoncomponents/FcxButton.vue'
import FcxInputtext from '@/components/formcomponents/FcxInputtext.vue'

const authStore = useAuthStore()
const router = useRouter()

// Reactive data
const otpCode = ref('')
const isResending = ref(false)
const hasAttemptedSubmit = ref(false)
const editableContactInfo = ref('')

// Computed properties
const otpVerification = computed(() => authStore.otpVerification)
const isVerifying = computed(() => authStore.loading?.authStep === 'verifying-otp')
const hasError = computed(() => authStore.hasError)
const isOtpComplete = computed(() => otpCode.value && otpCode.value.length === OTP_CONFIG.LENGTH)

// Only show validation errors after user has attempted to submit or after an API error
const showValidationError = computed(() => {
  return hasError.value && (hasAttemptedSubmit.value || authStore.error?.message)
})

const timeUntilExpiry = computed(() => {
  if (!otpVerification.value.expiresAt) return 0
  const now = new Date().getTime()
  const expiry = new Date(otpVerification.value.expiresAt).getTime()
  return Math.max(0, Math.floor((expiry - now) / 1000)) // seconds
})

// Determine if this is a signup flow based on signup form data
const isSignupFlow = computed(() => {
  return !!authStore.signupFormData
})

// Methods
const handleOtpInput = (value: string) => {
  otpCode.value = value
}

const handleOtpComplete = (completedValue: string) => {
  otpCode.value = completedValue
  // Auto-submit when complete
  if (completedValue && completedValue.length === OTP_CONFIG.LENGTH) {
    handleVerifyOtp()
  }
}

const handleVerifyOtp = async () => {
  if (!isOtpComplete.value) return
  
  try {
    // The auth store will determine the flow (signup vs signin) automatically
    await authStore.verifyOtp({
      otp: otpCode.value,
      verificationId: otpVerification.value.verificationId,
      method: otpVerification.value.verificationMethod,
      contactInfo: editableContactInfo.value || otpVerification.value.contactInfo
    })
    
    // Check if we should navigate immediately (for signin flow)
    if (authStore.isAuthenticated && !authStore.signupFormData) {
      setTimeout(() => {
        router.replace('/dashboard')
      }, 1000)
    }
    
  } catch (error) {
    console.error('❌ OTP Form - Verification failed:', error)
    // Clear OTP on error
    otpCode.value = ''
  }
}

const handleResendOtp = async () => {
  try {
    isResending.value = true
    await authStore.resendOtp()
    // Clear current OTP
    otpCode.value = ''
  } catch (error) {
    console.error('Resend OTP error:', error)
  } finally {
    isResending.value = false
  }
}

const goBack = () => {
  // Reset auth flow - this will clear any temporary data and go back to the initial step
  authStore.resetAuthFlow()
}

const handleContactInfoChange = (value: string) => {
  editableContactInfo.value = value
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getVerificationTitle = (): string => {
  // Determine the context based on the signup form data or previous auth step
  const signupData = authStore.signupFormData
  
  if (signupData) {
    // Coming from signup - verifying phone number (signup uses phone verification)
    return 'Verify your phone number'
  } else {
    // Coming from signin - verifying email (signin users need email verification)
    return 'Verify your email'
  }
}

const getVerificationSubtitle = (): string => {
  const signupData = authStore.signupFormData
  const method = otpVerification.value.verificationMethod
  
  if (signupData) {
    // Coming from signup - always phone verification
    return `We've sent an SMS verification code to your phone number`
  } else {
    // Coming from signin - email verification (user's email needs verification)
    return `We've sent a verification code to your email address`
  }
}

const getContactInfoLabel = (): string => {
  const signupData = authStore.signupFormData
  
  if (signupData) {
    // Coming from signup - phone verification
    return 'Phone Number'
  } else {
    // Coming from signin - email verification
    return 'Email Address'
  }
}

const getContactInfoPlaceholder = (): string => {
  const signupData = authStore.signupFormData
  
  if (signupData) {
    // Coming from signup - phone verification
    return 'Enter your phone number'
  } else {
    // Coming from signin - email verification
    return 'Enter your email address'
  }
}

const getSubmitButtonLabel = (): string => {
  const signupData = authStore.signupFormData
  
  if (signupData) {
    // Coming from signup
    return 'Verify Phone & Create Account'
  } else {
    // Coming from signin
    return 'Verify Email & Sign In'
  }
}

const getBackButtonLabel = (): string => {
  const signupData = authStore.signupFormData
  
  if (signupData) {
    // Coming from signup
    return 'Back to signup'
  } else {
    // Coming from signin or forgot password
    return 'Back to signin'
  }
}

// Initialize editable contact info from store and set proper verification method
watch(() => otpVerification.value.contactInfo, (newContactInfo) => {
  if (newContactInfo && !editableContactInfo.value) {
    editableContactInfo.value = newContactInfo
  }
}, { immediate: true })

// Set the verification method based on signup form data
watch(() => authStore.signupFormData, (signupData) => {
  if (signupData) {
    // Coming from signup - use phone verification
    const phoneNumber = signupData.phoneNumber
    if (phoneNumber) {
      authStore.setOtpVerificationState({
        verificationMethod: 'sms',
        contactInfo: phoneNumber
      })
      editableContactInfo.value = phoneNumber
    }
  } else {
    // Coming from signin - use email verification
    // The email should be set from the signin form or previous context
    authStore.setOtpVerificationState({
      verificationMethod: 'email'
    })
  }
}, { immediate: true })

// Watch for successful authentication and navigate to dashboard
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && !isSignupFlow.value) {
    // Clear auth flow states
    authStore.clearStates()
    authStore.resetAuthFlow()
    
    // Navigate to dashboard using window.location for reliable navigation
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 100)
  }
}, { immediate: true })

// Watch for success step specifically
watch(() => authStore.authStep, (newStep) => {
  if (newStep === 'success' && !isSignupFlow.value && authStore.isAuthenticated) {
    // Force navigation to dashboard
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 500)
  }
})
</script>

<style scoped lang="scss">
@use '../styles/auth-form-common' as *;
@use '../../../assets/styles/global-ui-variables' as *;

.otp-verification-form {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  
  // Override form-header margin for OTP specific spacing
  .form-header {
    margin-bottom: 2rem;
    
    .form-subtitle strong {
      color: #4f46e5;
      font-weight: $form-link-weight;
    }
  }
  
  // Contact info field styling
  .contact-info-field {
    margin-bottom: 1.5rem;
    
    :deep(fcx-inputtext) {
      font-weight: 500;
      
      &:focus {
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
      }
    }
  }
  
  .otp-timer-section {
    text-align: center;
    margin-bottom: 2rem;
    
    .timer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #6b7280;
      font-size: $form-helper-size;
      font-weight: $form-text-weight;
      
      i {
        font-size: $form-text-size;
      }
    }
  }
  
  .verification-info {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      font-size: $form-helper-size;
      font-weight: $form-text-weight;
      
      &:not(:last-child) {
        margin-bottom: 0.5rem;
      }
      
      i {
        font-size: $form-text-size;
        color: #4f46e5;
      }
    }
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .otp-verification-form {
    .verification-info {
      background: #1f2937;
      border-color: #374151;
    }
  }
}
</style>
