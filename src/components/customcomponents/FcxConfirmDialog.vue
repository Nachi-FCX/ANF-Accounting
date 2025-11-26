<template>
  <!-- Dialog Backdrop -->
  <Teleport to="body">
    <Transition name="dialog-backdrop" appear>
      <div
        v-if="visible"
        class="fcx-dialog-backdrop"
        @click="handleBackdropClick"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="messageId"
      >
        <!-- Dialog Container -->
        <Transition name="dialog-content" appear>
          <div
            v-if="visible"
            class="fcx-dialog-container"
            :class="[`fcx-dialog--${variant}`, { 'fcx-dialog--closing': isClosing }]"
            :style="dialogStyles"
            @click.stop
            ref="dialogRef"
          >
            <!-- Dialog Header -->
            <div class="fcx-dialog-header">
              <!-- Icon -->
              <div v-if="icon || hasDefaultIcon" class="fcx-dialog-icon" :class="`fcx-dialog-icon--${variant}`">
                <i :class="displayIcon"></i>
              </div>
              
              <!-- Title -->
              <h3 v-if="title" :id="titleId" class="fcx-dialog-title">
                {{ title }}
              </h3>
              
              <!-- Close Button -->
              <button
                v-if="showCloseButton"
                class="fcx-dialog-close"
                @click="handleCancel"
                aria-label="Close dialog"
                type="button"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>

            <!-- Dialog Body -->
            <div class="fcx-dialog-body">
              <p :id="messageId" class="fcx-dialog-message">
                {{ message }}
              </p>
            </div>

            <!-- Dialog Footer -->
            <div class="fcx-dialog-footer">
              <button
                class="fcx-button fcx-button--secondary"
                @click="handleCancel"
                type="button"
                ref="cancelButtonRef"
              >
                {{ cancelText }}
              </button>
              <button
                class="fcx-button"
                :class="confirmButtonClass"
                @click="handleConfirm"
                type="button"
                ref="confirmButtonRef"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { ConfirmDialogProps, ConfirmDialogEmits, DialogVariantConfigs } from './types/dialog-types'

// Props
const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  title: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'white',
  icon: '',
  width: '400px',
  maxWidth: '90vw'
})

// Emits
const emit = defineEmits<ConfirmDialogEmits>()

// Refs
const dialogRef = ref<HTMLElement>()
const confirmButtonRef = ref<HTMLButtonElement>()
const cancelButtonRef = ref<HTMLButtonElement>()

// State
const isClosing = ref(false)
const showCloseButton = ref(false) // Can be made configurable via props

// Generate unique IDs for accessibility
const titleId = `dialog-title-${Math.random().toString(36).substr(2, 9)}`
const messageId = `dialog-message-${Math.random().toString(36).substr(2, 9)}`

// Variant configurations
const variantConfigs: DialogVariantConfigs = {
  warning: {
    iconColor: '#f59e0b',
    confirmButtonClass: 'fcx-button--warning',
    borderColor: '#fbbf24',
    backgroundColor: '#fffbeb',
    titleColor: '#92400e'
  },
  white: {
    iconColor: '#6b7280',
    confirmButtonClass: 'fcx-button--primary',
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    titleColor: '#1f2937'
  },
  danger: {
    iconColor: '#ef4444',
    confirmButtonClass: 'fcx-button--danger',
    borderColor: '#f87171',
    backgroundColor: '#fef2f2',
    titleColor: '#991b1b'
  }
}

// Computed properties
const currentVariantConfig = computed(() => variantConfigs[props.variant])

const confirmButtonClass = computed(() => currentVariantConfig.value.confirmButtonClass)

const hasDefaultIcon = computed(() => !props.icon && props.variant !== 'white')

const displayIcon = computed(() => {
  if (props.icon) return props.icon
  
  switch (props.variant) {
    case 'warning':
      return 'pi pi-exclamation-triangle'
    case 'danger':
      return 'pi pi-exclamation-circle'
    case 'white':
    default:
      return 'pi pi-question-circle'
  }
})

const dialogStyles = computed(() => ({
  width: props.width,
  maxWidth: props.maxWidth
}))

// Methods
const handleConfirm = () => {
  emit('confirm')
  closeDialog()
}

const handleCancel = () => {
  emit('cancel')
  closeDialog()
}

const handleBackdropClick = (event: MouseEvent) => {
  // Only close if clicking directly on the backdrop, not on dialog content
  if (event.target === event.currentTarget) {
    // Optionally allow closing on backdrop click (can be made configurable)
    // For now, we'll prevent closing on backdrop click to match your requirement
    // handleCancel()
  }
}

