import type { ApiError } from '@/services/types'
import { ERROR_MESSAGES } from '../constants/gstin-constants'

// GSTIN-specific error state interface
export interface GstinErrorState {
  type: 'client' | 'server' | 'network'
  status?: number
  message: string
  gstinCode?: 'GSTIN_INVALID' | 'ACCOUNT_NOT_FOUND' | 'OTP_INVALID' | 'OTP_EXPIRED' | 'API_ERROR'
}

// Transform API error to GSTIN error state
export const transformGstinApiError = (error: ApiError): GstinErrorState => {
  const status = error.status || 500
  const message = error.message || 'An unexpected error occurred'
  
  // Get user-friendly message
  const userFriendlyMessage = getGstinErrorMessage(message)
  
  // Determine GSTIN error code based on message and status
  let gstinCode: GstinErrorState['gstinCode']
  
  switch (message.toLowerCase()) {
    case 'account not found':
    case 'gstin not found':
      gstinCode = 'ACCOUNT_NOT_FOUND'
      break
    case 'invalid gstin':
    case 'gstin format invalid':
      gstinCode = 'GSTIN_INVALID'
      break
    case 'invalid otp':
    case 'otp mismatch':
      gstinCode = 'OTP_INVALID'
      break
    case 'otp expired':
    case 'otp timeout':
      gstinCode = 'OTP_EXPIRED'
      break
    default:
      gstinCode = 'API_ERROR'
  }

  return {
    type: status >= 500 ? 'server' : isNetworkError(error) ? 'network' : 'client',
    status,
    message: userFriendlyMessage,
    gstinCode
  }
}

// Get user-friendly error messages
const getGstinErrorMessage = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('gstin') && lowerMessage.includes('invalid')) {
    return ERROR_MESSAGES.INVALID_GSTIN
  }
  
  if (lowerMessage.includes('account not found') || lowerMessage.includes('gstin not found')) {
    return ERROR_MESSAGES.ACCOUNT_NOT_FOUND
  }
  
  if (lowerMessage.includes('otp') && lowerMessage.includes('invalid')) {
    return ERROR_MESSAGES.OTP_INVALID
  }
  
  if (lowerMessage.includes('otp') && (lowerMessage.includes('expired') || lowerMessage.includes('timeout'))) {
    return ERROR_MESSAGES.OTP_EXPIRED
  }
  
  if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }
  
  return message || ERROR_MESSAGES.API_ERROR
}

// Log error for debugging (only in development)
export const logGstinError = (error: ApiError, context?: string): void => {
  if (import.meta.env.DEV) {
    console.group(`🚨 GSTIN Service Error${context ? ` - ${context}` : ''}`)
    console.error('Error Details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details
    })
    console.groupEnd()
  }
}

// Handle specific GSTIN errors with custom logic
export const handleGstinError = (error: GstinErrorState, context?: string): void => {
  // Log the error
  logGstinError(error as ApiError, context)
  
  // Handle specific error codes
  switch (error.gstinCode) {
    case 'GSTIN_INVALID':
      console.warn('Invalid GSTIN format provided.')
      break
      
    case 'ACCOUNT_NOT_FOUND':
      console.warn('GSTIN account not found for the provided details.')
      break
      
    case 'OTP_INVALID':
      console.warn('Invalid OTP provided.')
      break
      
    case 'OTP_EXPIRED':
      console.warn('OTP has expired.')
      break
      
    default:
      console.warn('Unhandled GSTIN error:', error.gstinCode)
  }
}

// Create standardized error messages for different scenarios
export const createGstinError = (
  type: 'network' | 'validation' | 'server' | 'client',
  message?: string,
  gstinCode?: GstinErrorState['gstinCode']
): GstinErrorState => {
  const baseError: GstinErrorState = {
    type: type === 'network' ? 'network' : type === 'validation' ? 'client' : type as 'client' | 'server',
    status: type === 'network' ? 0 : type === 'validation' ? 422 : 500,
    message: message || getDefaultGstinErrorMessage(type),
    gstinCode
  }

  return baseError
}

// Get default error messages for different types
const getDefaultGstinErrorMessage = (type: string): string => {
  switch (type) {
    case 'network':
      return ERROR_MESSAGES.NETWORK_ERROR
    case 'validation':
      return 'Please check your input and try again.'
    case 'server':
      return 'A server error occurred. Please try again later.'
    case 'client':
      return ERROR_MESSAGES.API_ERROR
    default:
      return 'An unexpected error occurred.'
  }
}

// Extract error message from various error formats
export const extractGstinErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error?.message) {
    return error.message
  }
  
  return ERROR_MESSAGES.API_ERROR
}

// Check if error is a network error
export const isNetworkError = (error: any): boolean => {
  return (
    error?.code === 'NETWORK_ERROR' ||
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ERR_NETWORK' ||
    !error?.response ||
    error?.message?.includes('network') ||
    error?.message?.includes('fetch')
  )
}

// Check if error is a timeout error
export const isTimeoutError = (error: any): boolean => {
  return (
    error?.code === 'ECONNABORTED' ||
    error?.message?.includes('timeout')
  )
}

// Retry logic for failed requests
export const shouldRetryGstinRequest = (error: ApiError, attemptCount: number, maxRetries: number = 3): boolean => {
  if (attemptCount >= maxRetries) {
    return false
  }
  
  // Retry on network errors or 5xx server errors
  return (
    isNetworkError(error) ||
    isTimeoutError(error) ||
    (error.status !== undefined && error.status >= 500)
  )
}

// Validate error response format
export const isValidGstinApiError = (error: any): error is ApiError => {
  return (
    error &&
    typeof error === 'object' &&
    typeof error.message === 'string'
  )
}