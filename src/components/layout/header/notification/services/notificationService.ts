import type { 
  Notification, 
  CreateNotificationDto, 
  UpdateNotificationDto, 
  NotificationQuery 
} from '../types/notification'

class NotificationService {
  private baseUrl = '/api/notifications' // This would be your actual API endpoint
  private mockData: Notification[] = [
    {
      id: '1',
      title: 'System Update',
      message: 'System maintenance scheduled for tonight at 2:00 AM',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      category: 'system',
      actionUrl: '/system/maintenance'
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'Payment of $1,250.00 has been successfully processed',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: false,
      category: 'financial',
      actionUrl: '/payments/2'
    },
    {
      id: '3',
      title: 'Security Alert',
      message: 'New login detected from Chrome on Windows',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      isRead: true,
      category: 'security',
      actionUrl: '/security/sessions'
    },
    {
      id: '4',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      category: 'user',
      actionUrl: '/profile'
    },
    {
      id: '5',
      title: 'Invoice Overdue',
      message: 'Invoice #INV-2024-001 is now 5 days overdue',
      type: 'error',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isRead: false,
      category: 'financial',
      actionUrl: '/invoices/INV-2024-001'
    },
    {
      id: '6',
      title: 'New Feature Available',
      message: 'Check out our new dashboard analytics feature',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      isRead: true,
      category: 'system',
      actionUrl: '/features/analytics'
    }
  ]

  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Fetch all notifications
  async fetchNotifications(query?: NotificationQuery): Promise<Notification[]> {
    await this.delay(500) // Simulate network delay

    let notifications = [...this.mockData]

    // Apply filters
    if (query?.filter) {
      const { type, category, isRead, dateRange } = query.filter

      notifications = notifications.filter(notification => {
        if (type && notification.type !== type) return false
        if (category && notification.category !== category) return false
        if (isRead !== undefined && notification.isRead !== isRead) return false
        if (dateRange) {
          const timestamp = notification.timestamp.getTime()
          const start = dateRange.start.getTime()
          const end = dateRange.end.getTime()
          if (timestamp < start || timestamp > end) return false
        }
        return true
      })
    }

    // Apply sorting
    if (query?.sortBy) {
      const { sortBy, sortOrder = 'desc' } = query
      notifications.sort((a, b) => {
        let aValue: any = a[sortBy]
        let bValue: any = b[sortBy]

        if (sortBy === 'timestamp') {
          aValue = aValue.getTime()
          bValue = bValue.getTime()
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    } else {
      // Default sort by timestamp desc
      notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }

    // Apply pagination
    if (query?.limit || query?.offset) {
      const offset = query.offset || 0
      const limit = query.limit || notifications.length
      notifications = notifications.slice(offset, offset + limit)
    }

    return notifications
  }

  // Get notification by ID
  async getNotification(id: string): Promise<Notification | null> {
    await this.delay(200)
    return this.mockData.find(n => n.id === id) || null
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<Notification> {
    await this.delay(300)
    
    const notification = this.mockData.find(n => n.id === id)
    if (!notification) {
      throw new Error('Notification not found')
    }

    notification.isRead = true
    return notification
  }

  // Mark notification as unread
  async markAsUnread(id: string): Promise<Notification> {
    await this.delay(300)
    
    const notification = this.mockData.find(n => n.id === id)
    if (!notification) {
      throw new Error('Notification not found')
    }

    notification.isRead = false
    return notification
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await this.delay(500)
    this.mockData.forEach(notification => {
      notification.isRead = true
    })
  }

  // Delete notification
  async deleteNotification(id: string): Promise<void> {
    await this.delay(300)
    
    const index = this.mockData.findIndex(n => n.id === id)
    if (index === -1) {
      throw new Error('Notification not found')
    }

    this.mockData.splice(index, 1)
  }

  // Create new notification
  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    await this.delay(400)
    
    const notification: Notification = {
      id: Date.now().toString(),
      ...dto,
      timestamp: new Date(),
      isRead: false
    }

    this.mockData.unshift(notification)
    return notification
  }

  // Update notification
  async updateNotification(dto: UpdateNotificationDto): Promise<Notification> {
    await this.delay(300)
    
    const notification = this.mockData.find(n => n.id === dto.id)
    if (!notification) {
      throw new Error('Notification not found')
    }

    if (dto.isRead !== undefined) {
      notification.isRead = dto.isRead
    }
    if (dto.metadata) {
      notification.metadata = { ...notification.metadata, ...dto.metadata }
    }

    return notification
  }

  // Get unread count
  async getUnreadCount(): Promise<number> {
    await this.delay(100)
    return this.mockData.filter(n => !n.isRead).length
  }

  // Simulate real-time notifications
  simulateRealTimeNotification(): void {
    const types: Notification['type'][] = ['info', 'success', 'warning', 'error']
    const categories: Notification['category'][] = ['system', 'user', 'financial', 'security']
    
    const randomType = types[Math.floor(Math.random() * types.length)]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    
    const notification: Notification = {
      id: Date.now().toString(),
      title: `New ${randomCategory} notification`,
      message: `This is a simulated real-time ${randomType} notification`,
      type: randomType,
      category: randomCategory,
      timestamp: new Date(),
      isRead: false
    }

    this.mockData.unshift(notification)
  }
}

export const notificationService = new NotificationService()
export default notificationService
