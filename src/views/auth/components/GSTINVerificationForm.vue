<template>
  <div class="gstin-verification-form auth-form-base">
    <div class="form-header">
      <h2>Verify your GSTIN</h2>
      <p class="form-subtitle">
        Enter your GSTIN details to verify your business registration
      </p>
    </div>
    
    <form @submit.prevent="handleVerifyGSTIN" class="form-content">
      <!-- Company Name Field -->
         <!-- GSTIN Number Field -->
      <FcxInputtext
        name="gstinNumber"
        label="GSTIN Number"
        placeholder="Enter GSTIN number"
        v-model="gstinData.gstin"
        class="form-group gstin-field"
        :loading="isGstinLoading"
        :suffixIcon="gstinStatusIcon"
        :error="gstinError || undefined"
        textTransform="uppercase"
        :disabled="isVerifying || isSendingOTP"
        :maxlength="15"
        @blur="touched.gstinNumber = true"
      >
        <template #labelSuffix>
          <span 
            v-if="fetchedGstinData?.sts" 
            class="gstin-status-badge"
            :class="getStatusClass(fetchedGstinData.sts)"
          >
            {{ getStatusText(fetchedGstinData.sts) }}
          </span>
        </template>
      </FcxInputtext>
      <FcxInputtext
        name="companyName"
        label="Company Name"
        placeholder="Enter company name"
        autocomplete="organization"
        required
        v-model="gstinData.companyName"
        class="form-group"
        :disabled="isVerifying || isSendingOTP"
      />

    

    
      <!-- Send OTP Button -->
      <FcxButton
        v-if="!gstinVerification.otpSent"
        type="button"
        label="Send OTP"
        severity="primary"
        size="large"
        :block="true"
        :loading="isSendingOTP"
        :disabled="!isGSTINDataValid || isSendingOTP"
        @click="handleSendOTP"
        class="send-otp-btn"
      />

      <!-- OTP Input Field -->
      <FcxOtp
        v-if="gstinVerification.otpSent"
        name="gstinOtp"
        label="Enter GSTIN verification code"
        :length="OTP_CONFIG.LENGTH"
        :model-value="otpCode"
        @update:model-value="handleOtpInput"
        @complete="handleOtpComplete"
        :error="showValidationError ? companyStore.error : undefined"
        :disabled="isVerifying"
        :auto-focus="true"
        :required="false"
        class="form-group"
      />

      <!-- Timer and Resend -->
      <div v-if="gstinVerification.otpSent" class="otp-timer-section">
        <div v-if="!gstinVerification.canResend" class="timer">
          <i class="pi pi-clock"></i>
          <span>Resend code in {{ formatTime(gstinVerification.resendCooldown) }}</span>
        </div>
        <FcxButton
          v-else
          type="button"
          label="Resend OTP"
          icon="pi pi-refresh"
          severity="secondary"
          variant="text"
          size="small"
          :loading="isResending"
          @click="handleResendOTP"
          class="resend-btn"
        />
      </div>

      <!-- Verify Button -->
      <FcxButton
        v-if="gstinVerification.otpSent"
        type="submit"
        label="Verify GSTIN"
        severity="primary"
        size="large"
        :block="true"
        :loading="isVerifying"
        :disabled="!isOtpComplete || isVerifying"
        class="submit-btn"
      />

      <!-- Additional Info -->
      <div v-if="gstinVerification.otpSent" class="verification-info">
        <div class="info-item">
          <i class="pi pi-info-circle"></i>
          <span>Code expires in {{ formatTime(timeUntilExpiry) }}</span>
        </div>
        <div class="info-item">
          <i class="pi pi-shield"></i>
          <span>{{ gstinVerification.attemptsRemaining }} attempts remaining</span>
        </div>
      </div>

      <!-- Back to signup page -->
      <div class="auth-link">
        <FcxButton
          type="button"
          label="Back to signup page"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCompanyStore } from '@/views/masters/companymasters/stores/companyStore'
