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
    <div class="fcx-inputmask-wrapper">
      <!-- Input element -->
      <InputMask
        :id="inputId"
        ref="inputRef"
        :model-value="value"
        :mask="mask"
        :auto-clear="autoClear"
        :unmask="unmask"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        :readonly="readonly"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @complete="handleComplete"
      />

      <!-- Clear button -->
      <button
        v-if="showClear && value && !disabled && !loading"
        type="button"
        class="fcx-inputmask-clear"
        @click="handleClear"
        :aria-label="'Clear ' + (label || name)"
      >
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-inputmask-loading">
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
import { computed, ref, nextTick } from 'vue'
import { useField } from 'vee-validate'
import InputMask from 'primevue/inputmask'
import type { InputMaskProps } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<InputMaskProps>(), {
  size: 'md',
  modelValue: '',
  mask: '',
  slotChar: '_',
  autoClear: true,
  unmask: false,
  showClear: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
  'input': [event: Event]
  'complete': [event: Event]
  'clear': []
}>()

// Template refs
const inputRef = ref<any>()

// Generate unique ID for the input
const inputId = computed(() => `fcx-inputmask-${props.name}`)

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
    minLength: props.minLength,
    maxLength: props.maxLength
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
  'fcx-inputmask',
  `fcx-inputmask--${props.size}`,
  {
    'fcx-inputmask--error': !!errorMessage.value,
    'fcx-inputmask--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-inputmask--loading': props.loading,
    'fcx-inputmask--with-clear': props.showClear && value.value
  }
])

// Event handlers
const handleInput = (event: any) => {
  const newValue = event.value || ''
  
  value.value = newValue
  emit('update:modelValue', newValue)
  emit('input', event.originalEvent || event)
  handleChange(event.originalEvent || event)
}

const handleBlur = (event: Event) => {
  veeHandleBlur(event)
  emit('blur', event as FocusEvent)
}

const handleFocus = (event: Event) => {
  emit('focus', event as FocusEvent)
}

const handleComplete = (event: Event) => {
  emit('complete', event)
}

const handleClear = () => {
  value.value = ''
  emit('update:modelValue', '')
  emit('clear')
  
  // Focus the input after clearing
  nextTick(() => {
    const element = inputRef.value?.$el || inputRef.value
    if (element && typeof element.focus === 'function') {
      element.focus()
    }
  })
}

// Public methods (exposed to parent)
const focus = () => {
  const element = inputRef.value?.$el || inputRef.value
  if (element && typeof element.focus === 'function') {
    element.focus()
  }
}

const blur = () => {
  const element = inputRef.value?.$el || inputRef.value
  if (element && typeof element.blur === 'function') {
    element.blur()
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
fcx-inputmask-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

fcx-inputmask-clear {
  position: absolute;
  right: var(--fcx-spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--fcx-spacing-xs);
  color: var(--fcx-text-secondary);
  transition: color var(--fcx-transition-duration) var(--fcx-transition-timing);
  z-index: 10;
}

fcx-inputmask-clear:hover {
  color: var(--fcx-text-primary);
}

fcx-inputmask-clear svg {
  width: 16px;
  height: 16px;
}

fcx-inputmask-loading {
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
fcx-inputmask--sm {
  font-size: var(--fcx-font-size-sm);
}

fcx-inputmask--lg {
  font-size: var(--fcx-font-size-lg);
}

/* State variants */
fcx-inputmask--error {
  border-color: var(--fcx-error-500);
}

fcx-inputmask--success {
  border-color: var(--fcx-success-500);
}

fcx-inputmask--loading {
  opacity: 0.7;
}

fcx-inputmask--with-clear {
  padding-right: calc(var(--fcx-spacing-xl) + var(--fcx-spacing-sm));
}
</style>
