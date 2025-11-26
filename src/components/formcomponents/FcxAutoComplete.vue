<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Label -->
    <label
      v-if="label"
      :for="autocompleteId"
      class="fcx-field-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <!-- AutoComplete wrapper -->
    <div class="fcx-autocomplete-wrapper">
      <!-- AutoComplete element -->
      <AutoComplete
        :id="autocompleteId"
        ref="autocompleteRef"
        :model-value="value"
        :suggestions="suggestions"
        :option-label="optionLabel"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        :multiple="multiple"
        :min-length="minLength"
        :delay="delay"
        :dropdown="dropdown"
        :force-selection="forceSelection"
        :empty-message="emptyMessage"
        :class="autocompleteClasses"
        @complete="handleComplete"
        @item-select="handleItemSelect"
        @item-unselect="handleItemUnselect"
        @dropdown-click="handleDropdownClick"
        @clear="handleClear"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-autocomplete-loading">
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
import AutoComplete from 'primevue/autocomplete'
import type { AutoCompleteProps } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<AutoCompleteProps>(), {
  size: 'md',
  optionLabel: 'label',
  multiple: false,
  minLength: 1,
  delay: 300,
  dropdown: false,
  forceSelection: false,
  emptyMessage: 'No results found'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'complete': [event: { originalEvent: Event; query: string }]
  'item-select': [event: { originalEvent: Event; value: any }]
  'item-unselect': [event: { originalEvent: Event; value: any }]
  'dropdown-click': [event: { originalEvent: Event; query: string }]
  'clear': []
  'blur': [event: Event]
  'focus': [event: Event]
}>()

// Template refs
const autocompleteRef = ref<any>()

// Generate unique ID for the autocomplete
const autocompleteId = computed(() => `fcx-autocomplete-${props.name}`)

