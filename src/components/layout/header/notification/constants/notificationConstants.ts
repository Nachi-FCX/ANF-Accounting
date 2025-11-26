export const TAB_CONFIG = {
  tabs: [
    {
      id: "notifications",
      label: "Notifications",
      icon: "pi pi-bell",
      badgeColor: "#ef4444",
      emptyMessage: "No new notifications",
      emptyIcon: "pi pi-bell-slash"
    },
    {
      id: "events",
      label: "Events",
      icon: "pi pi-calendar",
      badgeColor: "#3b82f6",
      emptyMessage: "No upcoming events",
      emptyIcon: "pi pi-calendar-times"
    },
    {
      id: "whats-new",
      label: "What's New",
      icon: "pi pi-star",
      badgeColor: "#10b981",
      emptyMessage: "No recent updates",
      emptyIcon: "pi pi-star-fill"
    }
  ]
}

export const NOTIFICATION_TYPES = ['info', 'success', 'warning', 'error'] as const

export const NOTIFICATION_CATEGORIES = {
  NOTIFICATIONS: ['system', 'user', 'financial', 'security'] as const,
  EVENTS: ['meeting', 'deadline', 'maintenance', 'reminder'] as const,
  WHATS_NEW: ['feature', 'improvement', 'release', 'security'] as const
}

export const PRIORITY_LEVELS = ['low', 'medium', 'high'] as const

export const FEATURE_TYPES = ['new', 'update', 'improvement'] as const

export const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

export const NOTIFICATION_LIMITS = {
  DEFAULT_DISPLAY: 8,
  MAX_DISPLAY: 50,
  PAGINATION_SIZE: 20
}

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

export const NOTIFICATION_SOUNDS = {
  NEW_NOTIFICATION: '/sounds/notification.mp3',
  SUCCESS: '/sounds/success.mp3',
  WARNING: '/sounds/warning.mp3',
  ERROR: '/sounds/error.mp3'
}

export const DATE_FORMATS = {
  RELATIVE: 'relative', // "2 hours ago"
  ABSOLUTE: 'absolute', // "Jan 6, 2024 2:30 PM"
  TIME_ONLY: 'time' // "2:30 PM"
}

export const FILTER_OPTIONS = {
  ALL: 'all',
  UNREAD: 'unread',
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month'
}

export const SORT_OPTIONS = {
  TIMESTAMP_DESC: 'timestamp_desc',
  TIMESTAMP_ASC: 'timestamp_asc',
  PRIORITY_DESC: 'priority_desc',
  TYPE: 'type'
}

export const NOTIFICATION_ICONS = {
  info: 'pi pi-info-circle',
  success: 'pi pi-check-circle',
  warning: 'pi pi-exclamation-triangle',
  error: 'pi pi-times-circle'
}

export const NOTIFICATION_COLORS = {
  info: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
}

export const CATEGORY_ICONS = {
  // Notifications
  system: 'pi pi-cog',
  user: 'pi pi-user',
  financial: 'pi pi-dollar',
//   security: 'pi pi-shield',
  
  // Events
  meeting: 'pi pi-users',
  deadline: 'pi pi-clock',
  maintenance: 'pi pi-wrench',
  reminder: 'pi pi-bell',
  
  // What's New
  feature: 'pi pi-star',
  improvement: 'pi pi-arrow-up',
  release: 'pi pi-gift',
  security: 'pi pi-lock'
}

export const PRIORITY_COLORS = {
  low: '#6b7280',
  medium: '#f59e0b',
  high: '#ef4444'
}

export const EMPTY_STATES = {
  notifications: {
    icon: 'pi pi-bell-slash',
    title: 'No notifications',
    message: "You're all caught up!"
  },
  events: {
    icon: 'pi pi-calendar-times',
    title: 'No upcoming events',
    message: 'Your calendar is clear for now.'
  },
  'whats-new': {
    icon: 'pi pi-star-fill',
    title: 'No recent updates',
    message: 'Check back later for new features and improvements.'
  }
}
