<template>
  <FcxDialog
    v-model:visible="dialogVisible"
    :modal="true"
    :closable="true"
    :draggable="false"
    :resizable="false"
    size="m"
    position="center"
    :dismissableMask="false"
    :closeOnEscape="true"
    :showHeader="false"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    @hide="handleDialogHide"
    ref="dialogRef"
  >
    <!-- Dynamic Content Based on Phase -->
    <GstinInputForm 
      v-if="gstinStore.isInputPhase"
      :is-loading="gstinStore.isLoading"
      @submit="handleInputSubmit"
      @cancel="closeDialog"
    />
    
    <GstinVerificationForm 
      v-else-if="gstinStore.isVerificationPhase && gstinStore.fetchedGstinData"
      :gstin-data="gstinStore.fetchedGstinData"
      :is-loading="gstinStore.isLoading"
      @confirm="handleVerificationConfirm"
      @back="goToInputPhase"
      @cancel="closeDialog"
    />
    
    <GstinOtpForm 
      v-else-if="gstinStore.isOtpPhase"
      :is-loading="gstinStore.isLoading"
      :error-message="gstinStore.error || ''"
      @verify="handleOtpVerify"
      @back="goToVerificationPhase"
      @cancel="closeDialog"
      @resend-otp="handleResendOtp"
    />
    
    <GstinLoadingState 
      v-else-if="gstinStore.isLoadingPhase"
      :message="gstinStore.loadingMessage"
      :title="loadingTitle"
    />
    
    <GstinSuccessState 
      v-else-if="gstinStore.isSuccessPhase && gstinStore.createdGstinAccount"
      :gstin-data="gstinStore.createdGstinAccount"
      @close="handleSuccessClose"
    />

    <!-- Error State -->
    <div v-else-if="gstinStore.hasError" class="error-state">
      <div class="error-content">
        <div class="error-icon">
          <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
        </div>
        <h3 class="error-title">Validation Error</h3>
        <p class="error-message">{{ gstinStore.error }}</p>
        <div class="error-details">
          <p>Please check the following:</p>
          <ul>
            <li>GST Username is required and must be valid</li>
            <li>GSTIN must be exactly 15 characters</li>
            <li>All fields must be filled correctly</li>
          </ul>
        </div>
        <div class="error-actions">
          <FcxButton
            type="button"
            @click="handleRetry"
            severity="primary"
            variant="filled"
            size="large"
          >
            Try Again
          </FcxButton>
          <FcxButton
            type="button"
            @click="closeDialog"
            severity="secondary"
            variant="outlined"
            size="large"
          >
            Cancel
          </FcxButton>
        </div>
      </div>
    </div>
  </FcxDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGstinStore } from '../stores/gstinStore'
import { DialogPhase, type GstinInputData } from '../types/gstin-accounts-types'
import { validateGstinInputForm } from '../utils/gstin-validation'
import FcxButton from '@/components/buttoncomponents/FcxButton.vue'
import FcxDialog from '@/components/datacomponents/FcxDialog.vue'

// Import sub-components
import GstinInputForm from '../components/GstinInputForm.vue'
import GstinVerificationForm from '../components/GstinVerificationForm.vue'
import GstinOtpForm from '../components/GstinOtpForm.vue'
import GstinLoadingState from '../components/GstinLoadingState.vue'
import GstinSuccessState from '../components/GstinSuccessState.vue'

// Props
interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'gstin-added': [gstin: any]
  'close': []
}>()

// Store
const gstinStore = useGstinStore()

// Refs
const dialogRef = ref<HTMLElement>()

// Computed
const loadingTitle = computed(() => {
  switch (gstinStore.currentPhase) {
    case DialogPhase.LOADING:
      if (gstinStore.loadingMessage.includes('Fetching')) {
        return 'Fetching Details'
      } else if (gstinStore.loadingMessage.includes('Sending')) {
        return 'Sending OTP'
      } else if (gstinStore.loadingMessage.includes('Verifying')) {
        return 'Verifying OTP'
      }
      return 'Processing'
    default:
      return 'Processing'
  }
})

// Computed property for FcxDialog v-model
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    if (!value) {
      closeDialog()
    }
  }
})

