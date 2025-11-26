<template>
  <div 
    class="notification-item"
    :class="{ 
      'unread': !notification.isRead,
      [`type-${notification.type}`]: true,
      [`priority-${notification.priority}`]: notification.priority
    }"
    @click="handleClick"
  >
    <!-- Notification Icon -->
    <div class="notification-icon">
      <i 
        :class="getNotificationIcon(notification.type)" 
        :style="{ color: getNotificationColor(notification.type) }"
      ></i>
    </div>
    
    <!-- Notification Content -->
    <div class="notification-content">
      <!-- Header with title and time -->
      <div class="notification-header">
        <h4 class="notification-title">{{ notification.title }}</h4>
        <span class="notification-time">{{ formatTimestamp(notification.timestamp) }}</span>
      </div>
      
      <!-- Message -->
      <p class="notification-message">{{ notification.message }}</p>
      
      <!-- Event-specific details -->
      <div v-if="isEventNotification(notification)" class="event-details">
        <div class="event-date">
          <i class="pi pi-calendar"></i>
          {{ formatEventDate(notification.eventDate) }}
        </div>
        <div v-if="notification.location" class="event-location">
          <i class="pi pi-map-marker"></i>
          {{ notification.location }}
        </div>
        <div v-if="notification.attendees?.length" class="event-attendees">
          <i class="pi pi-users"></i>
          {{ notification.attendees.join(', ') }}
        </div>
        <div v-if="notification.project" class="event-project">
          <i class="pi pi-briefcase"></i>
          {{ notification.project }}
        </div>
      </div>
      
      <!-- What's New specific details -->
      <div v-if="isWhatsNewNotification(notification)" class="whats-new-details">
        <span class="version-badge">v{{ notification.version }}</span>
        <span class="feature-type" :class="notification.featureType">
          {{ notification.featureType }}
        </span>
      </div>
      
      <!-- Meta information -->
      <div class="notification-meta">
        <span class="notification-category">
          <i :class="getCategoryIcon(notification.category)"></i>
          {{ notification.category }}
        </span>
        <span 
          v-if="notification.priority" 
          class="notification-priority" 
          :class="notification.priority"
        >
          <i class="pi pi-circle-fill"></i>
          {{ notification.priority }}
        </span>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="notification-actions">
      <button 
        v-if="!notification.isRead"
        @click.stop="handleAction('read')"
        class="notification-action-btn"
        title="Mark as read"
      >
        <i class="pi pi-check"></i>
      </button>
      <button 
        @click.stop="handleAction('delete')"
        class="notification-action-btn delete"
        title="Delete"
      >
        <i class="pi pi-trash"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { AnyNotification } from '../types/notification'
import { 
  getNotificationIcon, 
  getNotificationColor, 
  getCategoryIcon,
  formatTimestamp,
  formatEventDate,
  isEventNotification,
  isWhatsNewNotification
} from '../utils/notificationUtils'

interface Props {
  notification: AnyNotification
}

interface Emits {
  (e: 'action', action: 'read' | 'unread' | 'delete', notification: AnyNotification): void
  (e: 'click', notification: AnyNotification): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

const handleClick = () => {
  emit('click', props.notification)
  
  // Navigate to action URL if provided
  if (props.notification.actionUrl) {
    router.push(props.notification.actionUrl)
  }
}

const handleAction = (action: 'read' | 'unread' | 'delete') => {
  emit('action', action, props.notification)
}
</script>

<style lang="scss" scoped>
.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 1px solid rgba(45, 45, 45, 0.2);
  position: relative;

  &:hover {
    background: rgba(45, 45, 45, 0.3);

    :root[data-theme="light"] & {
      background: rgba(229, 231, 235, 0.3);
    }

    .notification-actions {
      opacity: 1;
    }
  }

  &.unread {
    background: rgba(59, 130, 246, 0.05);
    border-left: 3px solid #3b82f6;

    &::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 20px;
      width: 6px;
      height: 6px;
      background: #3b82f6;
      border-radius: 50%;
    }
  }

  &:last-child {
    border-bottom: none;
  }

  :root[data-theme="light"] & {
    border-bottom-color: rgba(229, 231, 235, 0.2);
  }
}

.notification-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(45, 45, 45, 0.5);
  border-radius: 50%;
  flex-shrink: 0;

  i {
    font-size: 14px;
  }

  :root[data-theme="light"] & {
    background: rgba(229, 231, 235, 0.5);
  }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
  gap: 8px;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--header-text);
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.notification-time {
  font-size: 11px;
  color: var(--header-text-secondary);
  flex-shrink: 0;
  white-space: nowrap;
}

.notification-message {
  font-size: 12px;
  color: var(--header-text-secondary);
  margin: 0 0 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.notification-category {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--header-text-secondary);
  text-transform: capitalize;

  i {
    font-size: 10px;
  }
}

.notification-priority {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.high {
    color: #ef4444;
  }

  &.medium {
    color: #f59e0b;
  }

  &.low {
    color: #6b7280;
  }

  i {
    font-size: 6px;
  }
}

// Event-specific styles
.event-details {
  margin-top: 6px;
  font-size: 11px;
  color: var(--header-text-secondary);

  > div {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;

    &:first-child {
      margin-top: 0;
    }

    i {
      font-size: 10px;
      width: 12px;
      flex-shrink: 0;
    }
  }

  .event-date {
    font-weight: 500;
    color: #3b82f6;
  }

  .event-attendees {
    opacity: 0.8;
  }
}

// What's New specific styles
.whats-new-details {
  margin-top: 6px;
  font-size: 11px;
  color: var(--header-text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;

  .version-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
  }

  .feature-type {
    text-transform: capitalize;
    font-weight: 500;

    &.new {
      color: #10b981;
    }

    &.update {
      color: #f59e0b;
    }

    &.improvement {
      color: #3b82f6;
    }
  }
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease;
  margin-left: 8px;
}

.notification-action-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid rgba(45, 45, 45, 0.8);
  border-radius: 4px;
  color: var(--header-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(45, 45, 45, 0.8);
    color: var(--header-text);

    :root[data-theme="light"] & {
      background: rgba(229, 231, 235, 0.8);
    }
  }

  &.delete:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }

  i {
    font-size: 10px;
  }

  :root[data-theme="light"] & {
    border-color: rgba(229, 231, 235, 0.8);
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .notification-item {
    padding: 12px 16px;
    gap: 10px;
  }

  .notification-icon {
    width: 28px;
    height: 28px;

    i {
      font-size: 12px;
    }
  }

  .notification-title {
    font-size: 13px;
  }

  .notification-message {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .notification-item {
    padding: 10px 12px;
    gap: 8px;
  }

  .notification-actions {
    margin-left: 4px;
  }

  .notification-action-btn {
    width: 20px;
    height: 20px;

    i {
      font-size: 9px;
    }
  }
}

// Touch device optimizations
@media (hover: none) and (pointer: coarse) {
  .notification-actions {
    opacity: 1;
  }

  .notification-action-btn {
    min-width: 32px;
    min-height: 32px;
  }
}
</style>
