<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Label -->
    <label
      v-if="label"
      :for="toggleId"
      class="fcx-field-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <!-- ToggleButton wrapper -->
    <div class="fcx-togglebutton-wrapper">
      <!-- ToggleButton element -->
      <ToggleButton
        :id="toggleId"
        ref="toggleRef"
        :model-value="value"
        :on-label="onLabel"
        :off-label="offLabel"
        :on-icon="onIcon"
        :off-icon="offIcon"
        :disabled="disabled || loading"
        :class="toggleClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-togglebutton-loading">
        <div class="fcx-spinner" />
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="fcx-field-error">
      <svg class="fcx-error-icon" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      {{ errorMessage }}
    </div>

    <!-- Help text -->
    <div v-if="help && !errorMessage" class="fcx-field-help">
      {{ help }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useField } from 'vee-validate'
import ToggleButton from 'primevue/togglebutton'
import type { ToggleButtonProps } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<ToggleButtonProps>(), {
  size: 'md',
  onLabel: 'On',
  offLabel: 'Off',
  onIcon: 'pi pi-check',
  offIcon: 'pi pi-times'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [event: { originalEvent: Event; value: boolean }]
  'blur': [event: Event]
  'focus': [event: Event]
}>()

// Template refs
const toggleRef = ref<any>()

// Generate unique ID for the toggle button
const toggleId = computed(() => `fcx-togglebutton-${props.name}`)

// Build validation rules from props
const validationRules = computed(() => {
  // If legacy rules prop is provided, use it
  if (props.rules) {
    return props.rules
  }
  
  // For toggle buttons, required means must be true
  if (props.required) {
    return 'required'
  }
  
  return buildValidationString({
    required: props.required,
    validationType: props.validationType
  })
})

// VeeValidate integration
const {
  value,
  errorMessage,
  handleBlur: veeHandleBlur,
  handleChange: veeHandleChange,
  meta
} = useField(() => props.name, validationRules, {
  initialValue: props.modelValue || false,
  syncVModel: true
})

// Computed properties
const fieldClass = computed(() => [
  props.class,
  {
    'fcx-field--error': !!errorMessage.value,
    'fcx-field--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-field--disabled': props.disabled,
    'fcx-field--loading': props.loading
  }
])

const toggleClasses = computed(() => [
  'fcx-togglebutton',
  `fcx-togglebutton--${props.size}`,
  {
    'fcx-togglebutton--error': !!errorMessage.value,
    'fcx-togglebutton--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-togglebutton--loading': props.loading,
    'fcx-togglebutton--on': value.value
  }
])

// Event handlers
const handleChange = (event: any) => {
  value.value = event.value
  emit('update:modelValue', event.value)
  emit('change', event)
  veeHandleChange(event.originalEvent || event)
}

const handleBlur = (event: any) => {
  veeHandleBlur(event)
  emit('blur', event)
}

const handleFocus = (event: any) => {
  emit('focus', event)
}

// Public methods (exposed to parent)
const focus = () => {
  if (toggleRef.value) {
    toggleRef.value.focus()
  }
}

const blur = () => {
  if (toggleRef.value) {
    toggleRef.value.blur()
  }
}

// Expose methods to parent component
defineExpose({
  focus,
  blur,
  toggleRef
})
</script>

<style scoped>
fcx-togglebutton-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

fcx-togglebutton-loading {
  position: absolute;
  right: var(--fcx-spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

fcx-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--fcx-border-light);
  border-top: 2px solid var(--fcx-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Size variants */
fcx-togglebutton--sm {
  font-size: var(--fcx-font-size-sm);
  padding: var(--fcx-spacing-xs) var(--fcx-spacing-sm);
}

fcx-togglebutton--lg {
  font-size: var(--fcx-font-size-lg);
  padding: var(--fcx-spacing-md) var(--fcx-spacing-lg);
}

/* State variants */
fcx-togglebutton--error {
  border-color: var(--fcx-error-500);
}

fcx-togglebutton--success {
  border-color: var(--fcx-success-500);
}

fcx-togglebutton--loading {
  opacity: 0.7;
}

fcx-togglebutton--on {
  background: var(--fcx-primary-500);
  border-color: var(--fcx-primary-500);
  color: var(--fcx-text-inverse);
}

/* Custom toggle button styling */
fcx-togglebutton :deep(.p-togglebutton) {
  border-radius: var(--fcx-border-radius-md);
  transition: all var(--fcx-transition-duration) var(--fcx-transition-timing);
  font-weight: var(--fcx-font-weight-medium);
}

fcx-togglebutton :deep(.p-togglebutton:hover) {
  border-color: var(--fcx-primary-400);
}

fcx-togglebutton :deep(.p-togglebutton.p-highlight) {
  background: var(--fcx-primary-500);
  border-color: var(--fcx-primary-500);
  color: var(--fcx-text-inverse);
}

fcx-togglebutton :deep(.p-togglebutton.p-highlight:hover) {
  background: var(--fcx-primary-600);
  border-color: var(--fcx-primary-600);
}

fcx-togglebutton--error :deep(.p-togglebutton) {
  border-color: var(--fcx-error-500);
}

fcx-togglebutton--success :deep(.p-togglebutton) {
  border-color: var(--fcx-success-500);
}

/* Focus styles */
fcx-togglebutton :deep(.p-togglebutton:focus) {
  outline: 2px solid var(--fcx-primary-200);
  outline-offset: 2px;
}

/* Icon spacing */
fcx-togglebutton :deep(.p-togglebutton .p-button-icon) {
  margin-right: var(--fcx-spacing-xs);
}

fcx-togglebutton :deep(.p-togglebutton .p-button-icon:last-child) {
  margin-right: 0;
  margin-left: var(--fcx-spacing-xs);
}

/* Disabled state */
fcx-togglebutton :deep(.p-togglebutton:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