import { useGstinStore } from '@/stores/gstinStore'
import { OTP_CONFIG } from '../constants/auth-constants'
import FcxOtp from '@/components/formcomponents/FcxOtp.vue'
import FcxButton from '@/components/buttoncomponents/FcxButton.vue'
import FcxInputtext from '@/components/formcomponents/FcxInputtext.vue'
import type { GstinCompanyData } from '@/types/common'
import { authStorage } from '../utils/storage'


const authStore = useAuthStore()
const companyStore = useCompanyStore()
const gstinStore = useGstinStore()
const router = useRouter()

// Reactive data
const otpCode = ref('')
const isResending = ref(false)
const isSendingOTP = ref(false)
const hasAttemptedSubmit = ref(false)

// GSTIN-related state
const isGstinLoading = ref(false)
const gstinFetchSuccess = ref(false)
const isCompanyNameAutoFilled = ref(false)
const fetchedGstinData = ref<GstinCompanyData | null>(null)
const gstinError = ref<string | null>(null)

// OTP verification state (mimicking the auth store structure for UI compatibility)
const gstinVerificationState = ref({
  gstin: '',
  username: '',
  stateCode: '',
  otpId: undefined as string | undefined,
  canResend: true,
  resendCooldown: 0,
  attemptsRemaining: 3,
  expiresAt: null as Date | null,
  otpSent: false
})

// GSTIN form data
const gstinData = ref({
  gstin: '',
  username: '',
  stateCode: '',
  companyName: ''
})

// Form validation state
const touched = ref<Record<string, boolean>>({})

// Computed properties
const gstinVerification = computed(() => gstinVerificationState.value)
const isVerifying = computed(() => companyStore.isLoading)
const hasError = computed(() => companyStore.hasError)
const isOtpComplete = computed(() => otpCode.value && otpCode.value.length === OTP_CONFIG.LENGTH)

// Validation for GSTIN data
const isGSTINDataValid = computed(() => {
  return gstinData.value.gstin.length === 15 && 
         gstinData.value.username.trim().length > 0 && 
         gstinData.value.stateCode.length === 2 &&
         /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(gstinData.value.gstin)
})

// Only show validation errors after user has attempted to submit or after an API error
const showValidationError = computed(() => {
  return hasError.value && (hasAttemptedSubmit.value || companyStore.error)
})

const timeUntilExpiry = computed(() => {
  if (!gstinVerification.value.expiresAt) return 0
  const now = new Date().getTime()
  const expiry = new Date(gstinVerification.value.expiresAt).getTime()
  return Math.max(0, Math.floor((expiry - now) / 1000)) // seconds
})

// GSTIN status icon based on fetch state
const gstinStatusIcon = computed(() => {
  if (!gstinData.value.gstin || gstinData.value.gstin.length < 15) {
    return undefined // No icon for incomplete GSTIN
  }
  
  if (isGstinLoading.value) {
    return undefined // Loading spinner is handled by the loading prop
  }
  
  if (gstinFetchSuccess.value) {
    return 'pi pi-check' // Success icon
  }
  
  if (gstinError.value) {
    return 'pi pi-times' // Error icon
  }
  
  return undefined
})

// Methods
const handleGSTINChange = (value: string) => {
  gstinData.value.gstin = value.toUpperCase()
}

const handleUsernameChange = (value: string) => {
  gstinData.value.username = value
}

const handleStateCodeChange = (value: string) => {
  gstinData.value.stateCode = value
}

const handleOtpInput = (value: string) => {
  otpCode.value = value
}

const handleOtpComplete = (completedValue: string) => {
  otpCode.value = completedValue
  // Auto-submit when complete
  if (completedValue && completedValue.length === OTP_CONFIG.LENGTH) {
    handleVerifyGSTIN()
  }
}

