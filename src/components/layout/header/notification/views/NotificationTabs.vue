<template>
  <div 
    class="notification-tabs"
    :class="{ 'open': isDropdownOpen }"
  >
    <!-- Debug: {{ isDropdownOpen }} -->
    <!-- Backdrop -->
    <div 
      v-if="isDropdownOpen"
      class="notification-backdrop" 
      @click="closeDropdown"
    ></div>
    
    <!-- Dropdown Panel -->
    <div 
      v-if="isDropdownOpen"
      class="notification-dropdown"
      :class="{ 'open': isDropdownOpen }"
      @click.stop
    >
      <!-- Tab Navigation -->
      <nav class="notification-tab-nav">
        <button
          v-for="tab in tabConfig"
          :key="tab.id"
          @click="handleTabClick($event, tab.id)"
          class="notification-tab-button"
          :class="{ 'active': activeTab === tab.id }"
        >
          <i :class="tab.icon"></i>
          {{ tab.label }}
          <span 
            v-if="(unreadCounts as any)[tab.id] > 0"
            class="tab-badge"
            :class="{ 'pulse': (unreadCounts as any)[tab.id] > 0 }"
            :style="{ '--badge-color': tab.badgeColor }"
          >
            {{ (unreadCounts as any)[tab.id] > 99 ? '99+' : (unreadCounts as any)[tab.id] }}
          </span>
        </button>
      </nav>

      <!-- Tab Content -->
      <div class="notification-tab-content">
        <!-- Notifications Tab -->
        <NotificationsTab v-if="activeTab === 'notifications'" />
        
        <!-- Events Tab -->
        <EventsTab v-else-if="activeTab === 'events'" />
        
        <!-- What's New Tab -->
        <WhatsNewTab v-else-if="activeTab === 'whats-new'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationSystem } from '../composables/useNotificationSystem'
import NotificationsTab from '../components/NotificationsTab.vue'
import EventsTab from '../components/EventsTab.vue'
import WhatsNewTab from '../components/WhatsNewTab.vue'

// Use the notification system
const {
  activeTab,
  isDropdownOpen,
  tabConfig,
  unreadCounts,
  setActiveTab,
  closeDropdown
} = useNotificationSystem()

// Handle tab click with event prevention
const handleTabClick = (event: Event, tabId: string) => {
  event.stopPropagation()
  setActiveTab(tabId as any)
}
</script>

<style lang="scss" scoped>
@use '../styles/notifications.scss';

// Tab Navigation
.notification-tab-nav {
  display: flex;
  background: rgba(45, 45, 45, 0.5);
  border-bottom: 1px solid rgba(45, 45, 45, 0.8);
  padding: 0;
  margin: 0;

  :root[data-theme="light"] & {
    background: rgba(229, 231, 235, 0.5);
    border-bottom-color: rgba(229, 231, 235, 0.8);
  }
}

.notification-tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--header-text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    background: rgba(45, 45, 45, 0.8);
    color: var(--header-text);

    :root[data-theme="light"] & {
      background: rgba(229, 231, 235, 0.8);
    }
  }

  &.active {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border-bottom: 2px solid #3b82f6;
  }

  i {
    font-size: 14px;
  }

  .tab-badge {
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--badge-color, #ef4444);
    color: white;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 600;
    line-height: 1;
    padding: 0 4px;
    margin-left: 4px;

    &.pulse {
      animation: pulse 2s infinite;
    }
  }
}

// Tab Content
.notification-tab-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 520px;
}

// Animations
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

// Responsive styles
@media (max-width: 768px) {
  .notification-dropdown {
    right: 12px;
    left: 12px;
    width: auto;
    max-height: 70vh;

    [dir="rtl"] & {
      left: 12px;
      right: 12px;
    }
  }

  .notification-tab-button {
    padding: 10px 12px;
    font-size: 12px;

    .tab-badge {
      min-width: 16px;
      height: 16px;
      font-size: 9px;
    }
  }
}

@media (max-width: 480px) {
  .notification-dropdown {
    top: 60px;
    right: 8px;
    left: 8px;
    max-height: 60vh;

    [dir="rtl"] & {
      left: 8px;
      right: 8px;
    }
  }

  .notification-tab-button {
    padding: 8px 10px;
    font-size: 11px;
    gap: 6px;

    .tab-badge {
      min-width: 14px;
      height: 14px;
      font-size: 8px;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .notification-dropdown {
    border-width: 2px;
  }

  .notification-tab-button {
    &.active {
      border-bottom-width: 3px;
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .notification-dropdown {
    transition: none;
  }

  .notification-tab-button {
    transition: none;
  }

  .tab-badge.pulse {
    animation: none;
  }
}
</style>
