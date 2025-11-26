<template>
  <div class="forgot-password-form auth-form-base">
    <!-- Step 1: Email/Mobile Input -->
    <div v-if="currentStep === 'init'" class="form-header">
      <h2>Reset your password</h2>
      <p class="form-subtitle">Enter your email or mobile number to receive a verification code</p>
      <small class="progress-hint">You'll receive a code and be automatically moved to the verification step</small>
    </div>
    
    <!-- Step 2: OTP Verification -->
    <div v-else-if="currentStep === 'otp-verification'" class="form-header">
      <h2>Verify your identity</h2>
      <div class="contact-info-display">
        <p class="form-subtitle">
          We've sent a verification code to
        </p>
        <div class="contact-line">
          <strong class="contact-text">{{ maskedContactInfo || authStore.forgotPasswordState.emailOrMobile || formData.emailOrMobile || 'your contact' }}</strong>
          <button 
            type="button" 
            class="edit-contact-btn"
            @click="goBackToChangeContact"
            title="Change contact information"
          >
            <i class="pi pi-pencil"></i>
          </button>
        </div>
      </div>
      <small class="progress-hint">You'll be automatically moved to the next step after verification</small>
    </div>
    
    <!-- Step 3: Set New Password -->
    <div v-else-if="currentStep === 'reset-password'" class="form-header">
      <h2>Create new password</h2>
      <p class="form-subtitle">Your identity has been verified. Please set your new password</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Step 1: Email/Mobile Input -->
      <template v-if="currentStep === 'init'">
        <FcxInputtext
          name="emailOrMobile"
          label="Email or Mobile"
          placeholder="Enter your email or mobile number"
          autocomplete="username"
          required
          v-model="formData.emailOrMobile"
          class="form-group"
        />

        <FcxButton
          type="submit"
          label="Send Verification Code"
          severity="primary"
          size="large"
          :block="true"
          :loading="isLoading"
          :disabled="!formData.emailOrMobile || isLoading"
          class="submit-btn"
        />
      </template>

      <!-- Step 2: OTP Verification -->
      <template v-else-if="currentStep === 'otp-verification'">
        <div class="form-group">
          <FcxOtp
            name="otp"
            label="Enter verification code"
            :length="6"
            :model-value="formData.otp"
            @update:model-value="handleOtpInput"
            @complete="handleOtpComplete"
            :error="showValidationError ? authStore.error?.message : undefined"
            :disabled="isLoading"
            :auto-focus="true"
            :required="false"
            class="otp-input"
          />
          <small class="helper-text">
            Enter the 6-digit code sent to {{ maskedContactInfo }}
          </small>
        </div>

        <!-- Resend OTP -->
        <div class="form-group resend-section">
          <p class="resend-text">
            Didn't receive the code?
            <button 
              type="button" 
              class="resend-link"
              :disabled="!canResend || isLoading"
              @click="resendOtp"
            >
              {{ canResend ? 'Resend code' : `Resend in ${resendCooldown}s` }}
            </button>
          </p>
        </div>

        <FcxButton
          type="submit"
          label="Verify Code"
          severity="primary"
          size="large"
          :block="true"
          :loading="isLoading"
          :disabled="!formData.otp || formData.otp.length !== 6 || isLoading"
          class="submit-btn"
        />
      </template>

      <!-- Step 3: Set New Password -->
      <template v-else-if="currentStep === 'reset-password'">
        <div class="form-group">
          <span class="form-label">New Password</span>
          <FcxPassword
            name="newPassword"
            placeholder="Enter your new password"
            autocomplete="new-password"
            required
            :toggle-mask="true"
            :show-strength="true"
            v-model="formData.newPassword"
          />
        </div>

        <div class="form-group">
          <span class="form-label">Confirm Password</span>
          <FcxPassword
            name="confirmPassword"
            placeholder="Confirm your new password"
            autocomplete="new-password"
            required
            :toggle-mask="true"
            :show-strength="false"
            v-model="formData.confirmPassword"
            :class="passwordMismatch ? 'password-mismatch' : ''"
          />
          <small v-if="passwordMismatch" class="error-message">
            Passwords do not match
          </small>
        </div>

        <FcxButton
          type="submit"
          label="Reset Password"
          severity="primary"
          size="large"
          :block="true"
          :loading="isLoading"
          :disabled="!isPasswordFormValid || isLoading"
          class="submit-btn"
        />
      </template>
      
      <!-- Back to Sign In link -->
      <div class="auth-link">
        <p>Remember your password? 
          <router-link to="/auth/signin" class="link">Back to Sign In</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import type { 
  ForgotPasswordInitData, 
  ForgotPasswordOtpData, 
  ForgotPasswordResetData 
} from '../types/auth-types'

import FcxOtp from '@/components/formcomponents/FcxOtp.vue'
import FcxButton from '@/components/buttoncomponents/FcxButton.vue'
import FcxInputtext from '@/components/formcomponents/FcxInputtext.vue'
import FcxPassword from '@/components/formcomponents/FcxPassword.vue'

