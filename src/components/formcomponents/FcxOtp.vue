<template>
  <div class="fcx-field" :class="fieldClass">
    <!-- Label -->
    <label
      v-if="label"
      :for="otpId"
      class="fcx-field-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <!-- OTP wrapper -->
    <div class="fcx-otp-wrapper">
      <!-- Paste indicator -->
      <div
        v-if="showPasteIndicator"
        class="fcx-otp-paste-indicator fcx-otp-paste-indicator--visible"
      >
        Pasted!
      </div>

      <!-- Custom OTP Input -->
      <div :class="otpClasses">
        <template v-for="(digit, index) in otpDigits" :key="index">
          <input
            :ref="el => otpInputs[index] = el as HTMLInputElement"
            :class="inputClasses"
            :placeholder="getPlaceholder(index)"
            :aria-label="`Digit ${index + 1} of ${length}`"
            :data-index="index"
            :value="digit"
            :disabled="disabled || loading"
            :inputmode="inputMode"
            type="text"
            @input="(e) => handleInputChange(e, index)"
            @keydown="(e) => handleKeyDown(e, index)"
            @paste="handlePaste"
            @focus="handleFocus"
            @blur="handleBlur"
          />
          
          <!-- Separator -->
          <div
            v-if="separator && index < length - 1"
            class="fcx-otp-separator"
          >
            {{ separator }}
          </div>
        </template>
      </div>

      <!-- Clear text button on next row -->
      <div
        v-if="value && value.length > 0 && !disabled && !loading"
        class="fcx-otp-clear-row"
      >
        <button
          type="button"
          class="fcx-otp-clear-text"
          @click="handleClear"
          :aria-label="'Clear ' + (label || name)"
        >
          Clear
        </button>
      </div>

      <!-- Loading spinner -->
      <div v-if="loading" class="fcx-otp-loading">
        <div class="fcx-spinner" />
      </div>
    </div>

    <!-- Auto-submit countdown -->
    <div
      v-if="autoSubmit && isComplete && autoSubmitCountdown > 0"
      class="fcx-otp-auto-submit"
    >
      Auto-submitting in
      <span class="fcx-otp-countdown">{{ autoSubmitCountdown }}s</span>
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
import { computed, ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useField } from 'vee-validate'
import InputOtp from 'primevue/inputotp'
import type { OtpProps, OtpEvents } from './types/form-types'
import { buildValidationString } from './utils/validation-rules'

// Props
const props = withDefaults(defineProps<OtpProps>(), {
  size: 'md',
  length: 6,
  mask: false,
  integerOnly: true,
  inputMode: 'numeric',
  autoFocus: false,
  autoAdvance: true,
  allowPaste: true,
  variant: 'default',
  autoSubmit: false,
  autoSubmitTimeout: 3000,
  modelValue: ''
})

// Emits
const emit = defineEmits<OtpEvents>()

// Template refs
const otpRef = ref<any>()
const otpInputs = ref<HTMLInputElement[]>([])

// State
const showPasteIndicator = ref(false)
const isComplete = ref(false)
const autoSubmitCountdown = ref(0)
const autoSubmitTimer = ref<number>()
const countdownTimer = ref<number>()

// OTP digits array
const otpDigits = computed(() => {
  const digits = (value.value || '').split('')
  while (digits.length < props.length) {
    digits.push('')
  }
  return digits.slice(0, props.length)
})

// Generate unique ID for the OTP
const otpId = computed(() => `fcx-otp-${props.name}`)