// Methods
const closeDialog = () => {
  emit('update:visible', false)
  emit('close')
  
  // Reset store after a short delay to allow transition
  setTimeout(() => {
    gstinStore.resetStore()
  }, 300)
}

const handleDialogHide = () => {
  // Handle FcxDialog hide event
  emit('close')
}


const handleInputSubmit = async (data: GstinInputData) => {
  try {
    // Validate input data before making API call
    const validation = validateGstinInputForm(data)
    if (!validation.isValid) {
      console.error('Form validation failed:', validation.errors)
      // Don't proceed with API call if validation fails
      return
    }

    // Store the input data directly (bypassing potential HMR issues)
    gstinStore.inputData.username = data.username
    gstinStore.inputData.gstin = data.gstin
    gstinStore.inputData.stateCode = data.stateCode
    
    // Fetch GSTIN details
    await gstinStore.fetchGstinDetails(data.gstin)
  } catch (error) {
    console.error('Error in handleInputSubmit:', error)
    // Let the store handle the error
  }
}

const handleVerificationConfirm = async () => {
  // Send OTP
  await gstinStore.sendOtp()
}

const handleOtpVerify = async (otp: string) => {
  // Verify OTP
  await gstinStore.verifyOtp(otp)
}

const handleResendOtp = async () => {
  // Resend OTP
  await gstinStore.sendOtp()
}

const handleSuccessClose = () => {
  // Emit GSTIN added event
  if (gstinStore.createdGstinAccount) {
    emit('gstin-added', gstinStore.createdGstinAccount)
  }
  
  closeDialog()
}

const handleRetry = () => {
  // Go back to appropriate phase based on error context
  gstinStore.goToPreviousPhase()
}

const goToInputPhase = () => {
  gstinStore.setPhase(DialogPhase.INPUT)
}

const goToVerificationPhase = () => {
  gstinStore.setPhase(DialogPhase.VERIFICATION)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.visible) return

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      closeDialog()
      break
  }
}


// Watchers
watch(() => props.visible, async (newVisible) => {
  if (newVisible) {
    // Reset store when dialog opens
    gstinStore.resetStore()
    // Focus is now handled at the component level (GstinInputForm)
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
// Theme variables
:root {
  --dialog-backdrop: rgba(0, 0, 0, 0.5);
  --dialog-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

:root[data-theme="dark"] {
  --dialog-backdrop: rgba(0, 0, 0, 0.7);
  --dialog-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

// Dialog backdrop
.gstin-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dialog-backdrop);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

// Dialog container
.gstin-dialog-container {
  position: relative;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--dialog-shadow);
}

// Error state styles
.error-state {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 60px 40px;
  text-align: center;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: #fee2e2;
  border-radius: 50%;
  color: #ef4444;
}

.error-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.error-message {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
  max-width: 300px;
}

.error-details {
  margin-top: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
  
  p {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    
    li {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.4;
      margin-bottom: 4px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.error-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

// Transitions
.dialog-backdrop-enter-active,
.dialog-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-backdrop-enter-from,
.dialog-backdrop-leave-to {
  opacity: 0;
}

.dialog-content-enter-active,
.dialog-content-leave-active {
  transition: all 0.3s ease;
}

.dialog-content-enter-from,
.dialog-content-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

// Dark theme support
:root[data-theme="dark"] {
  .error-state {
    background: #1f2937;
  }

  .error-title {
    color: #f9fafb;
  }

  .error-message {
    color: #d1d5db;
  }

  .error-details {
    background: #374151;
    border-left-color: #ef4444;
    
    p {
      color: #f3f4f6;
    }
    
    ul li {
      color: #d1d5db;
    }
  }

  .error-icon {
    background: #7f1d1d;
    color: #ef4444;
  }
}

// Mobile responsive
@media (max-width: 640px) {
  .gstin-dialog-backdrop {
    align-items: flex-end;
    padding: 0;
  }
  
  .gstin-dialog-container {
    width: 100%;
    max-height: 95vh;
    border-radius: 12px 12px 0 0;
  }

  .error-content {
    padding: 40px 20px;
  }

  .error-actions {
    flex-direction: column;
    width: 100%;
    
    button {
      width: 100%;
    }
  }
}
</style>