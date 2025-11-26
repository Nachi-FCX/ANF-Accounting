<template>
  <div class="events-tab">
    <!-- Tab Header -->
    <div class="notification-tab-header">
      <h3 class="notification-tab-title">Events</h3>
      <div class="notification-tab-actions">
        <button 
          v-if="hasUnreadEvents"
          @click="markAllEventsAsRead"
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
          placeholder="Search events..."
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

    <!-- Events List -->
    <div class="notification-list">
      <!-- Loading State -->
      <div v-if="isLoading" class="notification-loading">
        <i class="pi pi-spinner"></i>
        <span>Loading events...</span>
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
        v-else-if="processedEvents.length === 0"
        tab="events"
        :custom-title="getEmptyStateTitle()"
        :custom-message="getEmptyStateMessage()"
      />

      <!-- Events -->
      <template v-else>
        <NotificationItem
          v-for="event in processedEvents"
          :key="event.id"
          :notification="event"
          @click="handleEventClick"
          @action="handleEventAction"
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
import type { AnyNotification, EventNotification } from '../types/notification'

// Use the notification system
const {
  rawEvents,
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

// Computed properties for events
const hasUnreadEvents = computed(() => 
  rawEvents.value.some(event => !event.isRead)
)

const processedEvents = computed(() => {
  let events = rawEvents.value as AnyNotification[]
  
  // Apply search first
  if (isSearchActive.value) {
    events = performSearch(events)
  }
  
  // Then apply filters and sorting
  return applyFiltersAndSort(events)
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

const markAllEventsAsRead = () => {
  rawEvents.value.forEach(event => {
    event.isRead = true
  })
}

const handleEventClick = (event: AnyNotification) => {
  // Mark as read if not already read
  if (!event.isRead) {
    markAsRead(event.id, 'events')
  }
}

const handleEventAction = (action: 'read' | 'unread' | 'delete', event: AnyNotification) => {
  switch (action) {
    case 'read':
      markAsRead(event.id, 'events')
      break
    case 'delete':
      deleteNotification(event.id, 'events')
      break
  }
}

const getEmptyStateTitle = () => {
  if (isSearchActive.value) {
    return 'No search results'
  }
  if (activeFilter.value !== 'all') {
    return `No ${activeFilter.value} events`
  }
  return 'No upcoming events'
}

const getEmptyStateMessage = () => {
  if (isSearchActive.value) {
    return `No events found for "${searchQuery.value}"`
  }
  if (activeFilter.value === 'unread') {
    return 'All events have been reviewed.'
  }
  if (activeFilter.value === 'today') {
    return 'No events scheduled for today.'
  }
  return 'Your calendar is clear for now.'
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

.events-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
}

// Event-specific styling enhancements
.notification-item {
  &.type-warning {
    border-left-color: #f59e0b;
    
    &.unread::before {
      background: #f59e0b;
    }
  }
  
  &.type-info {
    border-left-color: #3b82f6;
    
    &.unread::before {
      background: #3b82f6;
    }
  }
}

// Priority indicators for events
.notification-item.priority-high {
  &::after {
    content: '';
    position: absolute;
    right: 8px;
    top: 8px;
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
  }
}
</style>
