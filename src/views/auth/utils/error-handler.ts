import type { ApiError } from '@/services/types'
import type { AuthErrorState } from '../types/auth-types'
import { AUTH_ERROR_MESSAGES } from '../types/api-types'
import { AUTH_ERROR_CODES } from '../constants/auth-constants'

// Transform API error to Auth error state
export const transformApiError = (error: ApiError): AuthErrorState => {
  const status = error.status || 500
  const message = error.message || 'An unexpected error occurred'
  
  // Get user-friendly message
  const userFriendlyMessage = AUTH_ERROR_MESSAGES[message] || message
  
  // Determine auth error code based on message
  let authCode: AuthErrorState['authCode']
  
  switch (message.toLowerCase()) {
    case 'wrong password':
      authCode = 'INVALID_CREDENTIALS'
      break
    case 'invalid email':
      authCode = 'INVALID_CREDENTIALS'
      break
    case 'email not verified':
      authCode = 'EMAIL_NOT_VERIFIED'
      break
    case 'account locked':
      authCode = 'ACCOUNT_LOCKED'
      break
    default:
      authCode = 'INVALID_CREDENTIALS'
  }

  return {
    type: status >= 500 ? 'server' : 'client',
    status,
    message: userFriendlyMessage,
    authCode
  }
}

// Get appropriate error title based on status code
const getErrorTitle = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid Request'
    case 401:
      return 'Authentication Failed'
    case 403:
      return 'Access Denied'
    case 404:
      return 'Not Found'
    case 422:
      return 'Validation Error'
    case 429:
      return 'Too Many Requests'
    case 500:
      return 'Server Error'
    case 502:
      return 'Bad Gateway'
    case 503:
      return 'Service Unavailable'
    default:
      return 'Error'
  }
}

// Log error for debugging (only in development)
export const logError = (error: ApiError, context?: string): void => {
  if (import.meta.env.DEV) {
    console.group(`🚨 Auth Error${context ? ` - ${context}` : ''}`)
    console.error('Error Details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details
    })
    console.groupEnd()
  }
}

// Handle specific auth errors with custom logic
export const handleAuthError = (error: AuthErrorState, context?: string): void => {
  // Log the error
  logError(error as ApiError, context)
  
  // Handle specific error codes
  switch (error.authCode) {
    case 'ACCOUNT_LOCKED':
      // Could trigger a specific UI state or notification
      console.warn('Account is locked. User should contact support.')
      break
      
    case 'EMAIL_NOT_VERIFIED':
      // Could redirect to email verification page
      console.warn('Email not verified. User should verify email.')
      break
      
    case 'INVALID_CREDENTIALS':
      // Could increment failed login attempts
      console.warn('Invalid credentials provided.')
      break
      
    default:
      console.warn('Unhandled auth error:', error.authCode)
  }
}

// Validate error response format
export const isValidApiError = (error: any): error is ApiError => {
  return (
    error &&
    typeof error === 'object' &&
    typeof error.message === 'string'
  )
}

// Create standardized error messages for different scenarios
export const createAuthError = (
  type: 'network' | 'validation' | 'server' | 'client',
  message?: string,
  details?: any
): AuthErrorState => {
  const baseError: AuthErrorState = {
    type: type === 'network' ? 'client' : type,
    status: type === 'network' ? 0 : type === 'validation' ? 422 : 500,
    message: message || getDefaultErrorMessage(type)
  }

  return baseError
}

// Get default error messages for different types
const getDefaultErrorMessage = (type: string): string => {
  switch (type) {
    case 'network':
      return 'Unable to connect to the server. Please check your internet connection and try again.'
    case 'validation':
      return 'Please check your input and try again.'
    case 'server':
      return 'A server error occurred. Please try again later.'
    case 'client':
      return 'An error occurred while processing your request.'
    default:
      return 'An unexpected error occurred.'
  }
}

// Extract error message from various error formats
export const extractErrorMessage = (error: any): string => {
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
  
  return 'An unexpected error occurred'
}

// Check if error is a network error
export const isNetworkError = (error: any): boolean => {
  return (
    error?.code === 'NETWORK_ERROR' ||
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ERR_NETWORK' ||
    !error?.response
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
export const shouldRetry = (error: ApiError, attemptCount: number, maxRetries: number = 3): boolean => {
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
