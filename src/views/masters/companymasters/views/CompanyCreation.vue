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
    <CompanyInputForm 
      v-if="companyStore.isInputPhase"
      :is-loading="companyStore.isLoading"
      @submit="handleInputSubmit"
      @cancel="closeDialog"
    />
    
    <CompanyVerificationForm 
      v-else-if="companyStore.isVerificationPhase && companyStore.fetchedCompanyData"
      :company-data="companyStore.fetchedCompanyData"
      :is-loading="companyStore.isLoading"
      @confirm="handleVerificationConfirm"
      @back="goToInputPhase"
      @cancel="closeDialog"
    />
    
    <CompanyOtpForm 
      v-else-if="companyStore.isOtpPhase"
      :is-loading="companyStore.isLoading"
      :error-message="companyStore.error || ''"
      @verify="handleOtpVerify"
      @back="goToVerificationPhase"
      @cancel="closeDialog"
      @resend-otp="handleResendOtp"
    />
    
    <CompanyLoadingState 
      v-else-if="companyStore.isLoadingPhase"
      :message="companyStore.loadingMessage"
      :title="loadingTitle"
    />
    
    <CompanySuccessState 
      v-else-if="companyStore.isSuccessPhase && companyStore.fetchedCompanyData"
      :company-data="companyStore.fetchedCompanyData"
      @close="handleSuccessClose"
    />

    <!-- Error State -->
    <div v-else-if="companyStore.hasError" class="error-state">
      <div class="error-content">
        <div class="error-icon">
          <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
        </div>
        <h3 class="error-title">Something went wrong</h3>
        <p class="error-message">{{ companyStore.error }}</p>
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
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCompanyStore } from '../stores/companyStore'
import { DialogPhase, type CompanyInputData } from '../types/company-types'
import FcxButton from '@/components/buttoncomponents/FcxButton.vue'
import FcxDialog from '@/components/datacomponents/FcxDialog.vue'

// Import sub-components
import CompanyInputForm from '../components/CompanyInputForm.vue'
import CompanyVerificationForm from '../components/CompanyVerificationForm.vue'
import CompanyOtpForm from '../components/CompanyOtpForm.vue'
import CompanyLoadingState from '../components/CompanyLoadingState.vue'
import CompanySuccessState from '../components/CompanySuccessState.vue'

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
  'company-added': [company: any]
  'close': []
}>()

// Store
const companyStore = useCompanyStore()

// Refs
const dialogRef = ref<HTMLElement>()

// Computed
const loadingTitle = computed(() => {
  switch (companyStore.currentPhase) {
    case DialogPhase.LOADING:
      if (companyStore.loadingMessage.includes('Fetching')) {
        return 'Fetching Details'
      } else if (companyStore.loadingMessage.includes('Sending')) {
        return 'Sending OTP'
      } else if (companyStore.loadingMessage.includes('Verifying')) {
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
    companyStore.resetStore()
  }, 300)
}

const handleDialogHide = () => {
  // Handle FcxDialog hide event
  emit('close')
}

const handleBackdropClick = () => {
  // Allow closing on backdrop click
  closeDialog()
}

const handleInputSubmit = async (data: CompanyInputData) => {
  // Update store with input data
  companyStore.updateInputData(data)
  
  // Fetch company details
  await companyStore.fetchCompanyDetails(data.gstin)
}

const handleVerificationConfirm = async () => {
  // Send OTP
  await companyStore.sendOtp()
}

const handleOtpVerify = async (otp: string) => {
  // Verify OTP
  await companyStore.verifyOtp(otp)
}

const handleResendOtp = async () => {
  // Resend OTP
  await companyStore.sendOtp()
}

const handleSuccessClose = () => {
  // Emit company added event
  if (companyStore.fetchedCompanyData) {
    emit('company-added', companyStore.fetchedCompanyData)
  }
  
  closeDialog()
}

const handleRetry = () => {
  // Go back to appropriate phase based on error context
  companyStore.goToPreviousPhase()
}

const goToInputPhase = () => {
  companyStore.setPhase(DialogPhase.INPUT)
}

const goToVerificationPhase = () => {
  companyStore.setPhase(DialogPhase.VERIFICATION)
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
    companyStore.resetStore()
    // Focus is now handled at the component level (CompanyInputForm)
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
.company-dialog-backdrop {
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
.company-dialog-container {
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

  .error-icon {
    background: #7f1d1d;
    color: #ef4444;
  }
}

// Mobile responsive
@media (max-width: 640px) {
  .company-dialog-backdrop {
    align-items: flex-end;
    padding: 0;
  }
  
  .company-dialog-container {
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
