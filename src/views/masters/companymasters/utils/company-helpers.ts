// Company Helper Utilities

import type { CompanyData } from '../types/company-types'

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
 * Format company address from API response
 */
export const formatCompanyAddress = (companyData: CompanyData): string => {
  if (!companyData.pradr?.addr) {
    return 'Address not available'
  }

  const addr = companyData.pradr.addr
  const addressParts = [
    addr.bno,
    addr.bnm,
    addr.st,
    addr.loc,
    addr.dst,
    addr.stcd,
    addr.pncd
  ].filter(part => part && part.trim() !== '')

  return addressParts.join(', ')
}

/**
 * Get company status color based on status
 */
export const getCompanyStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'active':
      return '#10b981' // green
    case 'suspended':
      return '#f59e0b' // amber
    case 'cancelled':
      return '#ef4444' // red
    case 'inactive':
      return '#6b7280' // gray
    default:
      return '#6b7280' // gray
  }
}

/**
 * Format date from API response
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  
  try {
    // Handle DD/MM/YYYY format from API
    const [day, month, year] = dateString.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    
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
 * Generate display name for company
 */
export const getCompanyDisplayName = (companyData: CompanyData): string => {
  return companyData.tradeNam || companyData.lgnm || 'Unknown Company'
}

/**
 * Check if company has e-invoice capability
 */
export const hasEInvoiceCapability = (companyData: CompanyData): boolean => {
  return companyData.einvoiceStatus?.toLowerCase() === 'yes'
}

/**
 * Get business nature display text
 */
export const getBusinessNatureText = (companyData: CompanyData): string => {
  if (!companyData.nba || companyData.nba.length === 0) {
    return 'Not specified'
  }
  return companyData.nba.join(', ')
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
 * Note: This function is now available in error-handler.ts for consistency
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
