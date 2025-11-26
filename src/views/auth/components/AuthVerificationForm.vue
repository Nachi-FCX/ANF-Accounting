<template>
  <div class="auth-verification-form">
    <div class="form-header">
      <h1>{{ dynamicContent.title }}</h1>
      <p class="form-subtitle">{{ dynamicContent.subtitle }}</p>
    </div>
    
    <form @submit.prevent="handleVerification" class="verification-form-content">
      <!-- Email Input (show when verification type is email) -->
      <div v-if="verificationType === 'email'" class="form-group">
        <!-- <label for="email" class="form-label">Email</label> -->
        <FcxInputtext
          id="email"
          name="email"
          placeholder="Enter your email address"
          autocomplete="email"
          required
          v-model="formData.email"
          class="email-input"
        />
      </div>

      <!-- Phone Input (show when verification type is phone) -->
      <div v-else-if="verificationType === 'phone'" class="form-group">
        <!-- <label for="phone" class="form-label">Phone Number</label> -->
        <FcxInputtext
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          autocomplete="tel"
          required
          v-model="formData.phoneNumber"
          class="phone-input"
        />
      </div>

      <!-- Verification Section -->
      <div class="verification-section">
        <h3 class="verification-title">Verify your account</h3>
        <div class="verification-box" :class="{ 'verified': isVerified, 'verifying': isVerifying }">
          <div v-if="!isVerifying && !isVerified" class="verification-pending">
            <div class="verification-placeholder">
              <span class="verification-text">{{ dynamicContent.verificationText }}</span>
            </div>
          </div>
          
          <div v-if="isVerifying" class="verification-loading">
            <div class="spinner"></div>
            <span class="verification-text">Verifying...</span>
          </div>
          
          <div v-if="isVerified" class="verification-complete">
            <div class="checkmark-container">
              <svg class="checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div class="verification-details">
              <span class="verification-status">Verification complete!</span>
              <span class="verification-id">{{ verificationId }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <FcxButton
        type="submit"
        :label="dynamicContent.buttonLabel"
        severity="success"
        size="large"
        :block="true"
        :loading="isLoading"
        :disabled="!isFormValid || isLoading"
        class="verification-submit-btn"
      />
      
      <!-- Back to Sign In link -->
      <div class="signin-link">
        <p>Remember your password? 
          <router-link to="/auth/signin" class="link">Back to Sign In</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'


const authStore = useAuthStore()
const router = useRouter()

// Form data
const formData = ref({
  email: '',
  phoneNumber: ''
})

// Verification state
const isVerifying = ref(false)
const isVerified = ref(false)
const verificationId = ref('')

// Computed properties
const isLoading = computed(() => authStore.isLoading)

// Check if we're coming from signup and determine verification type
const signupData = computed(() => authStore.signupFormData)
const isFromSignup = computed(() => signupData.value !== null)
const verificationType = computed(() => {
  if (isFromSignup.value && signupData.value?.phoneNumber) {
    return 'phone'
  }
  return 'email'
})

// Set initial values based on signup data
const initializeFormData = () => {
  if (isFromSignup.value && signupData.value) {
    if (verificationType.value === 'phone') {
      formData.value.phoneNumber = signupData.value.phoneNumber
      formData.value.email = ''
    } else {
      formData.value.email = signupData.value.email
      formData.value.phoneNumber = ''
    }
  }
}

const isFormValid = computed(() => {
  if (verificationType.value === 'phone') {
    return validatePhoneNumber(formData.value.phoneNumber)
  } else {
    return validateEmail(formData.value.email)
  }
})

// Validation helper functions
const validateEmail = (email: string): boolean => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return false
  // Remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  // Check if it's a valid phone number (10-15 digits, may start with +)
  const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/
  return phoneRegex.test(cleanPhone)
}

// Dynamic content based on verification type
const dynamicContent = computed(() => {
  if (verificationType.value === 'phone') {
    return {
      title: isFromSignup.value ? 'Verify your phone number' : 'Reset your password',
      subtitle: isFromSignup.value 
        ? 'Enter your phone number to complete account verification' 
        : 'Enter your phone number and we will send you a verification code',
      buttonLabel: isFromSignup.value ? 'Send verification code' : 'Send reset code',
      verificationText: 'Click "Send verification code" to verify',
      successMessage: isFromSignup.value ? 'Phone verification sent!' : 'Reset code sent!',
      contactType: 'phone number'
    }
  } else {
    return {
      title: isFromSignup.value ? 'Verify your email address' : 'Reset your password',
      subtitle: isFromSignup.value 
        ? 'Enter your email address to complete account verification'
        : 'Enter your user account\'s verified email address and we will send you a password reset link',
      buttonLabel: isFromSignup.value ? 'Send verification email' : 'Send password reset email',
      verificationText: 'Click "Send verification email" to verify',
      successMessage: isFromSignup.value ? 'Email verification sent!' : 'Password reset email sent!',
      contactType: 'email address'
    }
  }
})

