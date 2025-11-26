<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="fcx-field-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <!-- Input wrapper -->
    <div class="fcx-inputnumber-wrapper">
      <!-- Prefix -->
      <div v-if="prefix" class="fcx-inputnumber-prefix">
        {{ prefix }}
      </div>

      <!-- InputNumber element -->
      <InputNumber
        :id="inputId"
        ref="inputRef"
        :model-value="value"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        :min="min"
        :max="max"
        :step="step"
        :min-fraction-digits="fractionDigits"
        :max-fraction-digits="fractionDigits"
        :allow-empty="!required"
        :show-buttons="showButtons"
        :button-layout="buttonLayout"
        :prefix="prefix"
        :suffix="suffix"
        :currency="currency"
        :locale="locale"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Suffix -->
      <div v-if="suffix" class="fcx-inputnumber-suffix">
        {{ suffix }}
      </div>

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-inputnumber-loading">
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
import InputNumber from 'primevue/inputnumber'
import type { InputNumberProps } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<InputNumberProps>(), {
  size: 'md',
  step: 1,
  fractionDigits: 0,
  allowDecimal: true,
  allowNegative: true,
  showButtons: false,
  buttonLayout: 'stacked',
  locale: 'en-US'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'blur': [event: Event]
  'focus': [event: Event]
  'input': [event: any]
}>()

// Template refs
const inputRef = ref<any>()

// Generate unique ID for the input
const inputId = computed(() => `fcx-inputnumber-${props.name}`)

// Build validation rules from props
const validationRules = computed(() => {
  // If legacy rules prop is provided, use it
  if (props.rules) {
    return props.rules
  }
  
  // Otherwise build from props
  return buildValidationString({
    required: props.required,
    validationType: props.validationType,
    min: props.min,
    max: props.max
  })
})

// VeeValidate integration
const {
  value,
  errorMessage,
  handleBlur: veeHandleBlur,
  handleChange,
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

const inputClasses = computed(() => [
  'fcx-inputnumber',
  `fcx-inputnumber--${props.size}`,
  {
    'fcx-inputnumber--error': !!errorMessage.value,
    'fcx-inputnumber--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-inputnumber--loading': props.loading,
    'fcx-inputnumber--with-buttons': props.showButtons,
    'fcx-inputnumber--with-prefix': !!props.prefix,
    'fcx-inputnumber--with-suffix': !!props.suffix
  }
])

// Event handlers
const handleInput = (event: any) => {
  const newValue = event.value
  value.value = newValue
  emit('update:modelValue', newValue)
  emit('input', event)
  handleChange(event.originalEvent || event)
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
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const blur = () => {
  if (inputRef.value) {
    inputRef.value.blur()
  }
}

// Expose methods to parent component
defineExpose({
  focus,
  blur,
  inputRef
})
</script>

<style scoped>
fcx-inputnumber-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

fcx-inputnumber-prefix,
fcx-inputnumber-suffix {
  padding: 0 var(--fcx-spacing-sm);
  color: var(--fcx-text-secondary);
  font-size: var(--fcx-font-size-sm);
  white-space: nowrap;
}

fcx-inputnumber-loading {
  position: absolute;
  right: var(--fcx-spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

fcx-spinner {
  width: 16px;
  height: 16px;
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
fcx-inputnumber--sm {
  font-size: var(--fcx-font-size-sm);
}

fcx-inputnumber--lg {
  font-size: var(--fcx-font-size-lg);
}

/* State variants */
fcx-inputnumber--error {
  border-color: var(--fcx-error-500);
}

fcx-inputnumber--success {
  border-color: var(--fcx-success-500);
}

fcx-inputnumber--loading {
  opacity: 0.7;
}
</style>
