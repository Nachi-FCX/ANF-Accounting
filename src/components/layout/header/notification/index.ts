// Main notification system
export { default as NotificationTabs } from './views/NotificationTabs.vue'

// Individual tab components
export { default as NotificationsTab } from './components/NotificationsTab.vue'
export { default as EventsTab } from './components/EventsTab.vue'
export { default as WhatsNewTab } from './components/WhatsNewTab.vue'

// Shared components
export { default as NotificationItem } from './components/NotificationItem.vue'
export { default as NotificationEmpty } from './components/NotificationEmpty.vue'

// Composables
export { useNotificationSystem, useNotificationTabs, useNotificationFilters, useNotificationSearch } from './composables/useNotificationSystem'
export { useNotifications } from './composables/useNotifications'

// Types
export type {
  Notification,
  EventNotification,
  WhatsNewNotification,
  AnyNotification,
  NotificationTab,
  TabConfig,
  TabState,
  NotificationFilter,
  NotificationState,
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationQuery,
  NotificationCategory,
  EventCategory,
  WhatsNewCategory
} from './types/notification'

// Constants
export {
  TAB_CONFIG,
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
  PRIORITY_LEVELS,
  FEATURE_TYPES,
  REFRESH_INTERVAL,
  NOTIFICATION_LIMITS,
  ANIMATION_DURATION,
  NOTIFICATION_SOUNDS,
  DATE_FORMATS,
  FILTER_OPTIONS,
  SORT_OPTIONS,
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
  CATEGORY_ICONS,
  PRIORITY_COLORS,
  EMPTY_STATES
} from './constants/notificationConstants'

// Utilities
export {
  formatTimestamp,
  formatEventDate,
  formatAbsoluteDate,
  getNotificationIcon,
  getNotificationColor,
  getCategoryIcon,
  getPriorityColor,
  isEventNotification,
  isWhatsNewNotification,
  filterNotificationsByDate,
  sortNotifications,
  searchNotifications,
  getUnreadCount,
  getCountsByTab,
  getUnreadCountsByTab,
  isValidNotification,
  groupNotificationsByDate,
  groupNotificationsByCategory,
  truncateText,
  isValidUrl,
  getStaggerDelay,
  saveNotificationPreferences,
  loadNotificationPreferences
} from './utils/notificationUtils'
