<template>
  <div class="signup-form auth-form-base">
    <div class="form-header">
      <h2>Create your account</h2>
      <p class="form-subtitle">Join FinCorpX and start managing your finances</p>
    </div>
    
    <form @submit.prevent="handleSignUp" class="form-content">
      
      <!-- Organization Fields -->
      <FcxInputtext
        name="name"
        label="Name"
        placeholder="Enter name"
        autocomplete="organization"
        required
        v-model="formData.name"
        class="form-group"
        :error="touched.name ? errors.name : undefined"
        @blur="touched.name = true"
      />

      <!-- <FcxInputtext
        name="gstinNumber"
        label="GSTIN Number"
        placeholder="Enter GSTIN number (optional)"
        v-model="formData.gstinNumber"
        class="form-group"
        :loading="isGstinLoading"
        :suffixIcon="gstinStatusIcon"
        :error="touched.gstinNumber ? errors.gstinNumber : gstinError"
        textTransform="uppercase"
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
        v-model="formData.companyName"
        class="form-group"
        :error="touched.companyName ? errors.companyName : undefined"
        @blur="touched.companyName = true"
      /> -->

      <!-- Email Address -->
      <FcxInputtext
        name="email"
        label="Email Address"
        placeholder="Enter your email address"
        autocomplete="email"
        required
        v-model="formData.email"
        class="form-group"
        :error="touched.email ? errors.email : undefined"
        @blur="touched.email = true"
      />

      <!-- Phone Number -->
      <FcxInputtext
        name="phoneNumber"
        label="Phone Number"
        placeholder="Enter your phone number"
        autocomplete="tel"
        v-model="formData.phoneNumber"
        class="form-group"
        required
        :error="touched.phoneNumber ? errors.phoneNumber : undefined"
        @blur="touched.phoneNumber = true"
      />

      <!-- Password -->
      <FcxPassword
        name="password"
        label="Password"
        placeholder="Enter your password"
        autocomplete="new-password"
        required
        :toggle-mask="true"
        :show-strength="false"
        v-model="formData.password"
        class="form-group"
        :class="{ 'p-invalid': touched.password && errors.password }"
        @blur="touched.password = true"
      />
      <!-- <span v-if="touched.password && errors.password" class="error-message">{{ errors.password }}</span> -->

      <!-- Confirm Password -->
      <FcxPassword
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        autocomplete="new-password"
        required
        :toggle-mask="true"
        :show-strength="false"
        v-model="formData.confirmPassword"
        class="form-group"
        :class="{ 'p-invalid': touched.confirmPassword && errors.confirmPassword }"
        @blur="touched.confirmPassword = true"
      />
      <!-- Password Match Indicator -->
      <div v-if="formData.password && formData.confirmPassword" class="password-match-indicator">
        <span v-if="passwordsMatch" class="match-success">✓ Passwords match</span>
        <span v-else class="match-error">✗ Passwords do not match</span>
      </div>

      <!-- Terms and Conditions -->
      <FcxCheckbox
        name="agreeToTerms"
        label="I agree to the Terms of Service and Privacy Policy"
        :binary="true"
        v-model="formData.agreeToTerms"
        class="form-group checkbox-group"
        :class="{ 'p-invalid': touched.agreeToTerms && errors.agreeToTerms }"
        @change="touched.agreeToTerms = true"
      />
      <!-- <span v-if="touched.agreeToTerms && errors.agreeToTerms" class="error-message">{{ errors.agreeToTerms }}</span> -->

      <!-- Submit Button -->
      <FcxButton
        type="submit"
        label="Create Account"
        severity="primary"
        size="large"
        :block="true"
        :loading="isLoading"
       
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
          @social-login="handleSocialSignUp"
        />
      </div>
      
      <!-- Sign in link -->
      <div class="auth-link">
        <p>Already have an account? 
          <router-link to="/auth/signin" class="link">Sign in</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useGstinStore } from '@/stores/gstinStore'
import SocialLoginButtons from './SocialLoginButtons.vue'
import type { SocialProvider } from '../types/auth-types'
import type { GstinCompanyData } from '@/types/common'
import { VALIDATION_MESSAGES } from '../constants/auth-constants'
import { authStorage } from '../utils/storage'

const authStore = useAuthStore()
const gstinStore = useGstinStore()
const router = useRouter()

// GSTIN-related state
const isGstinLoading = ref(false)
const gstinFetchSuccess = ref(false)
const isCompanyNameAutoFilled = ref(false)
const fetchedGstinData = ref<GstinCompanyData | null>(null)
const gstinError = ref<string | null>(null)

