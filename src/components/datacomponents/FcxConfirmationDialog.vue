<template>
  <FcxDialog
    :visible="visible"
    :header="computedTitle"
    position="top"
    :modal="true"
    :closable="false"
    :dismissableMask="false"
    :closeOnEscape="false"
    size="small"
    :width="width || '400px'"
    :class="dialogClasses"
    @update:visible="onVisibilityChange"
  >
    <div class="fcx-confirmation-dialog__content">
      <!-- Icon Section -->
      <div v-if="showIcon" class="fcx-confirmation-dialog__icon">
        <slot name="icon">
          <i :class="computedIcon" :style="{ color: computedIconColor }"></i>
        </slot>
      </div>

      <!-- Message Section -->
      <div class="fcx-confirmation-dialog__message">
        <slot>
          {{ message }}
        </slot>
      </div>
    </div>

    <!-- Actions Section -->
    <template #footer>
      <div class="fcx-confirmation-dialog__actions">
        <slot name="actions" :confirm="handleConfirm" :cancel="handleCancel">
          <FcxButton
            :label="cancelText"
            severity="secondary"
            outlined
            size="small"
            @click="handleCancel"
            class="fcx-confirmation-dialog__cancel-btn"
          />
          <FcxButton
            :label="confirmText"
            :severity="computedConfirmSeverity"
            size="small"
            :loading="confirmLoading"
            :autofocus="autoFocusConfirm"
            @click="handleConfirm"
            class="fcx-confirmation-dialog__confirm-btn"
          />
        </slot>
      </div>
    </template>
  </FcxDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FcxDialog from './FcxDialog.vue'
import FcxButton from '@/components/buttoncomponents/FcxButton.vue'
import type { 
  FcxConfirmationDialogProps, 
  FcxConfirmationDialogEmits, 
  ConfirmationDialogConfig 
} from './types/dialog-types'
import type { ButtonSeverity } from '@/components/buttoncomponents/types/button-types'

defineOptions({
  name: 'fcxConfirmationDialog'
})

// Props with defaults
const props = withDefaults(defineProps<FcxConfirmationDialogProps>(), {
  visible: false,
  title: '',
  confirmText: 'Yes',
  cancelText: 'No',
  variant: 'info',
  showIcon: true,
  confirmLoading: false,
  autoFocusConfirm: true
})

// Emits
const emit = defineEmits<FcxConfirmationDialogEmits>()

// Configuration for different variants
const variantConfig: ConfirmationDialogConfig = {
  defaultVariant: 'info',
  defaultTexts: {
    confirm: 'Yes',
    cancel: 'No',
    title: 'Confirmation'
  },
  variants: {
    info: {
      icon: 'pi pi-info-circle',
      confirmButtonSeverity: 'primary',
      iconColor: '#3b82f6'
    },
    warning: {
      icon: 'pi pi-exclamation-triangle',
      confirmButtonSeverity: 'warning',
      iconColor: '#f59e0b'
    },
    danger: {
      icon: 'pi pi-exclamation-triangle',
      confirmButtonSeverity: 'danger',
      iconColor: '#ef4444'
    },
    success: {
      icon: 'pi pi-check-circle',
      confirmButtonSeverity: 'success',
      iconColor: '#10b981'
    }
  }
}

// Computed properties
const computedTitle = computed(() => {
  return props.title || variantConfig.defaultTexts.title
})

const computedIcon = computed(() => {
  return props.icon || variantConfig.variants[props.variant].icon
})

const computedIconColor = computed(() => {
  return variantConfig.variants[props.variant].iconColor
})

const computedConfirmSeverity = computed((): ButtonSeverity => {
  return variantConfig.variants[props.variant].confirmButtonSeverity as ButtonSeverity
})

const dialogClasses = computed(() => [
  'fcx-confirmation-dialog',
  `fcx-confirmation-dialog--${props.variant}`
].join(' '))

// Event handlers
const onVisibilityChange = (visible: boolean) => {
  emit('update:visible', visible)
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.fcx-confirmation-dialog {
  &__content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 0;
  }

  &__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: var(--surface-50);

    i {
      font-size: 1.5rem;
    }
  }

  &__message {
    flex: 1;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--text-color);
    padding-top: 0.5rem;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 0;
  }

  &__cancel-btn,
  &__confirm-btn {
    min-width: 80px;
  }
}

// Global styles for the confirmation dialog
:global(fcx-confirmation-dialog) {
  .p-dialog {
    .p-dialog-header {
      padding: 1.25rem 1.5rem 0.75rem;
      border-bottom: 1px solid var(--surface-border);

      .p-dialog-title {
        font-weight: 600;
        font-size: 1.125rem;
        color: var(--text-color);
      }
    }

    .p-dialog-content {
      padding: 0 1.5rem;
    }

    .p-dialog-footer {
      padding: 1rem 1.5rem 1.25rem;
      border-top: 1px solid var(--surface-border);
      background-color: var(--surface-50);
    }
  }

  // Blur background overlay
  .p-dialog-mask {
    backdrop-filter: blur(4px);
    background-color: rgba(0, 0, 0, 0.4) !important;
  }

  // Top positioning specific styles
  &.p-dialog-top .p-dialog {
    margin-top: 2rem;
    animation: slideDown 0.3s ease-out;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// Variant specific styling
:global(fcx-confirmation-dialog--danger) {
  .p-dialog-header .p-dialog-title {
    color: var(--red-600);
  }
}

:global(fcx-confirmation-dialog--warning) {
  .p-dialog-header .p-dialog-title {
    color: var(--orange-600);
  }
}

:global(fcx-confirmation-dialog--success) {
  .p-dialog-header .p-dialog-title {
    color: var(--green-600);
  }
}

:global(fcx-confirmation-dialog--info) {
  .p-dialog-header .p-dialog-title {
    color: var(--blue-600);
  }
}
</style>