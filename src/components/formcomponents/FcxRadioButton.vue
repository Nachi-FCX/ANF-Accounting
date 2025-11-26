<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Radio button wrapper -->
    <div class="fcx-radiobutton-wrapper">
      <!-- RadioButton element -->
      <RadioButton
        :id="radioId"
        ref="radioRef"
        :model-value="value"
        :value="radioValue"
        :disabled="disabled || loading"
        :class="radioClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Label -->
      <label
        v-if="label"
        :for="radioId"
        class="fcx-radiobutton-label"
        :class="{ required, disabled: disabled || loading }"
      >
        {{ label }}
      </label>

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-radiobutton-loading">
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
import RadioButton from 'primevue/radiobutton'
import type { RadioButtonProps } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<RadioButtonProps>(), {
  size: 'md'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [event: { originalEvent: Event; value: any }]
  'blur': [event: Event]
  'focus': [event: Event]
}>()

// Template refs
const radioRef = ref<any>()

// Generate unique ID for the radio button
const radioId = computed(() => `fcx-radio-${props.name}-${props.value}`)

// Radio button value
const radioValue = computed(() => props.value)

// Build validation rules from props
const validationRules = computed(() => {
  // If legacy rules prop is provided, use it
  if (props.rules) {
    return props.rules
  }
  
  // Build from props
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
  initialValue: props.modelValue,
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

const radioClasses = computed(() => [
  'fcx-radiobutton',
  `fcx-radiobutton--${props.size}`,
  {
    'fcx-radiobutton--error': !!errorMessage.value,
    'fcx-radiobutton--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-radiobutton--loading': props.loading,
    'fcx-radiobutton--checked': value.value === props.value
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
  if (radioRef.value) {
    radioRef.value.focus()
  }
}

const blur = () => {
  if (radioRef.value) {
    radioRef.value.blur()
  }
}

// Expose methods to parent component
defineExpose({
  focus,
  blur,
  radioRef
})
</script>

<style scoped>
fcx-radiobutton-wrapper {
  display: flex;
  align-items: center;
  gap: var(--fcx-spacing-sm);
  position: relative;
}

fcx-radiobutton-label {
  cursor: pointer;
  user-select: none;
  font-size: var(--fcx-font-size-base);
  color: var(--fcx-text-primary);
  transition: color var(--fcx-transition-duration) var(--fcx-transition-timing);
}

fcx-radiobutton-label.required::after {
  content: ' *';
  color: var(--fcx-error-500);
}

fcx-radiobutton-label.disabled {
  cursor: not-allowed;
  opacity: 0.6;
  color: var(--fcx-text-disabled);
}

fcx-radiobutton-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--fcx-spacing-sm);
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
fcx-radiobutton--sm {
  transform: scale(0.875);
}

fcx-radiobutton--sm + fcx-radiobutton-label {
  font-size: var(--fcx-font-size-sm);
}

fcx-radiobutton--lg {
  transform: scale(1.125);
}

fcx-radiobutton--lg + fcx-radiobutton-label {
  font-size: var(--fcx-font-size-lg);
}

/* State variants */
fcx-radiobutton--error {
  border-color: var(--fcx-error-500);
}

fcx-radiobutton--success {
  border-color: var(--fcx-success-500);
}

fcx-radiobutton--loading {
  opacity: 0.7;
}

fcx-radiobutton--checked {
  background: var(--fcx-primary-500);
  border-color: var(--fcx-primary-500);
}

/* Custom radio button styling */
fcx-radiobutton :deep(.p-radiobutton-box) {
  transition: all var(--fcx-transition-duration) var(--fcx-transition-timing);
}

fcx-radiobutton :deep(.p-radiobutton-box:hover) {
  border-color: var(--fcx-primary-400);
}

fcx-radiobutton :deep(.p-radiobutton-box.p-highlight) {
  background: var(--fcx-primary-500);
  border-color: var(--fcx-primary-500);
}

fcx-radiobutton :deep(.p-radiobutton-box.p-highlight:hover) {
  background: var(--fcx-primary-600);
  border-color: var(--fcx-primary-600);
}

fcx-radiobutton :deep(.p-radiobutton-icon) {
  background: var(--fcx-text-inverse);
}

fcx-radiobutton--error :deep(.p-radiobutton-box) {
  border-color: var(--fcx-error-500);
}

fcx-radiobutton--success :deep(.p-radiobutton-box) {
  border-color: var(--fcx-success-500);
}

/* Focus styles */
fcx-radiobutton :deep(.p-radiobutton-box:focus) {
  outline: 2px solid var(--fcx-primary-200);
  outline-offset: 2px;
}
</style>
