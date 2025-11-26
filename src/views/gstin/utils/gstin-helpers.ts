// GSTIN Helper Utilities

import type { GstinAccount } from '../types/gstin-accounts-types'

/**
 * Extract state code from GSTIN
 * GSTIN format: 36AAACH7409R1Z2 (first 2 digits are state code)
 */
export const extractStateCodeFromGSTIN = (gstin: string): string => {
  if (!gstin || gstin.length < 2) {
    return ''
  }
  return gstin.substring(0, 2)
}

/**
 * Format GSTIN account address or details
 */
export const formatGstinAccountDetails = (account: GstinAccount): string => {
  const details = [
    account.companyName,
    account.gstin,
    `State: ${account.stateCode}`
  ].filter(part => part && part.trim() !== '')

  return details.join(' | ')
}

/**
 * Get account status color based on expiry
 */
export const getAccountStatusColor = (expiryTime: string): string => {
  const expiry = new Date(expiryTime)
  const now = new Date()
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) {
    return '#ef4444' // red - expired
  } else if (diffDays <= 7) {
    return '#f59e0b' // amber - expiring soon
  } else {
    return '#10b981' // green - active
  }
}

/**
 * Format date from API response
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

/**
 * Format date and time from API response
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

/**
 * Generate display name for GSTIN account
 */
export const getGstinDisplayName = (account: GstinAccount): string => {
  return account.companyName || `GSTIN ${account.gstin}` || 'Unknown Account'
}

/**
 * Check if account is about to expire (within 30 days)
 */
export const isAccountExpiringsoon = (expiryTime: string): boolean => {
  const expiry = new Date(expiryTime)
  const now = new Date()
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  return diffDays > 0 && diffDays <= 30
}

/**
 * Check if account is expired
 */
export const isAccountExpired = (expiryTime: string): boolean => {
  const expiry = new Date(expiryTime)
  const now = new Date()
  
  return expiry.getTime() < now.getTime()
}

/**
 * Get sync status text
 */
export const getSyncStatusText = (lastSync: string | null): string => {
  if (!lastSync) {
    return 'Never synced'
  }
  
  try {
    const syncDate = new Date(lastSync)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - syncDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Synced today'
    } else if (diffDays === 1) {
      return 'Synced yesterday'
    } else {
      return `Synced ${diffDays} days ago`
    }
  } catch (error) {
    return lastSync
  }
}

/**
 * Validate and clean GSTIN input
 */
export const cleanGSTIN = (gstin: string): string => {
  return gstin.trim().toUpperCase()
}

/**
 * Generate unique ID for form elements
 */
export const generateFormId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Debounce function for input validation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Check if error is network related
 */
export const isNetworkError = (error: any): boolean => {
  return (
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('network') ||
    error?.message?.includes('fetch') ||
    !navigator.onLine
  )
}

/**
 * Format OTP for display (with spaces)
 */
export const formatOTPDisplay = (otp: string): string => {
  return otp.split('').join(' ')
}

/**
 * Get remaining time in MM:SS format
 */
export const formatRemainingTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Calculate expiry days remaining
 */
export const getExpiryDaysRemaining = (expiryTime: string): number => {
  const expiry = new Date(expiryTime)
  const now = new Date()
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Get expiry status text
 */
export const getExpiryStatusText = (expiryTime: string): string => {
  const daysRemaining = getExpiryDaysRemaining(expiryTime)
  
  if (daysRemaining <= 0) {
    return 'Expired'
  } else if (daysRemaining <= 7) {
    return `Expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
  } else if (daysRemaining <= 30) {
    return `Expires in ${daysRemaining} days`
  } else {
    return 'Active'
  }
}