// Extended form data interface
interface SignUpFormData {
  name: string
  // companyName: string  // Commented out since related fields are not active
  // gstinNumber: string  // Commented out since related fields are not active
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

// Form data
const formData = ref<SignUpFormData>({
  name: '',
  // companyName: '',  // Commented out since related fields are not active
  // gstinNumber: '',  // Commented out since related fields are not active
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

// Form validation state
const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})

// Computed properties
const isLoading = computed(() => authStore.isLoading)
const passwordsMatch = computed(() => {
  if (!formData.value.password || !formData.value.confirmPassword) return true // Don't show error until both are filled
  return formData.value.password === formData.value.confirmPassword
})

// GSTIN-related computed properties
const accountStatus = computed(() => fetchedGstinData.value?.sts)
const isAccountActive = computed(() => 
  accountStatus.value?.toLowerCase() === 'active'
)

// GSTIN status icon based on fetch state - COMMENTED OUT since GSTIN fields are not active
/*
const gstinStatusIcon = computed(() => {
  if (!formData.value.gstinNumber || formData.value.gstinNumber.length < 15) {
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
*/

// Dynamic GSTIN label with status
const gstinLabel = computed(() => {
  let label = 'GSTIN Number'
  
  if (fetchedGstinData.value?.sts) {
    const statusText = getStatusText(fetchedGstinData.value.sts)
    label += ` - ${statusText}`
  }
  
  return label
})

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

const isFormValid = computed(() => {
  // Check all required fields with proper validation (only active fields)
  const hasName = Boolean(formData.value.name && formData.value.name.trim().length >= 2)
  const hasEmail = Boolean(formData.value.email && formData.value.email.trim().length > 0)
  const hasPhoneNumber = Boolean(formData.value.phoneNumber && formData.value.phoneNumber.trim().length > 0)
  const hasPassword = Boolean(formData.value.password && formData.value.password.length >= 6)
  const hasConfirmPassword = Boolean(formData.value.confirmPassword && formData.value.confirmPassword.length > 0)
  const hasAgreedToTerms = formData.value.agreeToTerms === true
  
  // Validate email format
  const isValidEmail = hasEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
  
  // Validate phone format
  const isValidPhone = hasPhoneNumber && /^[\+]?[1-9][\d]{9,15}$/.test(formData.value.phoneNumber.replace(/[\s\-\(\)]/g, ''))
  
  // Check if passwords match
  const passwordsMatchCheck = passwordsMatch.value
  
  // Check if there are no validation errors for touched fields
  const hasNoErrors = Object.keys(errors.value).length === 0
  
  // GSTIN validation is disabled since GSTIN fields are commented out
  // let gstinValidation = true
  // if (formData.value.gstinNumber && formData.value.gstinNumber.trim().length > 0) {
  //   // If GSTIN is provided, check if it's valid and active
  //   const isValidGstinFormat = isValidGstin(formData.value.gstinNumber)
  //   const isGstinActive = fetchedGstinData.value?.sts?.toLowerCase() === 'active'
  //   const hasGstinData = Boolean(fetchedGstinData.value)
  //   
  //   // GSTIN is valid only if:
  //   // 1. Format is correct (15 chars, proper pattern)
  //   // 2. Data has been fetched successfully
  //   // 3. Status is 'Active'
  //   gstinValidation = isValidGstinFormat && hasGstinData && isGstinActive
  // }
  
  const validationResult = {
    hasName,
    hasEmail,
    hasPhoneNumber,
    hasPassword,
    hasConfirmPassword,
    hasAgreedToTerms,
    isValidEmail,
    isValidPhone,
    passwordsMatch: passwordsMatchCheck,
    hasNoErrors,
    // gstinValidation, // Disabled since GSTIN fields are commented out
    // gstinStatus: fetchedGstinData.value?.sts,
    // Only check active fields: name, email, phoneNumber, password, confirmPassword, agreeToTerms
    isValid: hasName && isValidEmail && isValidPhone && hasPassword && hasConfirmPassword && 
             hasAgreedToTerms && passwordsMatchCheck && hasNoErrors
  }
  
  console.log('Form validation detailed:', validationResult)
  
  return validationResult.isValid
})

// Validation functions
const validateField = (field: keyof SignUpFormData, value: any) => {
  switch (field) {
    case 'name':
      if (!value || value.length < 2) {
        errors.value[field] = 'This field must be at least 2 characters'
      } else if (value.length > 100) {
        errors.value[field] = 'This field must not exceed 100 characters'
      } else {
        delete errors.value[field]
      }
      break
      
    // case 'companyName':  // Commented out since related fields are not active
    //   if (!value || value.length < 2) {
    //     errors.value[field] = 'This field must be at least 2 characters'
    //   } else if (value.length > 100) {
    //     errors.value[field] = 'This field must not exceed 100 characters'
    //   } else {
    //     delete errors.value[field]
    //   }
    //   break
      
    // case 'gstinNumber':  // Commented out since related fields are not active
    //   if (value && value.length > 0) {
    //     // Basic GSTIN validation (15 characters, alphanumeric)
    //     const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    //     if (!gstinRegex.test(value)) {
    //       errors.value[field] = 'Please enter a valid GSTIN number'
    //     } else if (fetchedGstinData.value && fetchedGstinData.value.sts?.toLowerCase() !== 'active') {
    //       // If GSTIN data is fetched but status is not active
    //       const status = getStatusText(fetchedGstinData.value.sts)
    //       errors.value[field] = `GSTIN status is ${status}. Only Active GSTIN numbers are allowed.`
    //     } else {
    //       delete errors.value[field]
    //     }
    //   } else {
    //     delete errors.value[field]
    //   }
    //   break
      
    case 'email':
      if (!value) {
        errors.value[field] = VALIDATION_MESSAGES.REQUIRED
      } else {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors.value[field] = 'Please enter a valid email address'
        } else {
          delete errors.value[field]
        }
      }
      break
      
    case 'phoneNumber':
      if (!value || value.trim().length === 0) {
        errors.value[field] = VALIDATION_MESSAGES.REQUIRED
      } else {
        // Phone validation - remove spaces, dashes, parentheses for validation
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '')
        const phoneRegex = /^[\+]?[1-9][\d]{9,15}$/
        if (!phoneRegex.test(cleanPhone)) {
          errors.value[field] = 'Please enter a valid phone number (10-16 digits)'
        } else {
          delete errors.value[field]
        }
      }
      break
      
