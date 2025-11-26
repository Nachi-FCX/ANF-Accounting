import { ref, computed, onMounted, onUnmounted, readonly, type Ref } from 'vue'
import type { 
  NotificationTab, 
  TabState, 
  AnyNotification,
  Notification,
  EventNotification,
  WhatsNewNotification
} from '../types/notification'
import { TAB_CONFIG } from '../constants/notificationConstants'
import { 
  filterNotificationsByDate, 
  sortNotifications, 
  searchNotifications,
  getUnreadCountsByTab,
  getCountsByTab
} from '../utils/notificationUtils'

// Import JSON data
import notificationsData from '../data/notifications.json'
import eventsData from '../data/events.json'
import whatsNewData from '../data/whatsNew.json'

// Global state - singleton pattern using module-level variables
const activeTab = ref<NotificationTab>('notifications')
const isDropdownOpen = ref(false)

// Raw data (convert timestamps to Date objects)
const rawNotifications = ref<Notification[]>(
  notificationsData.notifications.map(n => ({
    ...n,
    timestamp: new Date(n.timestamp),
    type: n.type as 'info' | 'success' | 'warning' | 'error',
    category: n.category as 'system' | 'user' | 'financial' | 'security',
    priority: n.priority as 'low' | 'medium' | 'high'
  }))
)

const rawEvents = ref<EventNotification[]>(
  eventsData.events.map(e => ({
    ...e,
    timestamp: new Date(e.timestamp),
    eventDate: new Date(e.eventDate),
    type: e.type as 'info' | 'success' | 'warning' | 'error',
    category: e.category as 'meeting' | 'deadline' | 'maintenance' | 'reminder',
    priority: e.priority as 'low' | 'medium' | 'high'
  }))
)

const rawWhatsNew = ref<WhatsNewNotification[]>(
  whatsNewData.updates.map(w => ({
    ...w,
    timestamp: new Date(w.timestamp),
    type: w.type as 'info' | 'success' | 'warning' | 'error',
    category: w.category as 'feature' | 'improvement' | 'release' | 'security',
    priority: w.priority as 'low' | 'medium' | 'high',
    featureType: w.featureType as 'new' | 'update' | 'improvement'
  }))
)

export function useNotificationTabs() {
  // Return the same global state references

  // Computed properties for counts
  const tabCounts = computed(() => 
    getCountsByTab(rawNotifications.value, rawEvents.value, rawWhatsNew.value)
  )

  const unreadCounts = computed(() => 
    getUnreadCountsByTab(rawNotifications.value, rawEvents.value, rawWhatsNew.value)
  )

  const totalUnreadCount = computed(() => 
    Object.values(unreadCounts.value).reduce((sum, count) => sum + count, 0)
  )

  const hasUnreadNotifications = computed(() => totalUnreadCount.value > 0)

  // Tab configuration
  const tabConfig = computed(() => TAB_CONFIG.tabs)

  // Methods
  const setActiveTab = (tab: NotificationTab) => {
    activeTab.value = tab
  }

  const toggleDropdown = () => {
    console.log('toggleDropdown called, current state:', isDropdownOpen.value)
    isDropdownOpen.value = !isDropdownOpen.value
    console.log('toggleDropdown new state:', isDropdownOpen.value)
  }

  const closeDropdown = () => {
    isDropdownOpen.value = false
  }

  const openDropdown = () => {
    isDropdownOpen.value = true
  }

  // Get notifications for active tab
  const getNotificationsForTab = (tab: NotificationTab): AnyNotification[] => {
    switch (tab) {
      case 'notifications':
        return rawNotifications.value
      case 'events':
        return rawEvents.value
      case 'whats-new':
        return rawWhatsNew.value
      default:
        return []
    }
  }

  const activeTabNotifications = computed(() => 
    getNotificationsForTab(activeTab.value)
  )

  // Mark notification as read
  const markAsRead = (id: string, tab?: NotificationTab) => {
    const targetTab = tab || activeTab.value
    const notifications = getNotificationsForTab(targetTab)
    const notification = notifications.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
  }

  // Mark all notifications as read for a tab
  const markAllAsRead = (tab?: NotificationTab) => {
    const targetTab = tab || activeTab.value
    const notifications = getNotificationsForTab(targetTab)
    notifications.forEach((n: AnyNotification) => n.isRead = true)
  }

  // Delete notification
  const deleteNotification = (id: string, tab?: NotificationTab) => {
    const targetTab = tab || activeTab.value
    switch (targetTab) {
      case 'notifications':
        rawNotifications.value = rawNotifications.value.filter((n: Notification) => n.id !== id)
        break
      case 'events':
        rawEvents.value = rawEvents.value.filter((n: EventNotification) => n.id !== id)
        break
      case 'whats-new':
        rawWhatsNew.value = rawWhatsNew.value.filter((n: WhatsNewNotification) => n.id !== id)
        break
    }
  }

  return {
    // State
    activeTab,
    isDropdownOpen,
    tabCounts,
    unreadCounts,
    totalUnreadCount,
    hasUnreadNotifications,
    tabConfig,
    activeTabNotifications,

    // Raw data
    rawNotifications,
    rawEvents,
    rawWhatsNew,

    // Methods
    setActiveTab,
    toggleDropdown,
    closeDropdown,
    openDropdown,
    getNotificationsForTab,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}

export function useNotificationFilters() {
  // Filter state
  const activeFilter = ref('all')
  const sortBy = ref<'timestamp' | 'priority' | 'type'>('timestamp')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  // Filter options
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' }
  ]

  // Sort options
  const sortOptions = [
    { label: 'Newest First', value: 'timestamp_desc' },
    { label: 'Oldest First', value: 'timestamp_asc' },
    { label: 'High Priority', value: 'priority_desc' },
    { label: 'By Type', value: 'type' }
  ]

  // Apply filters and sorting
  const applyFiltersAndSort = (notifications: AnyNotification[]): AnyNotification[] => {
    let filtered = filterNotificationsByDate(notifications, activeFilter.value)
    return sortNotifications(filtered, sortBy.value, sortOrder.value)
  }

  // Methods
  const setFilter = (filter: string) => {
    activeFilter.value = filter
  }

  const setSorting = (sort: string) => {
    switch (sort) {
      case 'timestamp_desc':
        sortBy.value = 'timestamp'
        sortOrder.value = 'desc'
        break
      case 'timestamp_asc':
        sortBy.value = 'timestamp'
        sortOrder.value = 'asc'
        break
      case 'priority_desc':
        sortBy.value = 'priority'
        sortOrder.value = 'desc'
        break
      case 'type':
        sortBy.value = 'type'
        sortOrder.value = 'asc'
        break
    }
  }

  const resetFilters = () => {
    activeFilter.value = 'all'
    sortBy.value = 'timestamp'
    sortOrder.value = 'desc'
  }

  return {
    // State
    activeFilter,
    sortBy,
    sortOrder,
    filterOptions,
    sortOptions,

    // Methods
    applyFiltersAndSort,
    setFilter,
    setSorting,
    resetFilters
  }
}