// Build validation rules from props
const validationRules = computed(() => {
  // If legacy rules prop is provided, use it
  if (props.rules) {
    return props.rules
  }
  
  // Build from props
  return buildValidationString({
    required: props.required,
    validationType: props.validationType,
    minLength: props.minLength
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

const autocompleteClasses = computed(() => [
  'fcx-autocomplete',
  `fcx-autocomplete--${props.size}`,
  {
    'fcx-autocomplete--error': !!errorMessage.value,
    'fcx-autocomplete--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-autocomplete--loading': props.loading,
    'fcx-autocomplete--multiple': props.multiple,
    'fcx-autocomplete--dropdown': props.dropdown
  }
])

// Event handlers
const handleComplete = (event: any) => {
  emit('complete', event)
}

const handleItemSelect = (event: any) => {
  value.value = event.value
  emit('update:modelValue', event.value)
  emit('item-select', event)
  veeHandleChange(event.originalEvent || event)
}

const handleItemUnselect = (event: any) => {
  if (props.multiple && Array.isArray(value.value)) {
    const newValue = value.value.filter(item => item !== event.value)
    value.value = newValue
    emit('update:modelValue', newValue)
  } else {
    value.value = null
    emit('update:modelValue', null)
  }
  emit('item-unselect', event)
  veeHandleChange(event.originalEvent || event)
}

const handleDropdownClick = (event: any) => {
  emit('dropdown-click', event)
}

const handleClear = () => {
  value.value = props.multiple ? [] : null
  emit('update:modelValue', value.value)
  emit('clear')
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
  if (autocompleteRef.value) {
    autocompleteRef.value.focus()
  }
}

const blur = () => {
  if (autocompleteRef.value) {
    autocompleteRef.value.blur()
  }
}

const show = () => {
  if (autocompleteRef.value) {
    autocompleteRef.value.show()
  }
}

const hide = () => {
  if (autocompleteRef.value) {
    autocompleteRef.value.hide()
  }
}

// Expose methods to parent component
defineExpose({
  focus,
  blur,
  show,
  hide,
  autocompleteRef
})
</script>

<style scoped>
fcx-autocomplete-wrapper {
  position: relative;
}

fcx-autocomplete-loading {
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
fcx-autocomplete--sm {
  font-size: var(--fcx-font-size-sm);
}

fcx-autocomplete--lg {
  font-size: var(--fcx-font-size-lg);
}

/* State variants */
fcx-autocomplete--error {
  border-color: var(--fcx-error-500);
}

fcx-autocomplete--success {
  border-color: var(--fcx-success-500);
}

fcx-autocomplete--loading {
  opacity: 0.7;
}

/* Multiple selection styling */
fcx-autocomplete--multiple :deep(.p-autocomplete-multiple-container) {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fcx-spacing-xs);
  padding: var(--fcx-spacing-xs);
}

fcx-autocomplete--multiple :deep(.p-autocomplete-token) {
  background: var(--fcx-primary-100);
  color: var(--fcx-primary-700);
  border-radius: var(--fcx-border-radius-sm);
  padding: var(--fcx-spacing-xs) var(--fcx-spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--fcx-spacing-xs);
}

fcx-autocomplete--multiple :deep(.p-autocomplete-token-icon) {
  color: var(--fcx-primary-600);
  cursor: pointer;
  transition: color var(--fcx-transition-duration) var(--fcx-transition-timing);
}

fcx-autocomplete--multiple :deep(.p-autocomplete-token-icon:hover) {
  color: var(--fcx-primary-800);
}

/* Dropdown styling */
fcx-autocomplete--dropdown :deep(.p-autocomplete-dropdown) {
  background: var(--fcx-surface);
  border: 1px solid var(--fcx-border-normal);
  border-left: none;
  color: var(--fcx-text-secondary);
  transition: all var(--fcx-transition-duration) var(--fcx-transition-timing);
}

fcx-autocomplete--dropdown :deep(.p-autocomplete-dropdown:hover) {
  background: var(--fcx-surface-hover);
  color: var(--fcx-primary-500);
}

/* Custom autocomplete styling */
fcx-autocomplete :deep(.p-inputtext) {
  border-radius: var(--fcx-border-radius-md);
  transition: all var(--fcx-transition-duration) var(--fcx-transition-timing);
}

fcx-autocomplete :deep(.p-inputtext:hover) {
  border-color: var(--fcx-primary-400);
}

fcx-autocomplete :deep(.p-inputtext:focus) {
  outline: 2px solid var(--fcx-primary-200);
  outline-offset: 2px;
  border-color: var(--fcx-primary-500);
}

fcx-autocomplete--error :deep(.p-inputtext) {
  border-color: var(--fcx-error-500);
}

fcx-autocomplete--success :deep(.p-inputtext) {
  border-color: var(--fcx-success-500);
}

/* Suggestions panel styling */
fcx-autocomplete :deep(.p-autocomplete-panel) {
  border-radius: var(--fcx-border-radius-lg);
  box-shadow: var(--fcx-shadow-lg);
  border: 1px solid var(--fcx-border-normal);
  background: var(--fcx-surface);
}

fcx-autocomplete :deep(.p-autocomplete-items) {
  padding: var(--fcx-spacing-xs);
}

fcx-autocomplete :deep(.p-autocomplete-item) {
  padding: var(--fcx-spacing-sm) var(--fcx-spacing-md);
  border-radius: var(--fcx-border-radius-sm);
  transition: all var(--fcx-transition-duration) var(--fcx-transition-timing);
  cursor: pointer;
}

fcx-autocomplete :deep(.p-autocomplete-item:hover) {
  background: var(--fcx-primary-100);
  color: var(--fcx-primary-700);
}

fcx-autocomplete :deep(.p-autocomplete-item.p-highlight) {
  background: var(--fcx-primary-500);
  color: var(--fcx-text-inverse);
}

fcx-autocomplete :deep(.p-autocomplete-empty-message) {
  padding: var(--fcx-spacing-md);
  color: var(--fcx-text-secondary);
  text-align: center;
  font-style: italic;
}
</style>