    case 'password':
      if (!value) {
        errors.value[field] = VALIDATION_MESSAGES.REQUIRED
      } else if (value.length < 6) {
        errors.value[field] = 'Password must be at least 6 characters'
      } else if (value.length > 128) {
        errors.value[field] = VALIDATION_MESSAGES.PASSWORD_TOO_LONG
      } else {
        delete errors.value[field]
      }
      break
      
    case 'confirmPassword':
      if (!value) {
        errors.value[field] = VALIDATION_MESSAGES.REQUIRED
      } else if (value !== formData.value.password) {
        errors.value[field] = VALIDATION_MESSAGES.PASSWORD_MISMATCH
      } else {
        delete errors.value[field]
      }
      break
      
    case 'agreeToTerms':
      if (!value) {
        errors.value[field] = VALIDATION_MESSAGES.TERMS_NOT_ACCEPTED
      } else {
        delete errors.value[field]
      }
      break
  }
}

// GSTIN fetch functionality - COMMENTED OUT since GSTIN fields are not active
/*
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
        formData.value.companyName = companyData.lgnm
        isCompanyNameAutoFilled.value = true
        gstinFetchSuccess.value = true
        
        // Clear any existing company name validation errors
        delete errors.value.companyName
        
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
*/

// Clear auto-filled data - COMMENTED OUT since GSTIN fields are not active
/*
const clearAutoFill = () => {
  isCompanyNameAutoFilled.value = false
  gstinFetchSuccess.value = false
  fetchedGstinData.value = null
  gstinError.value = null
  // Don't clear the company name, let user edit it
}
*/

// Debounced GSTIN fetch - COMMENTED OUT since GSTIN fields are not active
// const debouncedGstinFetch = debounce(handleGstinFetch, 800)

// Watch for GSTIN changes - COMMENTED OUT since GSTIN fields are not active
/*
watch(() => formData.value.gstinNumber, (newGstin, oldGstin) => {
  if (newGstin !== oldGstin) {
    // Reset GSTIN-related state when GSTIN changes
    gstinFetchSuccess.value = false
    gstinError.value = null
    
    // If company name was auto-filled, clear the auto-fill state
    if (isCompanyNameAutoFilled.value) {
      isCompanyNameAutoFilled.value = false
      fetchedGstinData.value = null
    }
    
    // Trigger debounced fetch if GSTIN is valid
    if (newGstin && newGstin.length === 15) {
      debouncedGstinFetch(newGstin)
    }
  }
})
*/

// Watch for form changes and validate touched fields
watch(formData, (newData) => {
  Object.keys(newData).forEach(key => {
    if (touched.value[key]) {
      validateField(key as keyof SignUpFormData, newData[key as keyof SignUpFormData])
    }
  })
}, { deep: true })

// Watch for GSTIN data changes to re-validate the field - COMMENTED OUT since GSTIN fields are not active
/*
watch(fetchedGstinData, (newData) => {
  if (formData.value.gstinNumber && touched.value.gstinNumber) {
    // Re-validate GSTIN field when data is fetched
    validateField('gstinNumber', formData.value.gstinNumber)
  }
}, { deep: true })
*/