export function useNotificationSearch() {
  // Search state
  const searchQuery = ref('')
  const isSearchActive = ref(false)

  // Search methods
  const performSearch = (notifications: AnyNotification[]): AnyNotification[] => {
    if (!searchQuery.value.trim()) {
      return notifications
    }
    return searchNotifications(notifications, searchQuery.value)
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    isSearchActive.value = query.trim().length > 0
  }

  const clearSearch = () => {
    searchQuery.value = ''
    isSearchActive.value = false
  }

  const toggleSearch = () => {
    if (isSearchActive.value) {
      clearSearch()
    } else {
      isSearchActive.value = true
    }
  }

  return {
    // State
    searchQuery,
    isSearchActive,

    // Methods
    performSearch,
    setSearchQuery,
    clearSearch,
    toggleSearch
  }
}

// Combined composable that uses all the above
export function useNotificationSystem() {
  const tabs = useNotificationTabs()
  const filters = useNotificationFilters()
  const search = useNotificationSearch()

  // Loading state
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Combined processed notifications
  const processedNotifications = computed(() => {
    let notifications = tabs.activeTabNotifications.value
    
    // Apply search first
    if (search.isSearchActive.value) {
      notifications = search.performSearch(notifications)
    }
    
    // Then apply filters and sorting
    return filters.applyFiltersAndSort(notifications)
  })

  // Keyboard shortcuts
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && tabs.isDropdownOpen.value) {
      tabs.closeDropdown()
    }
    
    // Tab switching with numbers
    if (event.key >= '1' && event.key <= '3' && tabs.isDropdownOpen.value) {
      const tabIndex = parseInt(event.key) - 1
      const tabId = tabs.tabConfig.value[tabIndex]?.id
      if (tabId) {
        tabs.setActiveTab(tabId as NotificationTab)
      }
    }
    
    // Search shortcut
    if ((event.ctrlKey || event.metaKey) && event.key === 'k' && tabs.isDropdownOpen.value) {
      event.preventDefault()
      search.toggleSearch()
    }
  }

  // Auto-close dropdown when clicking outside
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (tabs.isDropdownOpen.value && 
        !target.closest('.notification-tabs') && 
        !target.closest('.notification-btn')) {
      tabs.closeDropdown()
    }
  }

  // Lifecycle
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('click', handleClickOutside)
  })

  // Refresh data (simulate API call)
  const refreshData = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real app, you would fetch fresh data here
      // For now, we'll just clear the loading state
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to refresh notifications'
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Tab functionality
    ...tabs,
    
    // Filter functionality
    ...filters,
    
    // Search functionality
    ...search,
    
    // Combined state
    processedNotifications,
    isLoading,
    error,
    
    // Methods
    refreshData
  }
}