// Methods
const handleVerification = async () => {
  try {
    if (!isFormValid.value) {
      return
    }
    
    // Start verification process
    isVerifying.value = true
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete verification
    isVerifying.value = false
    isVerified.value = true
    verificationId.value = generateVerificationId()
    
    // Use the same service method but with appropriate contact info
    const contactInfo = verificationType.value === 'phone' ? formData.value.phoneNumber : formData.value.email
    const result = await authStore.sendPasswordResetEmail(contactInfo)
    
    if (result.success) {
      // Wait a moment to show the success message, then redirect
      setTimeout(() => {
        router.push('/auth/signin')
      }, 3000) // 3 seconds to show the success message
    }
  } catch (error) {
    console.error('Verification error:', error)
    isVerifying.value = false
    isVerified.value = false
  }
}

const generateVerificationId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Initialize form data on component mount
onMounted(() => {
  initializeFormData()
})
</script>

<style scoped lang="scss">
.auth-verification-form {
  max-width: 100%;
  width: 100%;
  
  .form-header {
    text-align: center;
    margin-bottom: 2rem;
    
    h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .form-subtitle {
      color: #6b7280;
      font-size: 1rem;
      margin: 0;
      line-height: 1.5;
    }
  }
  
  .verification-form-content {
    .form-group {
      margin-bottom: 1.5rem;
      
      .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.5rem;
      }
      
      .email-input {
        width: 100%;
      }
    }
    
    .verification-section {
      margin-bottom: 2rem;
      
      .verification-title {
        font-size: 1rem;
        font-weight: 500;
        color: #374151;
        margin: 0 0 0.75rem 0;
      }
      
      .verification-box {
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        padding: 2rem;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9fafb;
        transition: all 0.3s ease;
        
        &.verifying {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        
        &.verified {
          border-color: #10b981;
          background: #ecfdf5;
        }
        
        .verification-pending {
          text-align: center;
          color: #6b7280;
          
          .verification-text {
            font-size: 0.875rem;
          }
        }
        
        .verification-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #3b82f6;
          
          .spinner {
            width: 24px;
            height: 24px;
            border: 2px solid #e5e7eb;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .verification-text {
            font-size: 0.875rem;
            font-weight: 500;
          }
        }
        
        .verification-complete {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #10b981;
          
          .checkmark-container {
            flex-shrink: 0;
            
            .checkmark {
              width: 32px;
              height: 32px;
              color: #10b981;
              background: #dcfce7;
              border-radius: 50%;
              padding: 6px;
            }
          }
          
          .verification-details {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            
            .verification-status {
              font-size: 0.875rem;
              font-weight: 600;
              color: #10b981;
            }
            
            .verification-id {
              font-size: 0.75rem;
              color: #6b7280;
              font-family: monospace;
            }
          }
        }
      }
    }
    
    .verification-submit-btn {
      margin-bottom: 2rem;
    }
    
    .signin-link {
      text-align: center;
      
      p {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
      }
      
      .link {
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Responsive design
@media (max-width: 768px) {
  .auth-verification-form {
    .form-header h1 {
      font-size: 1.75rem;
    }
    
    .verification-form-content .verification-section .verification-box {
      padding: 1.5rem;
      min-height: 100px;
    }
  }
}

@media (max-width: 480px) {
  .auth-verification-form {
    .form-header h1 {
      font-size: 1.5rem;
    }
    
    .verification-form-content {
      .form-group {
        margin-bottom: 1.25rem;
      }
      
      .verification-section .verification-box {
        padding: 1rem;
        min-height: 80px;
        
        .verification-complete {
          flex-direction: column;
          text-align: center;
          gap: 0.75rem;
        }
      }
    }
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .auth-verification-form {
    .form-header h1 {
      color: #f9fafb;
    }
    
    .verification-form-content {
      .form-label {
        color: #d1d5db;
      }
      
      .verification-section {
        .verification-title {
          color: #d1d5db;
        }
        
        .verification-box {
          background: #1f2937;
          border-color: #374151;
          
          &.verifying {
            background: #1e3a8a;
            border-color: #3b82f6;
          }
          
          &.verified {
            background: #064e3b;
            border-color: #10b981;
          }
        }
      }
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .auth-verification-form .verification-form-content {
    .verification-box {
      transition: none;
    }
    
    .verification-loading .spinner {
      animation: none;
    }
    
    .verification-submit-btn {
      transition: none;
      
      &:hover:not(:disabled) {
        transform: none;
      }
    }
  }
}
</style>