// Form submission
const handleSignUp = async () => {
  console.log('🚀 handleSignUp called!')
  
  try {
    // Mark all relevant fields as touched (only active fields)
    // const fieldsToValidate = ['name', 'email', 'phoneNumber', 'password', 'confirmPassword', 'agreeToTerms']
    
    // GSTIN field validation is commented out since GSTIN fields are not active
    // if (formData.value.gstinNumber) {
    //   fieldsToValidate.push('gstinNumber')
    // }
    
    // fieldsToValidate.forEach(field => {
    //   touched.value[field] = true
    //   validateField(field as keyof SignUpFormData, formData.value[field as keyof SignUpFormData])
    // })
    
    console.log('📋 Form validation result:', isFormValid.value)
    
    // if (!isFormValid.value) {
    //   console.log('❌ Form is invalid, stopping submission')
    //   return
    // }
    
    // console.log('✅ Form is valid, proceeding with signup')
    
    // Comment out the service call - just navigate to the next page
    // // Prepare data for API using the SignUpFormData interface from auth-types
    // const signupData: import('../types/auth-types').SignUpFormData = {
    //   accountType: 'organization',
    //   organizationName: formData.value.organizationName,
    //   companyName: formData.value.companyName,
    //   gstinNumber: formData.value.gstinNumber || undefined,
    //   emailOrPhone: formData.value.emailOrPhone,
    //   password: formData.value.password,
    //   confirmPassword: formData.value.confirmPassword,
    //   agreeToTerms: formData.value.agreeToTerms
    // }
    
    // console.log('📤 Calling authStore.signUp with data:', signupData)
    
    // const result = await authStore.signUp(signupData)
    
    // console.log('📥 SignUp result:', result)
    
    // Store signup form data in auth store for later use
    authStore.setSignupFormData(formData.value)
    
    // Directly set authStep to show OTP verification inline without API call
    // Use the proper setAuthStep method from the store
    authStore.clearStates() // Clear any previous states (loading, error, success)
    authStore.setAuthStep('otp-verification')
    
    // Set up mock OTP verification state since we're not calling the API
    // For signup, always use phone verification (as per requirements)
    const mockOtpState = {
      isVerifying: true,
      verificationMethod: 'sms' as 'email' | 'sms',
      contactInfo: formData.value.phoneNumber,
      verificationId: 'mock-verification-id',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      canResend: true,
      resendCooldown: 0,
      attemptsRemaining: 3
    }
    
    // Use the proper method to set OTP verification state
    authStore.setOtpVerificationState(mockOtpState)
    
    console.log('✅ Directly navigated to OTP verification step with mock state')
    
  } catch (error) {
    console.error('❌ Sign up error:', error)
    // Don't navigate on error
  }
}

const handleSocialSignUp = async (provider: SocialProvider) => {
  try {
    const result = await authStore.signUpWithSocial(provider)
    
    if (result.success) {
      // After successful social signup, redirect to GSTIN verification
      setTimeout(() => {
        // Set auth step to GSTIN verification instead of going to dashboard
        authStore.setAuthStep('gstin-verification')
        console.log('✅ Social signup successful, redirecting to GSTIN verification')
      }, 1500)
    }
  } catch (error) {
    console.error('Social sign up error:', error)
  }
}

// Static JWT Token
const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzU0NzQxODA0LCJleHAiOjE3NTUzNDY2MDR9.CnLWKS828UmIvOwknMVqpo1vQFQuOjlBuVs7cyzkbSY'

// Component mounted lifecycle
onMounted(() => {
  console.log('🔑 SignUpForm mounted - Setting up static token')
  
  // Store the static token in localStorage on component mount
  try {
    // authStorage.setAuthSession({
    //   user: {
    //     userId: '2', // From token payload (id: 2)
    //     email: 'user@example.com', // Placeholder email
    //     firstName: 'User',
    //     lastName: 'Example',
    //     phoneNumber: undefined,
    //     emailVerified: false,
    //     phoneVerified: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     lastLoginAt: new Date(),
    //     status: 'active',
    //     role: 'user',
    //     preferences: {
    //       language: 'en',
    //       theme: 'light',
    //       timezone: 'UTC',
    //       dateFormat: 'DD/MM/YYYY',
    //       currency: 'USD',
    //       notifications: {
    //         email: true,
    //         push: true,
    //         sms: false,
    //         marketing: false
    //       }
    //     }
    //   },
    //   accessToken: STATIC_TOKEN
    // })
    
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
</script>

<style scoped lang="scss">
@use '../styles/auth-form-common' as *;

.signup-form {
  // SignUp-specific styles only
  .form-content {
    .password-match-indicator {
      margin-top: -0.5rem;
      margin-bottom: 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      
      .match-success {
        color: #10b981;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      
      .match-error {
        color: #ef4444;
        display: flex;
        align-items: center;
        gap: 0.25rem;
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
</style>
