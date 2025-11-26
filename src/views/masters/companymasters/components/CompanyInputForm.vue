<template>
  <div class="company-input-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2 class="form-title">Add Company</h2>
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

    <!-- Form Content -->
    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- GST Username Field -->
      <FcxInputtext
        name="username"
        label="GST Username"
        v-model="formData.username"
        placeholder="Enter GST username"
        :disabled="isLoading"
        required
        :autofocus="true"
        :max-length="50"
        :error="errors.username"
        @input="() => clearFieldError('username')"
      />

      <!-- GSTIN Field -->
      <FcxInputtext
        name="gstin"
        label="GSTIN"
        v-model="formData.gstin"
        placeholder="e.g., 36AAACH7409R1Z2"
        :disabled="isLoading"
        required
        :max-length="15"
        @input="handleGstinInput"
        :error="errors.gstin"
      />

      <!-- State Code Field -->
      <!-- <FcxInputtext
        name="stateCode"
        label="State Code"
        v-model="formData.stateCode"
        placeholder="e.g., 12"
        :disabled="isLoading"
        required
        :max-length="2"
        :error="errors.stateCode"
        @input="() => clearFieldError('stateCode')"
      /> -->

      <!-- Submit Button -->
      <div class="form-actions">
        <FcxButton
          type="submit"
          :disabled="isLoading"
          :loading="isLoading"
          severity="success"
          variant="filled"
          size="large"
          class="submit-button"
        >
          Add
        </FcxButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import type { CompanyInputData } from '../types/company-types'
import { validateCompanyInputForm } from '../utils/company-validation'
import { extractStateCodeFromGSTIN, cleanGSTIN } from '../utils/company-helpers'

// Props
interface Props {
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

// Emits
const emit = defineEmits<{
  submit: [data: CompanyInputData]
  cancel: []
}>()

// Form data
const formData = ref<CompanyInputData>({
  username: '',
  gstin: '',
  stateCode: ''
})

// Form errors
const errors = ref<Record<string, string>>({})

// Computed
// const isFormValid = computed(() => {
//   const validation = validateCompanyInputForm(formData.value)
//   return validation.isValid && Object.keys(errors.value).length === 0
// })

// // Methods
// const validateField = (fieldName: keyof CompanyInputData) => {
//   const validation = validateCompanyInputForm(formData.value)
  
//   if (validation.errors[fieldName]) {
//     errors.value[fieldName] = validation.errors[fieldName]
//   } else {
//     delete errors.value[fieldName]
//   }
// }

const validateAllFields = () => {
  const validation = validateCompanyInputForm(formData.value)
  errors.value = { ...validation.errors }
  return validation.isValid
}

const clearFieldError = (fieldName: keyof typeof errors.value) => {
  if (errors.value[fieldName]) {
    delete errors.value[fieldName]
  }
}

const handleGstinInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const cleanedGstin = cleanGSTIN(target.value)
  
  // Update GSTIN
  formData.value.gstin = cleanedGstin
  
  // Auto-extract state code if GSTIN is valid length
  if (cleanedGstin.length >= 2) {
    const extractedStateCode = extractStateCodeFromGSTIN(cleanedGstin)
    if (extractedStateCode && extractedStateCode !== formData.value.stateCode) {
      formData.value.stateCode = extractedStateCode
      // Clear state code error if it was set
      clearFieldError('stateCode')
    }
  }
  
  // Clear GSTIN error on input
  clearFieldError('gstin')
}

const handleSubmit = () => {
  const isValid = validateAllFields()
  
  if (isValid) {
    emit('submit', { ...formData.value })
  } else {
    // Focus on the first field with an error for better UX
    const firstErrorField = Object.keys(errors.value)[0]
    if (firstErrorField) {
      const fieldElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
      if (fieldElement && typeof fieldElement.focus === 'function') {
        fieldElement.focus()
      }
    }
    console.warn('Form validation failed:', errors.value)
  }
}

// Watch for prop changes to clear errors
watch(() => props.isLoading, (newLoading) => {
  if (!newLoading) {
    // Clear errors when loading stops (in case of API errors)
    // Keep form data intact for user to retry
  }
})
</script>

<style lang="scss" scoped>
.company-input-form {
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

.form-content {
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-actions {
  margin-top: 8px;
}

.submit-button {
  width: 100%;
  background: #10b981 !important;

  &:hover:not(:disabled) {
    background: #059669 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
}

// Dark theme support
:root[data-theme="dark"] {
  .company-input-form {
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
}

// Mobile responsive
@media (max-width: 640px) {
  .company-input-form {
    width: 100%;
    max-width: none;
    border-radius: 12px 12px 0 0;
  }

  .form-header {
    padding: 20px 20px 0 20px;
  }

  .form-content {
    padding: 0 20px 20px 20px;
  }

  .form-title {
    font-size: 18px;
  }
}
</style>
