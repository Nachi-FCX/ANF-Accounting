<template>
  <div class="gstin-otp-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2 class="form-title">Enter OTP</h2>
      <button
        class="close-button"
        @click="$emit('cancel')"
        aria-label="Close dialog"
        type="button"
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- OTP Content -->
    <div class="otp-content">
      <!-- Instructions -->
      <div class="otp-instructions">
        <p class="instruction-text">
          Please enter the 4-digit OTP sent to your registered mobile number
        </p>
      </div>

      <!-- OTP Input -->
      <div class="otp-inputs">
        <FcxOtp
          v-model="otpValue"
          name="gstin-otp"
          :length="4"
          :disabled="isLoading"
          :error-message="hasError ? errorMessage : ''"
          size="lg"
          variant="default"
          :auto-focus="true"
          :integer-only="true"
          input-mode="numeric"
          :allow-paste="true"
          @complete="handleOtpComplete"
          @input="handleOtpInput"
          ref="otpRef"
        />
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" class="error-icon">
          <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
        </svg>
        {{ errorMessage }}
      </div>

      <!-- Resend OTP -->
      <div class="resend-section">
        <p class="resend-text">
          Didn't receive the OTP?
          <button
            type="button"
            class="resend-button"
            @click="handleResendOtp"
            :disabled="isResendDisabled || isLoading"
          >
            {{ resendButtonText }}
          </button>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <FcxButton
          type="button"
          @click="$emit('back')"
          severity="secondary"
          variant="outlined"
          size="large"
          class="back-button"
          :disabled="isLoading"
        >
          Back
        </FcxButton>
        
        <FcxButton
          type="button"
          @click="handleVerify"
          severity="success"
          variant="filled"
          size="large"
          class="verify-button"
          :loading="isLoading"
          :disabled="isLoading || !isOtpComplete"
        >
          Verify OTP
        </FcxButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { validateOTP } from '../utils/gstin-validation'
import { OTP_CONFIG } from '../constants/gstin-constants'

// Props
interface Props {
  isLoading?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: ''
})

// Emits
const emit = defineEmits<{
  verify: [otp: string]
  back: []
  cancel: []
  resendOtp: []
}>()

// Reactive data
const otpValue = ref('')
const otpRef = ref()
const resendTimer = ref(0)
const resendInterval = ref<number | null>(null)

// Computed
const isOtpComplete = computed(() => {
  return otpValue.value && otpValue.value.length === 4
})

const hasError = computed(() => {
  return !!props.errorMessage
})

const isResendDisabled = computed(() => {
  return resendTimer.value > 0
})

const resendButtonText = computed(() => {
  if (resendTimer.value > 0) {
    return `Resend in ${resendTimer.value}s`
  }
  return 'Resend OTP'
})

// Methods for FcxOtp integration
const handleOtpInput = (event: Event) => {
  // Handle OTP input changes
  // The v-model will automatically update otpValue
}

const handleOtpComplete = (completedOtp: string) => {
  // Auto-verify when OTP is complete
  nextTick(() => {
    handleVerify()
  })
}

const handleVerify = () => {
  if (!isOtpComplete.value) return
  
  const otp = otpValue.value
  const validation = validateOTP(otp)
  
  if (validation.isValid) {
    emit('verify', otp)
  }
}

const handleResendOtp = () => {
  if (isResendDisabled.value) return
  
  emit('resendOtp')
  startResendTimer()
  
  // Clear the current OTP value
  otpValue.value = ''
  
  // Focus the OTP input
  nextTick(() => {
    if (otpRef.value) {
      otpRef.value.focus()
    }
  })
}

const startResendTimer = () => {
  resendTimer.value = OTP_CONFIG.RESEND_DELAY
  
  resendInterval.value = setInterval(() => {
    resendTimer.value--
    
    if (resendTimer.value <= 0) {
      clearInterval(resendInterval.value!)
      resendInterval.value = null
    }
  }, 1000)
}

const clearOtp = () => {
  otpValue.value = ''
  if (otpRef.value) {
    otpRef.value.clear()
  }
}

const focusOtp = () => {
  if (otpRef.value) {
    otpRef.value.focus()
  }
}

// Lifecycle
onMounted(() => {
  // Start resend timer
  startResendTimer()
})

// Expose methods
defineExpose({
  clearOtp,
  focusOtp
})
</script>

<style lang="scss" scoped>
.gstin-otp-form {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.form-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.close-button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  &:focus {
    outline: none;
    background: #f3f4f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
}

.otp-content {
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.otp-instructions {
  text-align: center;
}

.instruction-text {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
}

.error-icon {
  flex-shrink: 0;
}

.resend-section {
  text-align: center;
}

.resend-text {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.resend-button {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 4px;
  transition: color 0.2s ease;

  &:hover:not(:disabled) {
    color: #2563eb;
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    color: #2563eb;
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.back-button {
  flex: 1;
}

.verify-button {
  flex: 2;
  background: #10b981 !important;

  &:hover:not(:disabled) {
    background: #059669 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
}

// Dark theme support
:root[data-theme="dark"] {
  .gstin-otp-form {
    background: #1f2937;
  }

  .form-header {
    border-bottom-color: #374151;
  }

  .form-title {
    color: #f9fafb;
  }

  .close-button {
    color: #d1d5db;

    &:hover {
      background: #374151;
      color: #f9fafb;
    }
  }

  .instruction-text {
    color: #9ca3af;
  }

  .resend-text {
    color: #9ca3af;
  }
}

// Mobile responsive
@media (max-width: 640px) {
  .gstin-otp-form {
    width: 100%;
    max-width: none;
    border-radius: 12px 12px 0 0;
  }

  .form-header {
    padding: 20px 20px 0 20px;
  }

  .otp-content {
    padding: 0 20px 20px 20px;
  }

  .form-title {
    font-size: 18px;
  }

  .otp-inputs {
    gap: 8px;
  }

  .form-actions {
    flex-direction: column;
    
    .back-button,
    .verify-button {
      flex: none;
    }
  }
}
</style>