<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Label -->
    <label
      v-if="label"
      :for="multiselectId"
      class="fcx-field-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <!-- MultiSelect wrapper -->
    <div class="fcx-multiselect-wrapper">
      <!-- MultiSelect element -->
      <MultiSelect
        :id="multiselectId"
        ref="multiselectRef"
        :model-value="value"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :option-disabled="optionDisabled"
        :option-group-label="optionGroupLabel"
        :option-group-children="optionGroupChildren"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        :filter="filter"
        :filter-placeholder="filterPlaceholder"
        :show-clear="showClear && !loading"
        :select-all="selectAll"
        :max-selected-labels="maxSelectedLabels"
        :selected-items-label="selectedItemsLabel"
        :empty-message="emptyMessage"
        :empty-filter-message="emptyFilterMessage"
        :display="display"
        :class="multiselectClasses"
        @change="handleChange"
        @show="handleShow"
        @hide="handleHide"
        @filter="handleFilter"
        @blur="handleBlur"
        @focus="handleFocus"
        @select-all-change="handleSelectAllChange"
      />

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-multiselect-loading">
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
import MultiSelect from 'primevue/multiselect'
import type { MultiSelectProps } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<MultiSelectProps>(), {
  size: 'md',
  optionLabel: 'label',
  optionValue: 'value',
  emptyMessage: 'No results found',
  emptyFilterMessage: 'No results found',
  filterPlaceholder: 'Search...',
  maxSelectedLabels: 3,
  selectedItemsLabel: '{0} items selected',
  display: 'comma',
  selectAll: true
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any[]]
  'change': [event: { originalEvent: Event; value: any[] }]
  'blur': [event: Event]
  'focus': [event: Event]
  'show': []
  'hide': []
  'filter': [event: { originalEvent: Event; value: string }]
  'select-all-change': [event: { originalEvent: Event; checked: boolean }]
}>()

// Template refs
const multiselectRef = ref<any>()

// Generate unique ID for the multiselect
const multiselectId = computed(() => `fcx-multiselect-${props.name}`)

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
    minFiles: props.maxSelectedLabels ? undefined : 1, // Use for min selections
    maxFiles: props.maxSelectedLabels
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
  initialValue: props.modelValue || [],
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

const multiselectClasses = computed(() => [
  'fcx-multiselect',
  `fcx-multiselect--${props.size}`,
  {
    'fcx-multiselect--error': !!errorMessage.value,
    'fcx-multiselect--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-multiselect--loading': props.loading,
    'fcx-multiselect--chip-display': props.display === 'chip'
  }
])

// Event handlers
const handleChange = (event: { originalEvent: Event; value: any[] }) => {
  value.value = event.value || []
  emit('update:modelValue', event.value || [])
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

const handleShow = () => {
  emit('show')
}

const handleHide = () => {
  emit('hide')
}

const handleFilter = (event: { originalEvent: Event; value: string }) => {
  emit('filter', event)
}

const handleSelectAllChange = (event: { originalEvent: Event; checked: boolean }) => {
  emit('select-all-change', event)
}

// Public methods (exposed to parent)
const focus = () => {
  if (multiselectRef.value) {
    multiselectRef.value.focus()
  }
}

const blur = () => {
  if (multiselectRef.value) {
    multiselectRef.value.blur()
  }
}

const show = () => {
  if (multiselectRef.value) {
    multiselectRef.value.show()
  }
}

const hide = () => {
  if (multiselectRef.value) {
    multiselectRef.value.hide()
  }
}

// Expose methods to parent component
defineExpose({
  focus,
  blur,
  show,
  hide,
  multiselectRef
})
</script>

<style scoped>
fcx-multiselect-wrapper {
  position: relative;
}

fcx-multiselect-loading {
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
fcx-multiselect--sm {
  font-size: var(--fcx-font-size-sm);
}

fcx-multiselect--lg {
  font-size: var(--fcx-font-size-lg);
}

/* State variants */
fcx-multiselect--error {
  border-color: var(--fcx-error-500);
}

fcx-multiselect--success {
  border-color: var(--fcx-success-500);
}

fcx-multiselect--loading {
  opacity: 0.7;
}

/* Chip display styling */
fcx-multiselect--chip-display :deep(.p-multiselect-token) {
  background: var(--fcx-primary-100);
  color: var(--fcx-primary-700);
  border-radius: var(--fcx-border-radius-sm);
  padding: var(--fcx-spacing-xs) var(--fcx-spacing-sm);
  margin: var(--fcx-spacing-xs);
}

fcx-multiselect--chip-display :deep(.p-multiselect-token-icon) {
  color: var(--fcx-primary-600);
  margin-left: var(--fcx-spacing-xs);
}
</style>
