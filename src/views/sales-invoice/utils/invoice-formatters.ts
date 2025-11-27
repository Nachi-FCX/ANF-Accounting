/**
 * Invoice Formatting Utilities
 * Display formatting for dates, currency, and status
 */

import type { InvoiceStatus } from '../types/sales-invoice-types'
import { CURRENCY_CONFIG, getStatusOption } from '../constants/sales-invoice-constants'

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.code,
    minimumFractionDigits: CURRENCY_CONFIG.decimalPlaces,
    maximumFractionDigits: CURRENCY_CONFIG.decimalPlaces
  }).format(amount)
}

/**
 * Format number with Indian locale
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Format date to DD/MM/YYYY
 */
export function formatDate(date: string | Date): string {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  
  return `${day}/${month}/${year}`
}

/**
 * Format date to YYYY-MM-DD (for inputs)
 */
export function formatDateForInput(date: string | Date): string {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const year = dateObj.getFullYear()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const day = dateObj.getDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const dateStr = formatDate(dateObj)
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  
  return `${dateStr} ${hours}:${minutes}`
}

/**
 * Format relative date (e.g., "2 days ago", "in 5 days")
 */
export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = dateObj.getTime() - now.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Tomorrow'
  if (diffInDays === -1) return 'Yesterday'
  if (diffInDays > 1) return `in ${diffInDays} days`
  if (diffInDays < -1) return `${Math.abs(diffInDays)} days ago`
  
  return formatDate(dateObj)
}

/**
 * Format invoice status for display
 */
export function formatStatus(status: InvoiceStatus): string {
  const option = getStatusOption(status)
  return option?.label || status
}

/**
 * Get status badge severity
 */
export function getStatusSeverity(status: InvoiceStatus): string {
  const option = getStatusOption(status)
  return option?.severity || 'secondary'
}

/**
 * Get status icon
 */
export function getStatusIcon(status: InvoiceStatus): string {
  const option = getStatusOption(status)
  return option?.icon || 'pi pi-file'
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format phone number (Indian format)
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone || phone.length !== 10) return phone
  
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
}

/**
 * Format GSTIN for display
 */
export function formatGstin(gstin: string): string {
  if (!gstin || gstin.length !== 15) return gstin
  
  // Format: 12ABCDE1234F1Z5
  // Display as: 12-ABCDE-1234-F-1-Z-5
  return `${gstin.slice(0, 2)}-${gstin.slice(2, 7)}-${gstin.slice(7, 11)}-${gstin.slice(11, 12)}-${gstin.slice(12, 13)}-${gstin.slice(13, 14)}-${gstin.slice(14)}`
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  
  return `${text.slice(0, maxLength)}...`
}

/**
 * Capitalize first letter
 */
export function capitalizeFirst(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Parse date from DD/MM/YYYY format
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  
  return new Date(year, month, day)
}

/**
 * Format days remaining until due date
 */
export function formatDaysRemaining(dueDate: string | Date): string {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  
  const diffInMs = due.getTime() - today.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) {
    return `Overdue by ${Math.abs(diffInDays)} days`
  } else if (diffInDays === 0) {
    return 'Due today'
  } else if (diffInDays === 1) {
    return 'Due tomorrow'
  } else {
    return `Due in ${diffInDays} days`
  }
}

/**
 * Format tax rate for display
 */
export function formatTaxRate(rate: number): string {
  return `${rate}%`
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  if (!name) return ''
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Format address for display
 */
export function formatAddress(address?: string): string {
  if (!address) return 'N/A'
  return address.replace(/\n/g, ', ')
}

/**
 * Format compact number (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(value: number): string {
  if (value < 1000) return value.toString()
  if (value < 1000000) return `${(value / 1000).toFixed(1)}K`
  return `${(value / 1000000).toFixed(1)}M`
}