const handleSendOTP = async () => {
  if (!isGSTINDataValid.value) return
  
  try {
    isSendingOTP.value = true
    
    // Update company store input data
    companyStore.updateInputData({
      username: gstinData.value.username,
      gstin: gstinData.value.gstin,
      stateCode: gstinData.value.stateCode
    })
    
    // Send OTP using company store
    await companyStore.sendOtp()
    
    // Update local state to show OTP sent
    gstinVerificationState.value = {
      ...gstinVerificationState.value,
      gstin: gstinData.value.gstin,
      username: gstinData.value.username,
      stateCode: gstinData.value.stateCode,
      otpSent: true,
      canResend: false,
      resendCooldown: 60,
      attemptsRemaining: 3,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }
    
    // Start cooldown timer
    const timer = setInterval(() => {
      gstinVerificationState.value.resendCooldown--
      if (gstinVerificationState.value.resendCooldown <= 0) {
        gstinVerificationState.value.canResend = true
        clearInterval(timer)
      }
    }, 1000)
    
  } catch (error) {
    console.error('Send GSTIN OTP error:', error)
  } finally {
    isSendingOTP.value = false
  }
}

const handleVerifyGSTIN = async () => {
  if (!isOtpComplete.value) return
  
  try {
    hasAttemptedSubmit.value = true
    
    // Verify OTP using company store
    await companyStore.verifyOtp(otpCode.value)
    
    // If we reach here, verification was successful
    // GSTIN verification successful - update auth step to success
    authStore.setAuthStep('success')
    
  } catch (error) {
    // Handle verification failure
    gstinVerificationState.value.attemptsRemaining--
    
    if (gstinVerificationState.value.attemptsRemaining <= 0) {
      // Reset OTP state if no attempts remaining
      gstinVerificationState.value.otpSent = false
      gstinVerificationState.value.attemptsRemaining = 3
    }
    
    // Clear OTP on error
    otpCode.value = ''
    console.error('Verify GSTIN OTP error:', error)
  }
}

const handleResendOTP = async () => {
  try {
    isResending.value = true
    
    // Resend OTP using company store
    await companyStore.sendOtp()
    
    // Update local state for resend
    gstinVerificationState.value.canResend = false
    gstinVerificationState.value.resendCooldown = 60
    gstinVerificationState.value.attemptsRemaining = 3
    gstinVerificationState.value.expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    
    // Start cooldown timer
    const timer = setInterval(() => {
      gstinVerificationState.value.resendCooldown--
      if (gstinVerificationState.value.resendCooldown <= 0) {
        gstinVerificationState.value.canResend = true
        clearInterval(timer)
      }
    }, 1000)
    
    // Clear current OTP
    otpCode.value = ''
  } catch (error) {
    console.error('Resend GSTIN OTP error:', error)
  } finally {
    isResending.value = false
  }
}

