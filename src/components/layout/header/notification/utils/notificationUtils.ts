import type { 
  Notification, 
  EventNotification, 
  WhatsNewNotification, 
  AnyNotification,
  NotificationTab 
} from '../types/notification'
import { 
  NOTIFICATION_ICONS, 
  NOTIFICATION_COLORS, 
  CATEGORY_ICONS, 
  PRIORITY_COLORS,
  FILTER_OPTIONS 
} from '../constants/notificationConstants'

// Date formatting utilities
export const formatTimestamp = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return 'Just now'
  } else if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else if (days < 7) {
    return `${days}d ago`
  } else {
    return timestamp.toLocaleDateString()
  }
}

export const formatEventDate = (eventDate: Date): string => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())

  const timeString = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (eventDay.getTime() === today.getTime()) {
    return `Today at ${timeString}`
  } else if (eventDay.getTime() === tomorrow.getTime()) {
    return `Tomorrow at ${timeString}`
  } else {
    return `${eventDate.toLocaleDateString()} at ${timeString}`
  }
}

export const formatAbsoluteDate = (date: Date): string => {
  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Icon and color utilities
export const getNotificationIcon = (type: Notification['type']): string => {
  return NOTIFICATION_ICONS[type] || 'pi pi-info-circle'
}

export const getNotificationColor = (type: Notification['type']): string => {
  return NOTIFICATION_COLORS[type] || '#3b82f6'
}

export const getCategoryIcon = (category: string): string => {
  return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || 'pi pi-info-circle'
}

export const getPriorityColor = (priority?: string): string => {
  if (!priority) return '#6b7280'
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || '#6b7280'
}

// Notification type guards
export const isEventNotification = (notification: AnyNotification): notification is EventNotification => {
  return 'eventDate' in notification
}

export const isWhatsNewNotification = (notification: AnyNotification): notification is WhatsNewNotification => {
  return 'featureType' in notification && 'version' in notification
}

// Filter utilities
export const filterNotificationsByDate = (notifications: AnyNotification[], filter: string): AnyNotification[] => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  switch (filter) {
    case FILTER_OPTIONS.TODAY:
      return notifications.filter(n => {
        const notificationDate = new Date(n.timestamp.getFullYear(), n.timestamp.getMonth(), n.timestamp.getDate())
        return notificationDate.getTime() === today.getTime()
      })
    
    case FILTER_OPTIONS.THIS_WEEK:
      return notifications.filter(n => n.timestamp >= thisWeekStart)
    
    case FILTER_OPTIONS.THIS_MONTH:
      return notifications.filter(n => n.timestamp >= thisMonthStart)
    
    case FILTER_OPTIONS.UNREAD:
      return notifications.filter(n => !n.isRead)
    
    default:
      return notifications
  }
}

export const sortNotifications = (
  notifications: AnyNotification[], 
  sortBy: 'timestamp' | 'priority' | 'type' = 'timestamp',
  order: 'asc' | 'desc' = 'desc'
): AnyNotification[] => {
  return [...notifications].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'timestamp':
        aValue = a.timestamp.getTime()
        bValue = b.timestamp.getTime()
        break
      
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
        break
      
      case 'type':
        aValue = a.type
        bValue = b.type
        break
      
      default:
        aValue = a.timestamp.getTime()
        bValue = b.timestamp.getTime()
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}

// Search utilities
export const searchNotifications = (notifications: AnyNotification[], query: string): AnyNotification[] => {
  if (!query.trim()) return notifications

  const searchTerm = query.toLowerCase().trim()
  
  return notifications.filter(notification => {
    const searchableText = [
      notification.title,
      notification.message,
      notification.category,
      notification.type
    ].join(' ').toLowerCase()

    // For event notifications, also search location and attendees
    if (isEventNotification(notification)) {
      const eventText = [
        notification.location || '',
        notification.attendees?.join(' ') || '',
        notification.project || ''
      ].join(' ').toLowerCase()
      
      return searchableText.includes(searchTerm) || eventText.includes(searchTerm)
    }

    // For what's new notifications, also search version and feature type
    if (isWhatsNewNotification(notification)) {
      const whatsNewText = [
        notification.version,
        notification.featureType
      ].join(' ').toLowerCase()
      
      return searchableText.includes(searchTerm) || whatsNewText.includes(searchTerm)
    }

    return searchableText.includes(searchTerm)
  })
}

// Count utilities
export const getUnreadCount = (notifications: AnyNotification[]): number => {
  return notifications.filter(n => !n.isRead).length
}

export const getCountsByTab = (
  notifications: AnyNotification[],
  events: AnyNotification[],
  whatsNew: AnyNotification[]
): Record<NotificationTab, number> => {
  return {
    notifications: notifications.length,
    events: events.length,
    'whats-new': whatsNew.length
  }
}

export const getUnreadCountsByTab = (
  notifications: AnyNotification[],
  events: AnyNotification[],
  whatsNew: AnyNotification[]
): Record<NotificationTab, number> => {
  return {
    notifications: getUnreadCount(notifications),
    events: getUnreadCount(events),
    'whats-new': getUnreadCount(whatsNew)
  }
}

// Validation utilities
export const isValidNotification = (notification: any): notification is Notification => {
  return (
    typeof notification === 'object' &&
    typeof notification.id === 'string' &&
    typeof notification.title === 'string' &&
    typeof notification.message === 'string' &&
    ['info', 'success', 'warning', 'error'].includes(notification.type) &&
    notification.timestamp instanceof Date &&
    typeof notification.isRead === 'boolean' &&
    typeof notification.category === 'string'
  )
}

// Grouping utilities
export const groupNotificationsByDate = (notifications: AnyNotification[]): Record<string, AnyNotification[]> => {
  const groups: Record<string, AnyNotification[]> = {}
  
  notifications.forEach(notification => {
    const date = notification.timestamp.toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(notification)
  })
  
  return groups
}

export const groupNotificationsByCategory = (notifications: AnyNotification[]): Record<string, AnyNotification[]> => {
  const groups: Record<string, AnyNotification[]> = {}
  
  notifications.forEach(notification => {
    const category = notification.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(notification)
  })
  
  return groups
}

// Truncation utilities
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// URL utilities
export const isValidUrl = (url?: string): boolean => {
  if (!url) return false
  try {
    new URL(url, window.location.origin)
    return true
  } catch {
    return false
  }
}

// Animation utilities
export const getStaggerDelay = (index: number, baseDelay: number = 50): number => {
  return index * baseDelay
}

// Local storage utilities
export const saveNotificationPreferences = (preferences: Record<string, any>): void => {
  try {
    localStorage.setItem('notification-preferences', JSON.stringify(preferences))
  } catch (error) {
    console.warn('Failed to save notification preferences:', error)
  }
}

export const loadNotificationPreferences = (): Record<string, any> => {
  try {
    const saved = localStorage.getItem('notification-preferences')
    return saved ? JSON.parse(saved) : {}
  } catch (error) {
    console.warn('Failed to load notification preferences:', error)
    return {}
  }
}