// Build validation rules from props
const validationRules = computed(() => {
  // If legacy rules prop is provided, use it
  if (props.rules) {
    return props.rules
  }
  
  // For OTP, we'll be less aggressive with validation
  // Only validate if explicitly required and not during typing
  const rules: string[] = []
  
  // Don't add automatic validation rules for OTP
  // Let the parent component handle validation logic
  
  return rules.join('|') || undefined
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

const otpClasses = computed(() => [
  'fcx-otp',
  `fcx-otp--${props.size}`,
  {
    'fcx-otp--error': !!errorMessage.value,
    'fcx-otp--success': meta.valid && meta.touched && !errorMessage.value,
    'fcx-otp--disabled': props.disabled,
    'fcx-otp--loading': props.loading
  }
])

const inputClasses = computed(() => [
  'fcx-otp-input',
  `fcx-otp-input--${props.size}`,
  `fcx-otp-input--${props.variant}`,
  {
    'fcx-otp-input--masked': props.mask,
    'fcx-otp-input--has-value': value.value && value.value.length > 0
  }
])

// Methods
const getPlaceholder = (index: number): string => {
  if (props.mask) {
    return '●'
  }
  return props.placeholder || '0'
}

const handleInput = (newValue: string) => {
  value.value = newValue
  emit('update:modelValue', newValue)
  emit('input', new Event('input'))
  handleChange(new Event('change'))
  
  // Check if OTP is complete
  const complete = newValue && newValue.length === props.length
  isComplete.value = Boolean(complete)
  
  if (complete) {
    handleComplete(newValue)
  }
}

const handleBlur = (event: FocusEvent) => {
  veeHandleBlur(event)
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleComplete = (completedValue: string | boolean) => {
  // Ensure we have the actual completed value as string
  const actualValue = typeof completedValue === 'string' ? completedValue : value.value
  
  emit('complete', actualValue)
  
  // Auto-submit functionality
  if (props.autoSubmit && props.autoSubmitTimeout > 0) {
    startAutoSubmitCountdown()
  }
}

const handleInputChange = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  let inputValue = target.value
  
  // Handle multiple characters (like when typing fast or pasting)
  if (inputValue.length > 1) {
    // If multiple characters, distribute them across fields
    const chars = inputValue.split('')
    const currentDigits = otpDigits.value.slice()
    
    for (let i = 0; i < chars.length && (index + i) < props.length; i++) {
      let char = chars[i]
      if (props.integerOnly && !/^\d$/.test(char)) {
        continue // Skip non-numeric characters
      }
      currentDigits[index + i] = char
    }
    
    const newValue = currentDigits.join('')
    value.value = newValue
    emit('update:modelValue', newValue)
    
    // Focus the appropriate next field
    const nextIndex = Math.min(index + inputValue.length, props.length - 1)
    setTimeout(() => {
      const nextInput = document.querySelector(`[data-index="${nextIndex}"]`) as HTMLInputElement
      if (nextInput) {
        nextInput.focus()
      }
    }, 0)
    
    return
  }
  
  // Single character input
  if (props.integerOnly && inputValue && !/^\d$/.test(inputValue)) {
    target.value = otpDigits.value[index] || '' // Restore previous value
    return
  }
  
  // Update the overall OTP value
  const currentDigits = otpDigits.value.slice()
  currentDigits[index] = inputValue
  
  const newValue = currentDigits.join('')
  value.value = newValue
  emit('update:modelValue', newValue)
  
  // Auto-advance to next input if current input has value and we're not at the last input
  if (inputValue && index < props.length - 1) {
    setTimeout(() => {
      const nextInput = document.querySelector(`[data-index="${index + 1}"]`) as HTMLInputElement
      if (nextInput) {
        nextInput.focus()
      }
    }, 0)
  }
  
  // Check if OTP is complete
  const complete = newValue && newValue.length === props.length
  isComplete.value = Boolean(complete)
  
  if (complete) {
    emit('complete', newValue)
  }
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  const target = event.target as HTMLInputElement
  
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!target.value && index > 0) {
      // Move to previous input if current is empty
      event.preventDefault()
      const prevInput = otpInputs.value[index - 1]
      if (prevInput) {
        prevInput.focus()
        // Clear the previous input
        const currentDigits = otpDigits.value.slice()
        currentDigits[index - 1] = ''
        const newValue = currentDigits.join('')
        handleInput(newValue)
      }
    }
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    const direction = event.key === 'ArrowLeft' ? -1 : 1
    const newIndex = index + direction
    
    if (newIndex >= 0 && newIndex < props.length) {
      const nextInput = otpInputs.value[newIndex]
      if (nextInput) {
        nextInput.focus()
      }
    }
  }
  
  // Clear on Escape
  if (event.key === 'Escape' && value.value) {
    handleClear()
  }
  
  // Prevent non-numeric input if integerOnly is true
  if (props.integerOnly && event.key.length === 1 && !/\d/.test(event.key)) {
    event.preventDefault()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Handle keyboard events for the entire OTP component
  if (event.key === 'Escape' && value.value) {
    handleClear()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  if (!props.allowPaste) {
    event.preventDefault()
    return
  }
  
  const pastedData = event.clipboardData?.getData('text') || ''
  const cleanedData = props.integerOnly 
    ? pastedData.replace(/\D/g, '') 
    : pastedData.replace(/\s/g, '')
  
  if (cleanedData.length >= props.length) {
    const otpValue = cleanedData.substring(0, props.length)
    handleInput(otpValue)
    
    // Show paste indicator
    showPasteIndicator.value = true
    setTimeout(() => {
      showPasteIndicator.value = false
    }, 2000)
  }
}

const handleClear = () => {
  value.value = ''
  isComplete.value = false
  emit('update:modelValue', '')
  emit('clear')
  
  // Clear auto-submit timers
  clearAutoSubmitTimers()
  
  // Focus first input
  nextTick(() => {
    focus()
  })
}

const startAutoSubmitCountdown = () => {
  if (!props.autoSubmitTimeout) return
  
  autoSubmitCountdown.value = Math.ceil(props.autoSubmitTimeout / 1000)
  
  // Start countdown
  countdownTimer.value = setInterval(() => {
    autoSubmitCountdown.value--
    if (autoSubmitCountdown.value <= 0) {
      clearInterval(countdownTimer.value)
    }
  }, 1000)
  
  // Set auto-submit timer
  autoSubmitTimer.value = setTimeout(() => {
    if (isComplete.value && value.value) {
      emit('auto-submit', value.value)
    }
  }, props.autoSubmitTimeout)
}

const clearAutoSubmitTimers = () => {
  if (autoSubmitTimer.value) {
    clearTimeout(autoSubmitTimer.value)
    autoSubmitTimer.value = undefined
  }
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = undefined
  }
  autoSubmitCountdown.value = 0
}

// Public methods (exposed to parent)
const focus = () => {
  const firstInput = otpInputs.value[0]
  if (firstInput && typeof firstInput.focus === 'function') {
    firstInput.focus()
  }
}

const clear = () => {
  handleClear()
}

const selectAll = () => {
  const inputs = otpRef.value?.$el?.querySelectorAll('input')
  if (inputs) {
    inputs.forEach((input: HTMLInputElement) => {
      input.select()
    })
  }
}

const getElement = () => {
  return otpRef.value?.$el || null
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== value.value) {
    value.value = newValue || ''
    const targetLength = typeof props.length === 'number' ? props.length : 6
    isComplete.value = newValue ? newValue.length === targetLength : false
  }
})

// Lifecycle
onMounted(() => {
  if (props.autoFocus) {
    nextTick(() => {
      focus()
    })
  }
})

onUnmounted(() => {
  clearAutoSubmitTimers()
})

// Expose methods to parent component
defineExpose({
  focus,
  clear,
  selectAll,
  getElement,
  otpRef
})
</script>

<style lang="scss" scoped>
@use './styles/fcx-otp.scss';
</style>