const authStore = useAuthStore()
const router = useRouter()

// Use store state for step management instead of local state
const currentStep = computed(() => authStore.forgotPasswordState.currentStep)

// Form data for all steps
const formData = ref({
  emailOrMobile: '',
  otp: '',
  verificationId: '',
  newPassword: '',
  confirmPassword: ''
})

// Initialize form data from store if available
if (authStore.forgotPasswordState.emailOrMobile) {
  formData.value.emailOrMobile = authStore.forgotPasswordState.emailOrMobile
  formData.value.verificationId = authStore.forgotPasswordState.verificationId
}

// OTP state
const canResend = ref(true)
const resendCooldown = ref(0)
const resendTimer = ref<number | null>(null)
const autoAdvanceTimer = ref<number | null>(null)

// Computed properties
const isLoading = computed(() => authStore.isLoading)

const passwordMismatch = computed(() => {
  return formData.value.newPassword && 
         formData.value.confirmPassword && 
         formData.value.newPassword !== formData.value.confirmPassword
})

const isPasswordFormValid = computed(() => {
  return formData.value.newPassword && 
         formData.value.confirmPassword &&
         formData.value.newPassword === formData.value.confirmPassword &&
         formData.value.newPassword.length >= 8
})

const showValidationError = computed(() => {
  return authStore.hasError && authStore.error?.message
})

const maskedContactInfo = computed(() => {
  const contact = authStore.forgotPasswordState.emailOrMobile || formData.value.emailOrMobile
  if (!contact) return ''
  
  if (contact.includes('@')) {
    // Email masking: j****@example.com
    const [localPart, domain] = contact.split('@')
    const maskedLocal = localPart.charAt(0) + '*'.repeat(Math.max(0, localPart.length - 2)) + localPart.slice(-1)
    return `${maskedLocal}@${domain}`
  } else {
    // Phone masking: +91****7890
    const digits = contact.replace(/\D/g, '')
    if (digits.length >= 4) {
      return '+' + digits.slice(0, 2) + '*'.repeat(Math.max(0, digits.length - 4)) + digits.slice(-2)
    }
    return contact
  }
})

// Methods
const handleSubmit = async () => {
  switch (currentStep.value) {
    case 'init':
      await sendOtp()
      break
    case 'otp-verification':
      await verifyOtp()
      break
    case 'reset-password':
      await resetPassword()
      break
  }
}

// OTP handling methods
const handleOtpInput = (value: string) => {
  formData.value.otp = value
}

const handleOtpComplete = (completedValue: string) => {
  formData.value.otp = completedValue
  // Auto-submit when complete
  if (completedValue && completedValue.length === 6) {
    verifyOtp()
  }
}

// Force step change function for testing
const forceStepChange = (step: 'init' | 'otp-verification' | 'reset-password') => {
  authStore.setForgotPasswordStep(step)
}

const goBackToChangeContact = () => {
  // Go back to the initial step to change contact information
  authStore.setForgotPasswordStep('init')
  // Clear OTP data when going back
  formData.value.otp = ''
  formData.value.verificationId = ''
}

const sendOtp = async () => {
  try {
    if (!formData.value.emailOrMobile) return
    
    const initData: ForgotPasswordInitData = {
      emailOrMobile: formData.value.emailOrMobile
    }
    
    const result = await authStore.sendForgotPasswordOtp(initData)
    
    if (result.success) {
      formData.value.verificationId = result.verificationId
      
      // Auto-fill OTP for demo after step change
      setTimeout(() => {
        formData.value.otp = '123456'
      }, 5000) // 5 seconds after OTP step change
    }
  } catch (error) {
    console.error('Send OTP error:', error)
  }
}

const verifyOtp = async () => {
  try {
    if (!formData.value.otp || formData.value.otp.length !== 6) return
    
    // Use the email/mobile from store if form data is empty
    const emailOrMobile = formData.value.emailOrMobile || authStore.forgotPasswordState.emailOrMobile
    const verificationId = formData.value.verificationId || authStore.forgotPasswordState.verificationId
    
    const otpData: ForgotPasswordOtpData = {
      emailOrMobile: emailOrMobile,
      otp: formData.value.otp,
      verificationId: verificationId
    }
    
    const result = await authStore.verifyForgotPasswordOtp(otpData)
    
    if (result.success) {
      // Store will handle the step transition automatically
    }
  } catch (error) {
    console.error('Verify OTP error:', error)
  }
}

