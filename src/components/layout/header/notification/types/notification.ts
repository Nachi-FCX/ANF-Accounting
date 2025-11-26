// Base notification categories
export type NotificationCategory = 'system' | 'user' | 'financial' | 'security'
export type EventCategory = 'meeting' | 'deadline' | 'maintenance' | 'reminder'
export type WhatsNewCategory = 'feature' | 'improvement' | 'release' | 'security'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  isRead: boolean
  category: NotificationCategory
  actionUrl?: string
  metadata?: Record<string, any>
  priority?: 'low' | 'medium' | 'high'
}

// Tab-specific notification types
export interface EventNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  isRead: boolean
  category: EventCategory
  actionUrl?: string
  metadata?: Record<string, any>
  priority?: 'low' | 'medium' | 'high'
  eventDate: Date
  location?: string
  attendees?: string[]
  duration?: string
  project?: string
}

export interface WhatsNewNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  isRead: boolean
  category: WhatsNewCategory
  actionUrl?: string
  metadata?: Record<string, any>
  priority?: 'low' | 'medium' | 'high'
  featureType: 'new' | 'update' | 'improvement'
  version: string
}

// Union type for all notification types
export type AnyNotification = Notification | EventNotification | WhatsNewNotification

// Tab types
export type NotificationTab = 'notifications' | 'events' | 'whats-new'

export interface TabConfig {
  id: NotificationTab
  label: string
  icon: string
  badgeColor: string
  emptyMessage: string
  emptyIcon: string
}

export interface TabState {
  activeTab: NotificationTab
  counts: Record<NotificationTab, number>
  unreadCounts: Record<NotificationTab, number>
}

export interface NotificationFilter {
  type?: Notification['type']
  category?: Notification['category']
  isRead?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  lastFetch: Date | null
}

export interface CreateNotificationDto {
  title: string
  message: string
  type: Notification['type']
  category: Notification['category']
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface UpdateNotificationDto {
  id: string
  isRead?: boolean
  metadata?: Record<string, any>
}

export type NotificationSortBy = 'timestamp' | 'type' | 'category'
export type SortOrder = 'asc' | 'desc'

export interface NotificationQuery {
  filter?: NotificationFilter
  sortBy?: NotificationSortBy
  sortOrder?: SortOrder
  limit?: number
  offset?: number
}
