<template>
  <div class="gstin-input-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2 class="form-title">Add GSTIN</h2>
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
      <!-- Validation Summary -->
      <div v-if="hasErrors" class="validation-summary">
        <div class="validation-icon">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
        </div>
        <div class="validation-content">
          <h4>Please fix the following errors:</h4>
          <ul>
            <li v-for="(error, field) in errors" :key="field">
              {{ field === 'username' ? 'GST Username' : field === 'gstin' ? 'GSTIN' : field }}: {{ error }}
            </li>
          </ul>
        </div>
      </div>

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
        help="Enter your registered GST username"
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
        help="15-digit Goods and Services Tax Identification Number"
      />

      <!-- Submit Button -->
      <div class="form-actions">
        <FcxButton
          type="submit"
          :disabled="isLoading || hasErrors"
          :loading="isLoading"
          severity="success"
          variant="filled"
          size="large"
          class="submit-button"
        >
          {{ isLoading ? 'Validating...' : 'Add GSTIN' }}
        </FcxButton>
        
        <!-- Form status indicator -->
        <div v-if="hasErrors" class="form-status error">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
          Please fix the errors above
        </div>
        
        <div v-else-if="Object.keys(formData).every(key => formData[key as keyof typeof formData])" class="form-status ready">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Ready to submit
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import type { GstinInputData } from '../types/gstin-accounts-types'
import { validateGstinInputForm } from '../utils/gstin-validation'
import { extractStateCodeFromGSTIN, cleanGSTIN } from '../utils/gstin-helpers'

// Props
interface Props {
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

// Emits
const emit = defineEmits<{
  submit: [data: GstinInputData]
  cancel: []
}>()

// Form data
const formData = ref<GstinInputData>({
  username: '',
  gstin: '',
  stateCode: ''
})

// Form errors
const errors = ref<Record<string, string>>({})

// Computed properties
const hasErrors = computed(() => Object.keys(errors.value).length > 0)

const validateAllFields = () => {
  const validation = validateGstinInputForm(formData.value)
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
  // Clear any previous errors
  errors.value = {}
  
  const isValid = validateAllFields()
  
  if (isValid) {
    // Double-check that required fields are not empty before submitting
    if (!formData.value.username || formData.value.username.trim() === '') {
      errors.value.username = 'This field is required'
      return
    }
    
    if (!formData.value.gstin || formData.value.gstin.trim() === '') {
      errors.value.gstin = 'This field is required'
      return
    }
    
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
.gstin-input-form {
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

.validation-summary {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-bottom: 8px;
}

.validation-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: #ef4444;
}

.validation-content {
  flex: 1;
  
  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #dc2626;
  }
  
  ul {
    margin: 0;
    padding-left: 16px;
    
    li {
      font-size: 13px;
      color: #991b1b;
      line-height: 1.4;
      margin-bottom: 4px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
}

.form-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  
  &.error {
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
  }
  
  &.ready {
    color: #059669;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
  }
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
}

// Dark theme support
:root[data-theme="dark"] {
  .gstin-input-form {
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
  .gstin-input-form {
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