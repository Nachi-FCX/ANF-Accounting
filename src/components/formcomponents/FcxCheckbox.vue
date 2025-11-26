<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Checkbox wrapper -->
    <div class="fcx-checkbox-wrapper">
      <!-- Checkbox element -->
      <Checkbox
        :id="checkboxId"
        ref="checkboxRef"
        :model-value="value"
        :value="checkboxValue"
        :binary="binary"
        :indeterminate="indeterminate"
        :disabled="disabled || loading"
        :class="checkboxClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Label -->
      <label
        v-if="label"
        :for="checkboxId"
        class="fcx-checkbox-label"
        :class="{ required, disabled: disabled || loading }"
        style="font-size: 0.75rem; font-weight: 400; line-height: 1.4;"
      >
        {{ label }}
      </label>

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-checkbox-loading">
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
import Checkbox from 'primevue/checkbox'
import type { CheckboxProps } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<CheckboxProps>(), {
  size: 'md',
  binary: true,
  indeterminate: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean | any[]]
  'change': [event: { originalEvent: Event; checked: boolean; value: any }]
  'blur': [event: Event]
  'focus': [event: Event]
}>()

// Template refs
const checkboxRef = ref<any>()

// Generate unique ID for the checkbox
const checkboxId = computed(() => `fcx-checkbox-${props.name}`)

// Determine checkbox value for array binding
const checkboxValue = computed(() => {
  return props.binary ? undefined : props.value
})

// Build validation rules from props
const validationRules = computed(() => {
  // If legacy rules prop is provided, use it
  if (props.rules) {
    return props.rules
  }
  
  // For binary checkboxes, required means must be true
  if (props.binary && props.required) {
    return 'required'
  }
  
  // For array checkboxes, use standard validation
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
  initialValue: props.binary ? (props.modelValue || false) : (props.modelValue || []),
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

const checkboxClasses = computed(() => [
  'fcx-checkbox',
  `fcx-checkbox--${props.size}`,
  {
    'fcx-checkbox--error': !!errorMessage.value,
    'fcx-checkbox--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-checkbox--loading': props.loading,
    'fcx-checkbox--indeterminate': props.indeterminate
  }
])

// Event handlers
const handleChange = (event: any) => {
  if (props.binary) {
    value.value = event.checked
    emit('update:modelValue', event.checked)
  } else {
    // Handle array binding
    const currentValue = Array.isArray(value.value) ? [...value.value] : []
    if (event.checked) {
      if (!currentValue.includes(props.value)) {
        currentValue.push(props.value)
      }
    } else {
      const index = currentValue.indexOf(props.value)
      if (index > -1) {
        currentValue.splice(index, 1)
      }
    }
    value.value = currentValue
    emit('update:modelValue', currentValue)
  }
  
  emit('change', event)
  veeHandleChange(event.originalEvent)
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
  if (checkboxRef.value) {
    checkboxRef.value.focus()
  }
}

const blur = () => {
  if (checkboxRef.value) {
    checkboxRef.value.blur()
  }
}

// Expose methods to parent component
defineExpose({
  focus,
  blur,
  checkboxRef
})
</script>

<style scoped>
fcx-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--fcx-spacing-sm);
  position: relative;
}

fcx-checkbox-label {
  user-select: none;
  font-size: var(--fcx-font-size-base);
  color: var(--fcx-text-primary);
  transition: color var(--fcx-transition-duration) var(--fcx-transition-timing);
}

fcx-checkbox-label.required::after {
  content: ' *';
  color: var(--fcx-error-500);
}

fcx-checkbox-label.disabled {
  cursor: not-allowed;
  opacity: 0.6;
  color: var(--fcx-text-disabled);
}

fcx-checkbox-loading {
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
fcx-checkbox--sm {
  transform: scale(0.875);
}

fcx-checkbox--sm + fcx-checkbox-label {
  font-size: var(--fcx-font-size-sm);
}

fcx-checkbox--lg {
  transform: scale(1.125);
}

fcx-checkbox--lg + fcx-checkbox-label {
  font-size: var(--fcx-font-size-lg);
}

/* State variants */
fcx-checkbox--error {
  border-color: var(--fcx-error-500);
}

fcx-checkbox--success {
  border-color: var(--fcx-success-500);
}

fcx-checkbox--loading {
  opacity: 0.7;
}

fcx-checkbox--indeterminate {
  background: var(--fcx-primary-500);
  border-color: var(--fcx-primary-500);
}

/* Custom checkbox styling */
fcx-checkbox :deep(.p-checkbox-box) {
  border-radius: var(--fcx-border-radius-sm);
  transition: all var(--fcx-transition-duration) var(--fcx-transition-timing);
}

fcx-checkbox :deep(.p-checkbox-box:hover) {
  border-color: var(--fcx-primary-400);
}

fcx-checkbox :deep(.p-checkbox-box.p-highlight) {
  background: var(--fcx-primary-500);
  border-color: var(--fcx-primary-500);
}

fcx-checkbox :deep(.p-checkbox-box.p-highlight:hover) {
  background: var(--fcx-primary-600);
  border-color: var(--fcx-primary-600);
}

fcx-checkbox--error :deep(.p-checkbox-box) {
  border-color: var(--fcx-error-500);
}

fcx-checkbox--success :deep(.p-checkbox-box) {
  border-color: var(--fcx-success-500);
}
</style>
