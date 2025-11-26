<template>
  <div class="notifications-tab">
    <!-- Tab Header -->
    <div class="notification-tab-header">
      <h3 class="notification-tab-title">Notifications</h3>
      <div class="notification-tab-actions">
        <button 
          v-if="hasUnreadNotifications"
          @click.stop="markAllAsRead()"
          class="notification-action-btn"
          title="Mark all as read"
        >
          <i class="pi pi-check"></i>
        </button>
        <button 
          @click.stop="refreshData"
          class="notification-action-btn"
          :class="{ 'spinning': isLoading }"
          title="Refresh"
        >
          <i class="pi pi-refresh"></i>
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="notification-controls">
      <div class="notification-search">
        <i class="pi pi-search search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search notifications..."
          @input="setSearchQuery(($event.target as HTMLInputElement)?.value || '')"
        />
        <button
          v-if="isSearchActive"
          @click.stop="clearSearch"
          class="clear-search"
          title="Clear search"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <div class="notification-filter-dropdown">
        <button
          @click.stop="toggleFilterDropdown"
          class="filter-button"
          :class="{ 'active': isFilterDropdownOpen }"
        >
          <i class="pi pi-filter"></i>
          {{ getActiveFilterLabel() }}
          <i class="pi pi-chevron-down"></i>
        </button>
        
        <div v-if="isFilterDropdownOpen" class="filter-dropdown" @click.stop>
          <button
            v-for="option in filterOptions"
            :key="option.value"
            @click.stop="selectFilter(option.value)"
            class="filter-option"
            :class="{ 'active': activeFilter === option.value }"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="notification-list">
      <!-- Loading State -->
      <div v-if="isLoading" class="notification-loading">
        <i class="pi pi-spinner"></i>
        <span>Loading notifications...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="notification-error">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ error }}</span>
        <button @click.stop="refreshData" class="retry-btn">
          <i class="pi pi-refresh"></i>
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <NotificationEmpty
        v-else-if="processedNotifications.length === 0"
        tab="notifications"
        :custom-title="getEmptyStateTitle()"
        :custom-message="getEmptyStateMessage()"
      />

      <!-- Notifications -->
      <template v-else>
        <NotificationItem
          v-for="notification in processedNotifications"
          :key="notification.id"
          :notification="notification"
          @click="handleNotificationClick"
          @action="handleNotificationAction"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationSystem } from '../composables/useNotificationSystem'
import NotificationEmpty from './NotificationEmpty.vue'
import NotificationItem from './NotificationItem.vue'
import type { AnyNotification } from '../types/notification'

// Use the notification system
const {
  processedNotifications,
  isLoading,
  error,
  hasUnreadNotifications,
  searchQuery,
  isSearchActive,
  activeFilter,
  filterOptions,
  setSearchQuery,
  clearSearch,
  setFilter,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  refreshData
} = useNotificationSystem()

// Filter dropdown state
const isFilterDropdownOpen = ref(false)

// Methods
const toggleFilterDropdown = () => {
  isFilterDropdownOpen.value = !isFilterDropdownOpen.value
}

const selectFilter = (filter: string) => {
  setFilter(filter)
  isFilterDropdownOpen.value = false
}

const getActiveFilterLabel = () => {
  const option = filterOptions.find(opt => opt.value === activeFilter.value)
  return option?.label || 'All'
}

const handleNotificationClick = (notification: AnyNotification) => {
  // Mark as read if not already read
  if (!notification.isRead) {
    markAsRead(notification.id, 'notifications')
  }
}

const handleNotificationAction = (action: 'read' | 'unread' | 'delete', notification: AnyNotification) => {
  switch (action) {
    case 'read':
      markAsRead(notification.id, 'notifications')
      break
    case 'delete':
      deleteNotification(notification.id, 'notifications')
      break
  }
}

const getEmptyStateTitle = () => {
  if (isSearchActive.value) {
    return 'No search results'
  }
  if (activeFilter.value !== 'all') {
    return `No ${activeFilter.value} notifications`
  }
  return 'No notifications'
}

const getEmptyStateMessage = () => {
  if (isSearchActive.value) {
    return `No notifications found for "${searchQuery.value}"`
  }
  if (activeFilter.value === 'unread') {
    return "You're all caught up!"
  }
  if (activeFilter.value === 'today') {
    return 'No notifications received today.'
  }
  return "You're all caught up!"
}

// Close filter dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (isFilterDropdownOpen.value && !target.closest('.notification-filter-dropdown')) {
    isFilterDropdownOpen.value = false
  }
}

// Add event listener for clicking outside
document.addEventListener('click', handleClickOutside)
</script>

<style lang="scss" scoped>
@use '../styles/notifications.scss';

.notifications-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
