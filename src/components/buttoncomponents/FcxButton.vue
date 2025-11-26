<template>
  <button
    ref="buttonRef"
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel || label"
    :tabindex="tabindex"
    :class="buttonClasses"
    :style="style"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <!-- Loading spinner (shown when loading) -->
    <div
      v-if="loading"
      class="fcx-button-loading-spinner"
      :aria-hidden="true"
    />
    
    <!-- Button content (hidden when loading) -->
    <div class="fcx-button-content">
      <!-- Icon (if provided) -->
      <div
        v-if="icon && !isIconOnly"
        class="fcx-button-icon"
        :class="`fcx-button-icon--${iconPos}`"
        :aria-hidden="true"
      >
        <component :is="icon" v-if="typeof icon !== 'string'" />
        <i v-else :class="icon" />
      </div>
      
      <!-- Icon-only button icon -->
      <div
        v-if="icon && isIconOnly"
        class="fcx-button-icon"
        :aria-hidden="true"
      >
        <component :is="icon" v-if="typeof icon !== 'string'" />
        <i v-else :class="icon" />
      </div>
      
      <!-- Button label text -->
      <span v-if="label && !isIconOnly" class="fcx-button-label">
        {{ label }}
      </span>
      
      <!-- Slot content -->
      <slot v-if="!label && !isIconOnly" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import type { ButtonProps, ButtonEvents, ButtonExpose } from './types/button-types'

// Props with defaults
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  severity: 'primary',
  variant: 'filled',
  size: 'medium',
  iconPos: 'left',
  disabled: false,
  loading: false,
  raised: false,
  rounded: false,
  block: false,
  iconOnly: false,
  tabindex: 0
})

// Emits
const emit = defineEmits<ButtonEvents>()

// Template refs
const buttonRef = ref<HTMLButtonElement>()

// Computed properties
const isIconOnly = computed(() => {
  return props.iconOnly || (props.icon && !props.label && !hasSlotContent.value)
})

const hasSlotContent = computed(() => {
  // This would need to be implemented based on slot usage
  // For now, we'll assume no slot content if not explicitly provided
  return false
})

const buttonClasses = computed(() => [
  'fcx-button',
  `fcx-button--${props.size}`,
  `fcx-button--${props.severity}`,
  `fcx-button--${props.variant}`,
  {
    'fcx-button--block': props.block,
    'fcx-button--rounded': props.rounded,
    'fcx-button--raised': props.raised,
    'fcx-button--icon-only': isIconOnly.value,
    'fcx-button--loading': props.loading,
    'fcx-button--disabled': props.disabled
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
@use './styles/fcx-button.scss';
</style>
