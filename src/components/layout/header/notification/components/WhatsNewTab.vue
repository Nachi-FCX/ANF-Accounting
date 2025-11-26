<template>
  <div class="whats-new-tab">
    <!-- Tab Header -->
    <div class="notification-tab-header">
      <h3 class="notification-tab-title">What's New</h3>
      <div class="notification-tab-actions">
        <button 
          v-if="hasUnreadUpdates"
          @click="markAllUpdatesAsRead"
          class="notification-action-btn"
          title="Mark all as read"
        >
          <i class="pi pi-check"></i>
        </button>
        <button 
          @click="refreshData"
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
          placeholder="Search updates..."
          @input="setSearchQuery(($event.target as HTMLInputElement)?.value || '')"
        />
        <button
          v-if="isSearchActive"
          @click="clearSearch"
          class="clear-search"
          title="Clear search"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <div class="notification-filter-dropdown">
        <button
          @click="toggleFilterDropdown"
          class="filter-button"
          :class="{ 'active': isFilterDropdownOpen }"
        >
          <i class="pi pi-filter"></i>
          {{ getActiveFilterLabel() }}
          <i class="pi pi-chevron-down"></i>
        </button>
        
        <div v-if="isFilterDropdownOpen" class="filter-dropdown">
          <button
            v-for="option in filterOptions"
            :key="option.value"
            @click="selectFilter(option.value)"
            class="filter-option"
            :class="{ 'active': activeFilter === option.value }"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Updates List -->
    <div class="notification-list">
      <!-- Loading State -->
      <div v-if="isLoading" class="notification-loading">
        <i class="pi pi-spinner"></i>
        <span>Loading updates...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="notification-error">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ error }}</span>
        <button @click="refreshData" class="retry-btn">
          <i class="pi pi-refresh"></i>
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <NotificationEmpty
        v-else-if="processedUpdates.length === 0"
        tab="whats-new"
        :custom-title="getEmptyStateTitle()"
        :custom-message="getEmptyStateMessage()"
      />

      <!-- Updates -->
      <template v-else>
        <NotificationItem
          v-for="update in processedUpdates"
          :key="update.id"
          :notification="update"
          @click="handleUpdateClick"
          @action="handleUpdateAction"
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
import type { AnyNotification, WhatsNewNotification } from '../types/notification'

// Use the notification system
const {
  rawWhatsNew,
  isLoading,
  error,
  searchQuery,
  isSearchActive,
  activeFilter,
  filterOptions,
  setSearchQuery,
  clearSearch,
  setFilter,
  markAsRead,
  deleteNotification,
  refreshData,
  performSearch,
  applyFiltersAndSort
} = useNotificationSystem()

// Filter dropdown state
const isFilterDropdownOpen = ref(false)

// Computed properties for updates
const hasUnreadUpdates = computed(() => 
  rawWhatsNew.value.some(update => !update.isRead)
)

const processedUpdates = computed(() => {
  let updates = rawWhatsNew.value as AnyNotification[]
  
  // Apply search first
  if (isSearchActive.value) {
    updates = performSearch(updates)
  }
  
  // Then apply filters and sorting
  return applyFiltersAndSort(updates)
})

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

const markAllUpdatesAsRead = () => {
  rawWhatsNew.value.forEach(update => {
    update.isRead = true
  })
}

const handleUpdateClick = (update: AnyNotification) => {
  // Mark as read if not already read
  if (!update.isRead) {
    markAsRead(update.id, 'whats-new')
  }
}

const handleUpdateAction = (action: 'read' | 'unread' | 'delete', update: AnyNotification) => {
  switch (action) {
    case 'read':
      markAsRead(update.id, 'whats-new')
      break
    case 'delete':
      deleteNotification(update.id, 'whats-new')
      break
  }
}

const getEmptyStateTitle = () => {
  if (isSearchActive.value) {
    return 'No search results'
  }
  if (activeFilter.value !== 'all') {
    return `No ${activeFilter.value} updates`
  }
  return 'No recent updates'
}

const getEmptyStateMessage = () => {
  if (isSearchActive.value) {
    return `No updates found for "${searchQuery.value}"`
  }
  if (activeFilter.value === 'unread') {
    return 'All updates have been reviewed.'
  }
  if (activeFilter.value === 'today') {
    return 'No updates released today.'
  }
  return 'Check back later for new features and improvements.'
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

.whats-new-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
}

// What's New specific styling enhancements
.notification-item {
  &.type-success {
    border-left-color: #10b981;
    
    &.unread::before {
      background: #10b981;
    }
  }
  
  &.type-info {
    border-left-color: #3b82f6;
    
    &.unread::before {
      background: #3b82f6;
    }
  }

  &.type-warning {
    border-left-color: #f59e0b;
    
    &.unread::before {
      background: #f59e0b;
    }
  }
}

// Feature type indicators
.notification-item {
  &.priority-high {
    position: relative;
    
    &::after {
      content: 'NEW';
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 2px 6px;
      background: #10b981;
      color: white;
      font-size: 8px;
      font-weight: 600;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  &.priority-medium {
    &::after {
      content: 'UPD';
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 2px 6px;
      background: #f59e0b;
      color: white;
      font-size: 8px;
      font-weight: 600;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
}

// Version badge styling enhancement
:deep(.version-badge) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

// Feature type styling enhancement
:deep(.feature-type) {
  &.new {
    position: relative;
    
    &::before {
      content: '✨';
      margin-right: 4px;
    }
  }
  
  &.update {
    position: relative;
    
    &::before {
      content: '🔄';
      margin-right: 4px;
    }
  }
  
  &.improvement {
    position: relative;
    
    &::before {
      content: '⚡';
      margin-right: 4px;
    }
  }
}
</style>
