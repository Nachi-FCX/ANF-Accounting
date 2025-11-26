import type { ApiError } from '@/services/types'
import { ERROR_MESSAGES } from '../constants/company-constants'

// Company-specific error state interface
export interface CompanyErrorState {
  type: 'client' | 'server' | 'network'
  status?: number
  message: string
  companyCode?: 'GSTIN_INVALID' | 'COMPANY_NOT_FOUND' | 'OTP_INVALID' | 'OTP_EXPIRED' | 'API_ERROR'
}

// Transform API error to Company error state
export const transformCompanyApiError = (error: ApiError): CompanyErrorState => {
  const status = error.status || 500
  const message = error.message || 'An unexpected error occurred'
  
  // Get user-friendly message
  const userFriendlyMessage = getCompanyErrorMessage(message)
  
  // Determine company error code based on message and status
  let companyCode: CompanyErrorState['companyCode']
  
  switch (message.toLowerCase()) {
    case 'company not found':
    case 'gstin not found':
      companyCode = 'COMPANY_NOT_FOUND'
      break
    case 'invalid gstin':
    case 'gstin format invalid':
      companyCode = 'GSTIN_INVALID'
      break
    case 'invalid otp':
    case 'otp mismatch':
      companyCode = 'OTP_INVALID'
      break
    case 'otp expired':
    case 'otp timeout':
      companyCode = 'OTP_EXPIRED'
      break
    default:
      companyCode = 'API_ERROR'
  }

  return {
    type: status >= 500 ? 'server' : isNetworkError(error) ? 'network' : 'client',
    status,
    message: userFriendlyMessage,
    companyCode
  }
}

// Get user-friendly error messages
const getCompanyErrorMessage = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('gstin') && lowerMessage.includes('invalid')) {
    return ERROR_MESSAGES.INVALID_GSTIN
  }
  
  if (lowerMessage.includes('company not found') || lowerMessage.includes('gstin not found')) {
    return ERROR_MESSAGES.COMPANY_NOT_FOUND
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
export const logCompanyError = (error: ApiError, context?: string): void => {
  if (import.meta.env.DEV) {
    console.group(`🚨 Company Service Error${context ? ` - ${context}` : ''}`)
    console.error('Error Details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details
    })
    console.groupEnd()
  }
}

// Handle specific company errors with custom logic
export const handleCompanyError = (error: CompanyErrorState, context?: string): void => {
  // Log the error
  logCompanyError(error as ApiError, context)
  
  // Handle specific error codes
  switch (error.companyCode) {
    case 'GSTIN_INVALID':
      console.warn('Invalid GSTIN format provided.')
      break
      
    case 'COMPANY_NOT_FOUND':
      console.warn('Company not found for the provided GSTIN.')
      break
      
    case 'OTP_INVALID':
      console.warn('Invalid OTP provided.')
      break
      
    case 'OTP_EXPIRED':
      console.warn('OTP has expired.')
      break
      
    default:
      console.warn('Unhandled company error:', error.companyCode)
  }
}

// Create standardized error messages for different scenarios
export const createCompanyError = (
  type: 'network' | 'validation' | 'server' | 'client',
  message?: string,
  companyCode?: CompanyErrorState['companyCode']
): CompanyErrorState => {
  const baseError: CompanyErrorState = {
    type: type === 'network' ? 'network' : type === 'validation' ? 'client' : type as 'client' | 'server',
    status: type === 'network' ? 0 : type === 'validation' ? 422 : 500,
    message: message || getDefaultCompanyErrorMessage(type),
    companyCode
  }

  return baseError
}

// Get default error messages for different types
const getDefaultCompanyErrorMessage = (type: string): string => {
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
export const extractCompanyErrorMessage = (error: any): string => {
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
export const shouldRetryCompanyRequest = (error: ApiError, attemptCount: number, maxRetries: number = 3): boolean => {
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
export const isValidCompanyApiError = (error: any): error is ApiError => {
  return (
    error &&
    typeof error === 'object' &&
    typeof error.message === 'string'
  )
}