const closeDialog = () => {
  isClosing.value = true
  emit('close')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.visible) return

  switch (event.key) {
    case 'Escape':
      // Prevent closing on Escape key as well to match your requirement
      // event.preventDefault()
      // handleCancel()
      break
    case 'Tab':
      handleTabNavigation(event)
      break
    case 'Enter':
      // If focus is on cancel button, trigger cancel, otherwise confirm
      if (document.activeElement === cancelButtonRef.value) {
        event.preventDefault()
        handleCancel()
      } else {
        event.preventDefault()
        handleConfirm()
      }
      break
  }
}

const handleTabNavigation = (event: KeyboardEvent) => {
  if (!dialogRef.value) return

  const focusableElements = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }
}

const focusFirstElement = async () => {
  await nextTick()
  if (confirmButtonRef.value) {
    confirmButtonRef.value.focus()
  }
}

// Watchers
watch(() => props.visible, async (newVisible) => {
  if (newVisible) {
    isClosing.value = false
    await focusFirstElement()
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
// Theme variables
:root {
  --dialog-backdrop: rgba(0, 0, 0, 0.5);
  --dialog-bg: #ffffff;
  --dialog-border: #e5e7eb;
  --dialog-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --dialog-text: #1f2937;
  --dialog-text-secondary: #6b7280;
  --dialog-radius: 12px;
}

:root[data-theme="dark"] {
  --dialog-backdrop: rgba(0, 0, 0, 0.7);
  --dialog-bg: #1f2937;
  --dialog-border: #374151;
  --dialog-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --dialog-text: #f9fafb;
  --dialog-text-secondary: #d1d5db;
}

// Dialog backdrop
.fcx-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dialog-backdrop);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  z-index: 9999;
  padding: 20px 20px 16px 16px;
}

// Dialog container
.fcx-dialog-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 400px;
  max-width: 500px;
  
  &fcx-dialog--closing {
    pointer-events: none;
  }
  
  // Force white background for all variants
  &fcx-dialog--danger,
  &fcx-dialog--warning,
  &fcx-dialog--white {
    background: #ffffff;
    border-color: #e5e7eb;
  }
}

// Dialog header
.fcx-dialog-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid var(--dialog-border);
}

.fcx-dialog-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  i {
    font-size: 24px;
  }
  
  &fcx-dialog-icon--warning {
    background: #fef3c7;
    color: #f59e0b;
  }
  
  &fcx-dialog-icon--white {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  &fcx-dialog-icon--danger {
    background: #fee2e2;
    color: #ef4444;
  }
}

.fcx-dialog-title {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--dialog-text);
  line-height: 1.4;
  padding-top: 12px;
}

.fcx-dialog-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--dialog-text-secondary);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--dialog-border);
    color: var(--dialog-text);
  }
  
  i {
    font-size: 14px;
  }
}

// Dialog body
.fcx-dialog-body {
  padding: 0 24px 24px 84px; // 84px = 24px + 48px (icon width) + 12px (gap)
  flex: 1;
}

fcx-dialog-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--dialog-text-secondary);
}

// Dialog footer
.fcx-dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px 24px 24px;
  border-top: 1px solid var(--dialog-border);
}

// Button styles
.fcx-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  min-width: 80px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  &--primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    
    &:hover {
      background: #2563eb;
      border-color: #2563eb;
    }
  }
  
  &--secondary {
    background: transparent;
    color: var(--dialog-text-secondary);
    border-color: var(--dialog-border);
    
    &:hover {
      background: var(--dialog-border);
      color: var(--dialog-text);
    }
  }
  
  &--warning {
    background: #f59e0b;
    color: white;
    border-color: #f59e0b;
    
    &:hover {
      background: #d97706;
      border-color: #d97706;
    }
  }
  
  &--danger {
    background: #ef4444;
    color: white;
    border-color: #ef4444;
    
    &:hover {
      background: #dc2626;
      border-color: #dc2626;
    }
  }
}

// Transitions
.dialog-backdrop-enter-active,
.dialog-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-backdrop-enter-from,
.dialog-backdrop-leave-to {
  opacity: 0;
}

.dialog-content-enter-active,
.dialog-content-leave-active {
  transition: all 0.3s ease;
}

.dialog-content-enter-from,
.dialog-content-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

// Responsive design
@media (max-width: 640px) {
  .fcx-dialog-container {
    width: 100% !important;
    max-width: none !important;
    margin: 0;
    border-radius: 12px 12px 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  
  .fcx-dialog-backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .fcx-dialog-body {
    padding-left: 24px;
  }
  
  .fcx-dialog-footer {
    flex-direction: column-reverse;
    
    .fcx-button {
      width: 100%;
    }
  }
}

// RTL support
[dir="rtl"] {
  .fcx-dialog-header {
    direction: rtl;
  }
  
  .fcx-dialog-body {
    padding-left: 24px;
    padding-right: 84px;
  }

  .fcx-dialog-footer {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  [dir="rtl"] .fcx-dialog-body {
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
