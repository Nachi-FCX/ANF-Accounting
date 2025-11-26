<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Label -->
    <label
      v-if="label"
      :for="calendarId"
      class="fcx-field-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <!-- Calendar wrapper -->
    <div class="fcx-calendar-wrapper">
      <!-- Calendar element -->
      <DatePicker
        :id="calendarId"
        ref="calendarRef"
        :model-value="dateValue"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        :selection-mode="selectionMode"
        :date-format="dateFormat"
        :show-time="showTime"
        :time-only="timeOnly"
        :hour-format="hourFormat"
        :show-seconds="showSeconds"
        :show-milliseconds="showMilliseconds"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-dates="disabledDates"
        :disabled-days="disabledDays"
        :show-on-focus="showOnFocus"
        :show-week="showWeek"
        :show-other-months="showOtherMonths"
        :select-other-months="selectOtherMonths"
        :show-icon="showIcon"
        :icon="icon"
        :number-of-months="numberOfMonths"
        :view="view"
        :touch-u-i="touchUI"
        :month-navigator="monthNavigator"
        :year-navigator="yearNavigator"
        :year-range="yearRange"
        :inline="inline"
        :class="calendarClasses"
        @date-select="handleDateSelect"
        @show="handleShow"
        @hide="handleHide"
        @month-change="handleMonthChange"
        @year-change="handleYearChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-calendar-loading">
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
import DatePicker from 'primevue/datepicker'
import type { CalendarProps } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<CalendarProps>(), {
  size: 'md',
  selectionMode: 'single',
  dateFormat: 'mm/dd/yy',
  hourFormat: '24',
  showOnFocus: true,
  showOtherMonths: true,
  selectOtherMonths: false,
  showIcon: true,
  icon: 'pi pi-calendar',
  numberOfMonths: 1,
  view: 'date',
  touchUI: false,
  monthNavigator: false,
  yearNavigator: false,
  yearRange: '1900:2030',
  inline: false,
  showTime: false,
  timeOnly: false,
  showSeconds: false,
  showMilliseconds: false,
  showWeek: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Date | Date[] | null]
  'date-select': [event: { originalEvent: Event; value: Date | Date[] }]
  'show': []
  'hide': []
  'month-change': [event: { month: number; year: number }]
  'year-change': [event: { month: number; year: number }]
  'blur': [event: Event]
  'focus': [event: Event]
}>()

// Template refs
const calendarRef = ref<any>()

// Generate unique ID for the calendar
const calendarId = computed(() => `fcx-calendar-${props.name}`)

// Build validation rules from props
const validationRules = computed(() => {
  // If legacy rules prop is provided, use it
  if (props.rules) {
    return props.rules
  }
  
  // Build from props
  return buildValidationString({
    required: props.required,
    validationType: 'date',
    minDate: props.minDate,
    maxDate: props.maxDate
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

// Convert string dates to Date objects for PrimeVue DatePicker
const dateValue = computed(() => {
  if (!value.value) return null
  
  if (typeof value.value === 'string') {
    return new Date(value.value)
  }
  
  if (Array.isArray(value.value)) {
    return value.value.map(v => typeof v === 'string' ? new Date(v) : v)
  }
  
  return value.value
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

const calendarClasses = computed(() => [
  'fcx-calendar',
  `fcx-calendar--${props.size}`,
  {
    'fcx-calendar--error': !!errorMessage.value,
    'fcx-calendar--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-calendar--loading': props.loading,
    'fcx-calendar--inline': props.inline,
    'fcx-calendar--with-time': props.showTime,
    'fcx-calendar--time-only': props.timeOnly
  }
])

// Event handlers
const handleDateSelect = (event: any) => {
  value.value = event.value
  emit('update:modelValue', event.value)
  emit('date-select', event)
  veeHandleChange(event.originalEvent || event)
}

const handleShow = () => {
  emit('show')
}

const handleHide = () => {
  emit('hide')
}

const handleMonthChange = (event: any) => {
  emit('month-change', event)
}

const handleYearChange = (event: any) => {
  emit('year-change', event)
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
  if (calendarRef.value) {
    calendarRef.value.focus()
  }
}

const blur = () => {
  if (calendarRef.value) {
    calendarRef.value.blur()
  }
}

const show = () => {
  if (calendarRef.value) {
    calendarRef.value.show()
  }
}

const hide = () => {
  if (calendarRef.value) {
    calendarRef.value.hide()
  }
}

// Expose methods to parent component
defineExpose({
  focus,
  blur,
  show,
  hide,
  calendarRef
})
</script>

