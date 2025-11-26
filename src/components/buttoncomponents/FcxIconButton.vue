<template>
  <button
    ref="buttonRef"
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel || tooltip || 'Icon button'"
    :tabindex="tabindex"
    :class="buttonClasses"
    :style="style"
    :title="tooltip"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <!-- Loading spinner (shown when loading) -->
    <div
      v-if="loading"
      class="fcx-icon-button-loading-spinner"
      :aria-hidden="true"
    />
    
    <!-- Icon content (hidden when loading) -->
    <div v-if="!loading" class="fcx-icon-button-content">
      <div class="fcx-icon-button-icon" :aria-hidden="true">
        <component :is="icon" v-if="typeof icon !== 'string'" />
        <i v-else :class="icon" />
      </div>
    </div>
    
    <!-- Tooltip (if provided and not using native title) -->
    <div
      v-if="tooltip && showCustomTooltip"
      class="fcx-icon-button-tooltip"
      :class="`fcx-icon-button-tooltip--${tooltipPosition}`"
    >
      {{ tooltip }}
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import type { IconButtonProps, ButtonEvents, ButtonExpose } from './types/button-types'

// Props with defaults
const props = withDefaults(defineProps<IconButtonProps>(), {
  type: 'button',
  severity: 'secondary',
  variant: 'ghost',
  size: 'medium',
  disabled: false,
  loading: false,
  rounded: true,
  tooltipPosition: 'top',
  tabindex: 0
})

// Emits
const emit = defineEmits<ButtonEvents>()

// Template refs
const buttonRef = ref<HTMLButtonElement>()

// State
const showCustomTooltip = ref(false) // For future custom tooltip implementation

// Computed properties
const buttonClasses = computed(() => [
  'fcx-icon-button',
  `fcx-icon-button--${props.size}`,
  `fcx-icon-button--${props.severity}`,
  `fcx-icon-button--${props.variant}`,
  {
    'fcx-icon-button--rounded': props.rounded,
    'fcx-icon-button--square': !props.rounded,
    'fcx-icon-button--loading': props.loading,
    'fcx-icon-button--disabled': props.disabled
  },
  props.class
])

// Event handlers
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  // Handle Enter and Space key activation
  if (event.key === 'Enter' || event.key === ' ') {
    if (!props.disabled && !props.loading) {
      event.preventDefault()
      // Trigger click on Enter/Space
      nextTick(() => {
        buttonRef.value?.click()
      })
    }
  }
  emit('keydown', event)
}

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event)
}

// Public methods
const focus = () => {
  buttonRef.value?.focus()
}

const blur = () => {
  buttonRef.value?.blur()
}

const getElement = (): HTMLButtonElement | null => {
  return buttonRef.value || null
}

// Expose public methods
defineExpose<ButtonExpose>({
  focus,
  blur,
  getElement
})
</script>

<style lang="scss" scoped>
@use './styles/fcx-icon-button.scss';
</style>
