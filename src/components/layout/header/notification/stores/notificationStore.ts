import { defineStore } from 'pinia'
import type { 
  Notification, 
  NotificationState, 
  NotificationQuery,
  CreateNotificationDto,
  UpdateNotificationDto
} from '../types/notification'
import { notificationService } from '../services/notificationService'

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    lastFetch: null
  }),

  getters: {
    // Get unread notifications
    unreadNotifications: (state): Notification[] => {
      return state.notifications.filter(n => !n.isRead)
    },

    // Get notifications by type
    getNotificationsByType: (state) => (type: Notification['type']): Notification[] => {
      return state.notifications.filter(n => n.type === type)
    },

    // Get notifications by category
    getNotificationsByCategory: (state) => (category: Notification['category']): Notification[] => {
      return state.notifications.filter(n => n.category === category)
    },

    // Get recent notifications (last 24 hours)
    recentNotifications: (state): Notification[] => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return state.notifications.filter(n => n.timestamp > oneDayAgo)
    },

    // Check if there are any unread notifications
    hasUnreadNotifications: (state): boolean => {
      return state.unreadCount > 0
    },

    // Get notification by ID
    getNotificationById: (state) => (id: string): Notification | undefined => {
      return state.notifications.find(n => n.id === id)
    }
  },

  actions: {
    // Fetch all notifications
    async fetchNotifications(query?: NotificationQuery) {
      this.isLoading = true
      this.error = null

      try {
        const notifications = await notificationService.fetchNotifications(query)
        this.notifications = notifications
        this.unreadCount = notifications.filter(n => !n.isRead).length
        this.lastFetch = new Date()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch notifications'
        console.error('Error fetching notifications:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Refresh notifications (force fetch)
    async refreshNotifications() {
      await this.fetchNotifications()
    },

    // Mark notification as read
    async markAsRead(id: string) {
      try {
        const updatedNotification = await notificationService.markAsRead(id)
        const index = this.notifications.findIndex(n => n.id === id)
        
        if (index !== -1) {
          this.notifications[index] = updatedNotification
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to mark notification as read'
        console.error('Error marking notification as read:', error)
      }
    },

    // Mark notification as unread
    async markAsUnread(id: string) {
      try {
        const updatedNotification = await notificationService.markAsUnread(id)
        const index = this.notifications.findIndex(n => n.id === id)
        
        if (index !== -1) {
          this.notifications[index] = updatedNotification
          this.unreadCount += 1
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to mark notification as unread'
        console.error('Error marking notification as unread:', error)
      }
    },

    // Mark all notifications as read
    async markAllAsRead() {
      try {
        await notificationService.markAllAsRead()
        this.notifications.forEach(notification => {
          notification.isRead = true
        })
        this.unreadCount = 0
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to mark all notifications as read'
        console.error('Error marking all notifications as read:', error)
      }
    },

    // Delete notification
    async deleteNotification(id: string) {
      try {
        await notificationService.deleteNotification(id)
        const index = this.notifications.findIndex(n => n.id === id)
        
        if (index !== -1) {
          const notification = this.notifications[index]
          if (!notification.isRead) {
            this.unreadCount = Math.max(0, this.unreadCount - 1)
          }
          this.notifications.splice(index, 1)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete notification'
        console.error('Error deleting notification:', error)
      }
    },

    // Create new notification
    async createNotification(dto: CreateNotificationDto) {
      try {
        const newNotification = await notificationService.createNotification(dto)
        this.notifications.unshift(newNotification)
        this.unreadCount += 1
        return newNotification
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create notification'
        console.error('Error creating notification:', error)
        throw error
      }
    },

    // Update notification
    async updateNotification(dto: UpdateNotificationDto) {
      try {
        const updatedNotification = await notificationService.updateNotification(dto)
        const index = this.notifications.findIndex(n => n.id === dto.id)
        
        if (index !== -1) {
          const oldNotification = this.notifications[index]
          this.notifications[index] = updatedNotification
          
          // Update unread count if read status changed
          if (oldNotification.isRead !== updatedNotification.isRead) {
            if (updatedNotification.isRead) {
              this.unreadCount = Math.max(0, this.unreadCount - 1)
            } else {
              this.unreadCount += 1
            }
          }
        }
        
        return updatedNotification
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update notification'
        console.error('Error updating notification:', error)
        throw error
      }
    },

    // Add notification (for real-time updates)
    addNotification(notification: Notification) {
      this.notifications.unshift(notification)
      if (!notification.isRead) {
        this.unreadCount += 1
      }
    },

    // Clear all notifications
    clearAllNotifications() {
      this.notifications = []
      this.unreadCount = 0
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Simulate real-time notification
    simulateRealTimeNotification() {
      notificationService.simulateRealTimeNotification()
      // Refresh to get the new notification
      this.refreshNotifications()
    },

    // Initialize store (call this when app starts)
    async initialize() {
      await this.fetchNotifications()
      
      // Set up periodic refresh (every 5 minutes)
      setInterval(() => {
        this.refreshNotifications()
      }, 5 * 60 * 1000)

      // Simulate real-time notifications every 30 seconds (for demo)
      setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance
          this.simulateRealTimeNotification()
        }
      }, 30 * 1000)
    }
  }
})