const resetPassword = async () => {
  try {
    if (!isPasswordFormValid.value) return
    
    // Use the email/mobile from store if form data is empty
    const emailOrMobile = formData.value.emailOrMobile || authStore.forgotPasswordState.emailOrMobile
    const verificationId = formData.value.verificationId || authStore.forgotPasswordState.verificationId
    
    const resetData: ForgotPasswordResetData = {
      emailOrMobile: emailOrMobile,
      otp: formData.value.otp,
      verificationId: verificationId,
      newPassword: formData.value.newPassword,
      confirmPassword: formData.value.confirmPassword
    }
    
    const result = await authStore.resetPasswordWithOtp(resetData)
    
    if (result.success) {
      // Wait for the success message to show, then redirect
      setTimeout(() => {
        // Clear all auth states before redirecting
        authStore.clearStates()
        authStore.resetForgotPasswordState()
        router.push('/auth/signin')
      }, 2500) // 2.5 seconds to ensure success message is shown
    }
  } catch (error) {
    console.error('Reset password error:', error)
  }
}

const resendOtp = async () => {
  if (!canResend.value) return
  
  try {
    const initData: ForgotPasswordInitData = {
      emailOrMobile: formData.value.emailOrMobile
    }
    
    const result = await authStore.sendForgotPasswordOtp(initData)
    
    if (result.success) {
      formData.value.verificationId = result.verificationId
      formData.value.otp = '' // Clear current OTP
      startResendTimer()
    }
  } catch (error) {
    console.error('Resend OTP error:', error)
  }
}

const startResendTimer = () => {
  canResend.value = false
  resendCooldown.value = 60 // 60 seconds cooldown
  
  resendTimer.value = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      canResend.value = true
      if (resendTimer.value) {
        clearInterval(resendTimer.value)
        resendTimer.value = null
      }
    }
  }, 1000) as number
}

// Cleanup
onUnmounted(() => {
  if (resendTimer.value) {
    clearInterval(resendTimer.value)
  }
  if (autoAdvanceTimer.value) {
    clearTimeout(autoAdvanceTimer.value)
  }
  
  // Don't reset forgot password state here since it causes data loss during re-mounts
  // The state will be reset when the user completes the flow or navigates away
})

// Watchers for debugging
watch(currentStep, (newStep, oldStep) => {
  // Step change tracking (removed console log)
  
  // Start resend timer when entering OTP verification step
  if (newStep === 'otp-verification' && oldStep !== 'otp-verification') {
    startResendTimer()
  }
})

// Watch store state and sync with form data
watch(() => authStore.forgotPasswordState.emailOrMobile, (newEmailOrMobile) => {
  if (newEmailOrMobile && !formData.value.emailOrMobile) {
    formData.value.emailOrMobile = newEmailOrMobile
  }
}, { immediate: true })

watch(() => authStore.forgotPasswordState.verificationId, (newVerificationId) => {
  if (newVerificationId && !formData.value.verificationId) {
    formData.value.verificationId = newVerificationId
  }
}, { immediate: true })

watch(() => authStore.hasSuccess, (hasSuccess) => {
  // Success state tracking (removed console log)
})
</script>

<style scoped lang="scss">
@use '../styles/auth-form-common' as *;

.forgot-password-form {
  // ForgotPassword-specific styles only
  .form-header {
    .contact-info-display {
      margin-bottom: 1rem;
      
      .form-subtitle {
        margin-bottom: 0.5rem;
      }
      
      .contact-line {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
        
        .contact-text {
          color: #4f46e5;
          font-weight: 600;
          font-size: 1rem;
        }
        
        .edit-contact-btn {
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          color: #6b7280;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          
          &:hover {
            background: #f8fafc;
            border-color: #4f46e5;
            color: #4f46e5;
          }
          
          i {
            font-size: 0.75rem;
          }
        }
      }
    }
  }
  
  .form-content {
    .password-mismatch {
      :deep(.p-password) {
        border-color: #ef4444;
      }
    }
    
    .progress-hint {
      display: block;
      color: #10b981;
      font-size: 0.75rem;
      margin-top: 0.5rem;
      text-align: center;
      font-style: italic;
    }
    
    .otp-input {
      :deep(.p-inputotp) {
        gap: 0.5rem;
        justify-content: center;
        
        .p-inputotp-input {
          width: 2.5rem;
          height: 2.5rem;
          text-align: center;
          font-size: 1.125rem;
          font-weight: 600;
        }
      }
    }
    
    .helper-text {
      display: block;
      color: #6b7280;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      text-align: center;
    }
    
    .resend-section {
      text-align: center;
      margin-bottom: 1.5rem;
      
      .resend-text {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
      }
      
      .resend-link {
        background: none;
        border: none;
        color: #4f46e5;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        font-size: 0.875rem;
        padding: 0;
        margin-left: 0.25rem;
        
        &:hover:not(:disabled) {
          text-decoration: underline;
        }
        
        &:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }
      }
    }
  }
}

// Responsive design for mobile
@media (max-width: 480px) {
  .forgot-password-form {
    .form-content {
      .otp-input {
        :deep(.p-inputotp) {
          .p-inputotp-input {
            width: 2rem;
            height: 2rem;
            font-size: 1rem;
          }
        }
      }
    }
  }
}
</style>
