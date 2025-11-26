<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Label -->
    <label
      v-if="label"
      :for="dropdownId"
      class="fcx-field-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <!-- Dropdown wrapper -->
    <div class="fcx-dropdown-wrapper">
      <!-- Dropdown element -->
      <Select
        :id="dropdownId"
        ref="dropdownRef"
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
        :editable="editable"
        :empty-message="emptyMessage"
        :empty-filter-message="emptyFilterMessage"
        :multiple="multiple"
        :max-selected-labels="maxSelectedLabels"
        :selected-items-label="selectedItemsLabel"
        :class="dropdownClasses"
        :panel-class="panelClasses"
        @change="handleChange"
        @show="handleShow"
        @hide="handleHide"
        @filter="handleFilter"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <!-- Custom option template -->
        <template v-if="optionTemplate" #option="slotProps">
          <component :is="optionTemplate" v-bind="slotProps" />
        </template>

        <!-- Custom value template -->
        <template v-if="valueTemplate" #value="slotProps">
          <component :is="valueTemplate" v-bind="slotProps" />
        </template>

        <!-- Custom empty template -->
        <template v-if="emptyTemplate" #empty>
          <component :is="emptyTemplate" />
        </template>
      </Select>

      <!-- Clear button (custom implementation if needed) -->
      <button
        v-if="showClear && value && !disabled && !loading && !multiple"
        type="button"
        class="fcx-dropdown-clear"
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
      <div v-if="loading" class="fcx-dropdown-loading">
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
import Select from 'primevue/select'
import type { DropdownProps } from './types/form-types'

// Props
const props = withDefaults(defineProps<DropdownProps>(), {
  size: 'md',
  optionLabel: 'label',
  optionValue: 'value',
  emptyMessage: 'No results found',
  emptyFilterMessage: 'No results found',
  filterPlaceholder: 'Search...',
  maxSelectedLabels: 3,
  selectedItemsLabel: '{0} items selected'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [event: { originalEvent: Event; value: any }]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
  'show': []
  'hide': []
  'filter': [event: { originalEvent: Event; value: string }]
}>()

// Template refs
const dropdownRef = ref<any>()

// Generate unique ID for the dropdown
const dropdownId = computed(() => `fcx-dropdown-${props.name}`)

// VeeValidate integration
const {
  value,
  errorMessage,
  handleBlur: veeHandleBlur,
  handleChange: veeHandleChange,
  meta
} = useField(() => props.name, props.rules, {
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

const dropdownClasses = computed(() => [
  'fcx-dropdown',
  `fcx-dropdown--${props.size}`,
  {
    'fcx-dropdown--error': !!errorMessage.value,
    'fcx-dropdown--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-dropdown--loading': props.loading
  }
])

const panelClasses = computed(() => [
  'fcx-dropdown-panel'
])

// Event handlers
const handleChange = (event: { originalEvent: Event; value: any }) => {
  value.value = event.value
  emit('update:modelValue', event.value)
  emit('change', event)
  veeHandleChange(event.originalEvent)
}

const handleBlur = (event: Event) => {
  veeHandleBlur(event)
  emit('blur', event as FocusEvent)
}

const handleFocus = (event: Event) => {
  emit('focus', event as FocusEvent)
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

const handleClear = () => {
  value.value = props.multiple ? [] : null
  emit('update:modelValue', value.value)
  emit('change', { 
    originalEvent: new Event('change'), 
    value: value.value 
  })
  
  // Focus the dropdown after clearing
  if (dropdownRef.value) {
    dropdownRef.value.focus()
  }
}

// Public methods (exposed to parent)
const focus = () => {
  if (dropdownRef.value) {
    dropdownRef.value.focus()
  }
}

const blur = () => {
  if (dropdownRef.value) {
    dropdownRef.value.blur()
  }
}

const show = () => {
  if (dropdownRef.value) {
    dropdownRef.value.show()
  }
}

const hide = () => {
  if (dropdownRef.value) {
    dropdownRef.value.hide()
  }
}

// Expose methods to parent component
defineExpose({
  focus,
  blur,
  show,
  hide,
  dropdownRef
})
</script>