const goBack = () => {
  // Reset auth step to go back to signup form
  authStore.setAuthStep('idle')
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// GSTIN helper functions
const isValidGstin = (gstin: string): boolean => {
  if (!gstin || gstin.length !== 15) return false
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstinRegex.test(gstin)
}

const getStatusClass = (status: string): string => {
  switch(status?.toLowerCase()) {
    case 'active': return 'status-active'
    case 'inactive': return 'status-inactive'
    case 'cancelled': return 'status-cancelled'
    default: return 'status-unknown'
  }
}

const getStatusText = (status: string): string => {
  switch(status?.toLowerCase()) {
    case 'active': return 'Active'
    case 'inactive': return 'Inactive'
    case 'cancelled': return 'Cancelled'
    default: return status || 'Unknown'
  }
}

// Debounce utility function
const debounce = (func: Function, wait: number) => {
  let timeout: number | undefined
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// GSTIN fetch functionality
const handleGstinFetch = async (gstin: string) => {
  if (!isValidGstin(gstin)) return
  
  try {
    isGstinLoading.value = true
    gstinError.value = null
    gstinFetchSuccess.value = false
    
    console.log('🔍 Fetching GSTIN details for:', gstin)
    
    const companyData = await gstinStore.fetchGstinDetails(gstin)
    
    if (companyData) {
      fetchedGstinData.value = companyData
      
      // Auto-populate company name with legal name (lgnm)
      if (companyData.lgnm) {
        gstinData.value.companyName = companyData.lgnm
        isCompanyNameAutoFilled.value = true
        gstinFetchSuccess.value = true
        
        console.log('✅ GSTIN fetch successful:', {
          companyName: companyData.lgnm,
          status: companyData.sts
        })
      }
    }
  } catch (error: any) {
    console.error('❌ GSTIN fetch error:', error)
    gstinError.value = error.message || 'Failed to fetch company details'
    gstinFetchSuccess.value = false
    fetchedGstinData.value = null
  } finally {
    isGstinLoading.value = false
  }
}

// Clear auto-filled data
const clearAutoFill = () => {
  isCompanyNameAutoFilled.value = false
  gstinFetchSuccess.value = false
  fetchedGstinData.value = null
  gstinError.value = null
  // Don't clear the company name, let user edit it
}

// Debounced GSTIN fetch
const debouncedGstinFetch = debounce(handleGstinFetch, 800)

// Watch for GSTIN changes to trigger automatic lookup
watch(() => gstinData.value.gstin, (newGstin, oldGstin) => {
  if (newGstin !== oldGstin) {
    // Reset GSTIN-related state when GSTIN changes
    gstinFetchSuccess.value = false
    gstinError.value = null
    
    // If company name was auto-filled, clear the auto-fill state
    if (isCompanyNameAutoFilled.value) {
      isCompanyNameAutoFilled.value = false
      fetchedGstinData.value = null
    }
    
    // Update state code automatically when GSTIN changes
    if (newGstin && newGstin.length >= 2) {
      gstinData.value.stateCode = newGstin.substring(0, 2)
    }
    
    // Trigger debounced fetch if GSTIN is valid
    if (newGstin && newGstin.length === 15) {
      debouncedGstinFetch(newGstin)
    }
  }
})

// Watch for GSTIN data changes to re-validate the field
watch(fetchedGstinData, (newData) => {
  if (gstinData.value.gstin && touched.value.gstinNumber) {
    // Re-validate GSTIN field when data is fetched
    if (newData && newData.sts?.toLowerCase() !== 'active') {
      const status = getStatusText(newData.sts)
      gstinError.value = `GSTIN status is ${status}. Only Active GSTIN numbers are allowed.`
    } else {
      gstinError.value = null
    }
  }
}, { deep: true })

// Initialize GSTIN data from signup form data if available
onMounted(async () => {
  // First, try to get data from signup form (primary source)
  const signupFormData = authStore.signupFormData
  
  if (signupFormData) {
    console.log('📋 Pre-populating GSTIN form from signup data:', signupFormData)
    
    // Pre-populate company name from signup form
    if (signupFormData.companyName) {
      gstinData.value.companyName = signupFormData.companyName
    }
    
    // Pre-populate GSTIN number from signup form
    if (signupFormData.gstinNumber) {
      gstinData.value.gstin = signupFormData.gstinNumber
      
      // Extract state code from GSTIN (first 2 digits)
      gstinData.value.stateCode = signupFormData.gstinNumber.substring(0, 2)
    }
    
    // Use email as default username
    if (signupFormData.email) {
      gstinData.value.username = signupFormData.email
    }
    
    console.log('✅ GSTIN form pre-populated:', {
      companyName: gstinData.value.companyName,
      gstin: gstinData.value.gstin,
      username: gstinData.value.username,
      stateCode: gstinData.value.stateCode
    })
    
    // If GSTIN is pre-populated and valid, fetch company details immediately
    if (gstinData.value.gstin && isValidGstin(gstinData.value.gstin)) {
      console.log('🔍 Pre-populated GSTIN detected, fetching details:', gstinData.value.gstin)
      await handleGstinFetch(gstinData.value.gstin)
    }
  } else {
    // Fallback: try to get data from auth store's GSTIN verification state (legacy)
    console.log('📋 No signup data found, checking auth store GSTIN verification state')
    
    if (gstinVerification.value.gstin) {
      gstinData.value.gstin = gstinVerification.value.gstin
    }
    if (gstinVerification.value.username) {
      gstinData.value.username = gstinVerification.value.username
    }
    if (gstinVerification.value.stateCode) {
      gstinData.value.stateCode = gstinVerification.value.stateCode
    }
    
    console.log('✅ GSTIN form initialized from auth store:', {
      gstin: gstinData.value.gstin,
      username: gstinData.value.username,
      stateCode: gstinData.value.stateCode
    })
    
    // If GSTIN is available from auth store and valid, fetch company details immediately
    if (gstinData.value.gstin && isValidGstin(gstinData.value.gstin)) {
      console.log('🔍 Auth store GSTIN detected, fetching details:', gstinData.value.gstin)
      await handleGstinFetch(gstinData.value.gstin)
    }
  }
})


const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzU0NzQxODA0LCJleHAiOjE3NTUzNDY2MDR9.CnLWKS828UmIvOwknMVqpo1vQFQuOjlBuVs7cyzkbSY'

// Component mounted lifecycle
onMounted(() => {
  console.log('🔑 SignUpForm mounted - Setting up static token')
  
  // Store the static token in localStorage on component mount
  try {
    authStorage.setAuthSession({
      user: {
        userId: '2', // From token payload (id: 2)
        email: 'user@example.com', // Placeholder email
        firstName: 'User',
        lastName: 'Example',
        phoneNumber: undefined,
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        status: 'active',
        role: 'user',
        preferences: {
          language: 'en',
          theme: 'light',
          timezone: 'UTC',
          dateFormat: 'DD/MM/YYYY',
          currency: 'USD',
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false
          }
        }
      },
      accessToken: STATIC_TOKEN
    })
    
    console.log('✅ Static token stored successfully')
    console.log('📊 Token info:', {
      userId: '2',
      issuedAt: new Date(1754741804 * 1000).toISOString(),
      expiresAt: new Date(1755346604 * 1000).toISOString(),
      token: STATIC_TOKEN.substring(0, 50) + '...' // Log partial token for security
    })
    
  } catch (error) {
    console.error('❌ Error storing static token:', error)
  }
})
// Navigation is now handled at the SignUpView level
</script>

<style scoped lang="scss">
@use '../styles/auth-form-common' as *;
@use '../../../assets/styles/global-ui-variables' as *;

.gstin-verification-form {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  
  // Override form-header margin for GSTIN specific spacing
  .form-header {
    margin-bottom: 2rem;
    
    .form-subtitle {
      color: #6b7280;
      font-size: $form-helper-size;
      font-weight: $form-text-weight;
      line-height: 1.5;
    }
  }
  
  // GSTIN form fields styling
  .gstin-field,
  .username-field,
  .state-code-field {
    margin-bottom: 1.5rem;
    
    :deep(fcx-inputtext) {
      font-weight: 500;
      
      &:focus {
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
      }
    }
  }
  
  .gstin-field {
    :deep(fcx-inputtext) {
      font-family: 'Courier New', monospace;
      letter-spacing: 0.5px;
    }
  }
  
  .state-code-field {
    :deep(fcx-inputtext) {
      text-align: center;
      font-weight: 600;
    }
  }
  
  .send-otp-btn {
    margin-bottom: 1.5rem;
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
  
  .auth-link {
    text-align: center;
    margin-top: 2rem;
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .gstin-verification-form {
    .form-header .form-subtitle {
      color: #9ca3af;
    }
    
    .verification-info {
      background: #1f2937;
      border-color: #374151;
      
      .info-item {
        color: #9ca3af;
      }
    }
  }
}

// GSTIN status badge styles
.gstin-status-badge {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  &.status-active {
    background-color: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }
  
  &.status-inactive {
    background-color: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }
  
  &.status-cancelled {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }
  
  &.status-unknown {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
}

// Mobile responsiveness
@media (max-width: 480px) {
  .gstin-verification-form {
    .form-header {
      margin-bottom: 1.5rem;
      
      h2 {
        font-size: 1.5rem;
      }
    }
    
    .gstin-field,
    .username-field,
    .state-code-field {
      margin-bottom: 1.25rem;
    }
    
    .verification-info {
      padding: 0.75rem;
      margin-bottom: 1.5rem;
    }
  }
}
</style>
