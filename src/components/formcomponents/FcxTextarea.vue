<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Label -->
    <label
      v-if="label"
      :for="textareaId"
      class="fcx-field-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <!-- Textarea wrapper -->
    <div class="fcx-textarea-wrapper">
      <!-- Textarea element -->
      <Textarea
        :id="textareaId"
        ref="textareaRef"
        :model-value="value"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        :rows="rows"
        :cols="cols"
        :auto-resize="autoResize"
        :class="textareaClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-textarea-loading">
        <div class="fcx-spinner" />
      </div>
    </div>

    <!-- Character counter -->
    <div
      v-if="showCounter && maxLength"
      class="fcx-textarea-counter"
      :class="{ 'fcx-textarea-counter--over-limit': isOverLimit }"
    >
      {{ characterCount }}/{{ maxLength }}
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
import Textarea from 'primevue/textarea'
import type { TextareaProps } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<TextareaProps>(), {
  size: 'md',
  rows: 3,
  autoResize: false,
  showCounter: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: Event]
  'focus': [event: Event]
  'input': [event: Event]
}>()

// Template refs
const textareaRef = ref<any>()

// Generate unique ID for the textarea
const textareaId = computed(() => `fcx-textarea-${props.name}`)

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
const characterCount = computed(() => (value.value || '').length)
const isOverLimit = computed(() => props.maxLength ? characterCount.value > props.maxLength : false)

const fieldClass = computed(() => [
  props.class,
  {
    'fcx-field--error': !!errorMessage.value,
    'fcx-field--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-field--disabled': props.disabled,
    'fcx-field--loading': props.loading
  }
])

const textareaClasses = computed(() => [
  'fcx-textarea',
  `fcx-textarea--${props.size}`,
  {
    'fcx-textarea--error': !!errorMessage.value,
    'fcx-textarea--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-textarea--loading': props.loading,
    'fcx-textarea--auto-resize': props.autoResize
  }
])

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const newValue = target.value
  
  value.value = newValue
  emit('update:modelValue', newValue)
  emit('input', event)
  handleChange(event)
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
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
}

const blur = () => {
  if (textareaRef.value) {
    textareaRef.value.blur()
  }
}

const select = () => {
  if (textareaRef.value) {
    textareaRef.value.select()
  }
}

// Expose methods to parent component
defineExpose({
  focus,
  blur,
  select,
  textareaRef
})
</script>

<style scoped>
fcx-textarea-wrapper {
  position: relative;
}

fcx-textarea-loading {
  position: absolute;
  right: var(--fcx-spacing-sm);
  top: var(--fcx-spacing-sm);
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

/* Character counter */
fcx-textarea-counter {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--fcx-spacing-xs);
  font-size: var(--fcx-font-size-xs);
  color: var(--fcx-text-secondary);
}

fcx-textarea-counter--over-limit {
  color: var(--fcx-error-500);
  font-weight: var(--fcx-font-weight-medium);
}

/* Size variants */
fcx-textarea--sm {
  font-size: var(--fcx-font-size-sm);
}

fcx-textarea--lg {
  font-size: var(--fcx-font-size-lg);
}

/* State variants */
fcx-textarea--error {
  border-color: var(--fcx-error-500);
}

fcx-textarea--success {
  border-color: var(--fcx-success-500);
}

fcx-textarea--loading {
  opacity: 0.7;
}

fcx-textarea--auto-resize {
  resize: none;
}
</style>
