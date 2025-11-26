<template>
  <div class="notification-empty">
    <i :class="emptyIcon"></i>
    <h4>{{ emptyTitle }}</h4>
    <p>{{ emptyMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import type { NotificationTab } from '../types/notification'
import { EMPTY_STATES } from '../constants/notificationConstants'

interface Props {
  tab: NotificationTab
  customTitle?: string
  customMessage?: string
  customIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  customTitle: '',
  customMessage: '',
  customIcon: ''
})

// Get empty state configuration for the tab
const emptyConfig = EMPTY_STATES[props.tab]

const emptyIcon = props.customIcon || emptyConfig?.icon || 'pi pi-info-circle'
const emptyTitle = props.customTitle || emptyConfig?.title || 'No items'
const emptyMessage = props.customMessage || emptyConfig?.message || 'Nothing to show here.'
</script>

<style lang="scss" scoped>
.notification-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: var(--header-text-secondary);

  i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
    color: var(--header-text-secondary);
  }

  h4 {
    font-size: 16px;
    margin: 0 0 8px 0;
    color: var(--header-text);
    font-weight: 500;
  }

  p {
    font-size: 12px;
    margin: 0;
    opacity: 0.8;
    max-width: 200px;
    line-height: 1.4;
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .notification-empty {
    padding: 40px 20px;

    i {
      font-size: 36px;
      margin-bottom: 12px;
    }

    h4 {
      font-size: 14px;
    }

    p {
      font-size: 11px;
    }
  }
}
</style>
