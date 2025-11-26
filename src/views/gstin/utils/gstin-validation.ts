// GSTIN Validation Utilities

import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants/gstin-constants'
import type { GstinInputData } from '../types/gstin-accounts-types'

export interface ValidationResult {
  isValid: boolean
  message: string
}

/**
 * Validates GSTIN format and checksum
 */
export function validateGSTIN(gstin: string): ValidationResult {
  if (!gstin || typeof gstin !== 'string' || gstin.trim() === '') {
    return {
      isValid: false,
      message: 'This field is required'
    }
  }

  const cleanGstin = gstin.trim().toUpperCase()

  // Check length
  if (cleanGstin.length !== VALIDATION_RULES.GSTIN.MIN_LENGTH) {
    return {
      isValid: false,
      message: `GSTIN must be exactly ${VALIDATION_RULES.GSTIN.MIN_LENGTH} characters`
    }
  }

  // Check pattern
  if (!VALIDATION_RULES.GSTIN.PATTERN.test(cleanGstin)) {
    return {
      isValid: false,
      message: 'Invalid GSTIN format'
    }
  }

  // Validate checksum (simplified version)
  if (!validateGSTINChecksum(cleanGstin)) {
    return {
      isValid: false,
      message: 'Invalid GSTIN checksum'
    }
  }

  return {
    isValid: true,
    message: ''
  }
}

/**
 * Validates GST Username
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return {
      isValid: false,
      message: 'This field is required'
    }
  }

  const cleanUsername = username.trim()

  // Check length
  if (cleanUsername.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
    return {
      isValid: false,
      message: `Username must be at least ${VALIDATION_RULES.USERNAME.MIN_LENGTH} characters`
    }
  }

  if (cleanUsername.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
    return {
      isValid: false,
      message: `Username cannot exceed ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`
    }
  }

  // Check pattern
  if (!VALIDATION_RULES.USERNAME.PATTERN.test(cleanUsername)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, @, ., _, and -'
    }
  }

  return {
    isValid: true,
    message: ''
  }
}

/**
 * Validates OTP
 */
export function validateOTP(otp: string): ValidationResult {
  if (!otp || typeof otp !== 'string') {
    return {
      isValid: false,
      message: ERROR_MESSAGES.INVALID_OTP
    }
  }

  const cleanOtp = otp.trim()

  // Check length
  if (cleanOtp.length !== 4) {
    return {
      isValid: false,
      message: 'OTP must be exactly 4 digits'
    }
  }

  // Check if all digits
  if (!/^\d{4}$/.test(cleanOtp)) {
    return {
      isValid: false,
      message: 'OTP must contain only numbers'
    }
  }

  return {
    isValid: true,
    message: ''
  }
}

/**
 * Validates state code extracted from GSTIN
 */
export function validateStateCode(stateCode: string): ValidationResult {
  if (!stateCode || typeof stateCode !== 'string') {
    return {
      isValid: false,
      message: 'State code is required'
    }
  }

  const cleanStateCode = stateCode.trim()

  // Check length
  if (cleanStateCode.length !== VALIDATION_RULES.STATE_CODE.MIN_LENGTH) {
    return {
      isValid: false,
      message: 'State code must be 2 digits'
    }
  }

  // Check pattern
  if (!VALIDATION_RULES.STATE_CODE.PATTERN.test(cleanStateCode)) {
    return {
      isValid: false,
      message: 'State code must be numeric'
    }
  }

  // Validate state code range (01-37 are valid Indian state codes)
  const code = parseInt(cleanStateCode, 10)
  if (code < 1 || code > 37) {
    return {
      isValid: false,
      message: 'Invalid state code'
    }
  }

  return {
    isValid: true,
    message: ''
  }
}

/**
 * Simplified GSTIN checksum validation
 * Note: This is a basic implementation. For production, use a more robust algorithm.
 */
function validateGSTINChecksum(gstin: string): boolean {
  try {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const values: { [key: string]: number } = {}
    
    for (let i = 0; i < chars.length; i++) {
      values[chars[i]] = i
    }

    let factor = 2
    let sum = 0
    
    for (let i = gstin.length - 2; i >= 0; i--) {
      let codePoint = values[gstin[i]]
      let digit = factor * codePoint
      
      factor = factor === 2 ? 1 : 2
      digit = Math.floor(digit / 36) + (digit % 36)
      sum += digit
    }
    
    const checkCodePoint = (36 - (sum % 36)) % 36
    const checkChar = chars[checkCodePoint]
    
    return checkChar === gstin[gstin.length - 1]
  } catch (error) {
    return false
  }
}

/**
 * Extracts state code from GSTIN
 */
export function extractStateCode(gstin: string): string {
  if (!gstin || gstin.length < 2) {
    return ''
  }
  return gstin.substring(0, 2)
}

/**
 * Formats GSTIN for display
 */
export function formatGSTIN(gstin: string): string {
  if (!gstin) return ''
  
  const clean = gstin.replace(/[^A-Z0-9]/g, '').toUpperCase()
  
  // Format as XX-XXXXX-XXXX-X-X-X-X for better readability
  if (clean.length === 15) {
    return `${clean.slice(0, 2)}-${clean.slice(2, 7)}-${clean.slice(7, 11)}-${clean.slice(11, 12)}-${clean.slice(12, 13)}-${clean.slice(13, 14)}-${clean.slice(14, 15)}`
  }
  
  return clean
}

/**
 * Validates complete form data
 */
export interface GstinFormData {
  username: string
  gstin: string
  stateCode: string
}

export function validateGstinForm(formData: GstinFormData): { isValid: boolean; errors: Partial<GstinFormData> } {
  const errors: Partial<GstinFormData> = {}
  let isValid = true

  // Validate username
  const usernameValidation = validateUsername(formData.username)
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message
    isValid = false
  }

  // Validate GSTIN
  const gstinValidation = validateGSTIN(formData.gstin)
  if (!gstinValidation.isValid) {
    errors.gstin = gstinValidation.message
    isValid = false
  }

  // Validate state code
  const stateCodeValidation = validateStateCode(formData.stateCode)
  if (!stateCodeValidation.isValid) {
    errors.stateCode = stateCodeValidation.message
    isValid = false
  }

  return { isValid, errors }
}

/**
 * Validates GSTIN input form data
 */
export function validateGstinInputForm(formData: GstinInputData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  let isValid = true

  // Validate username
  const usernameValidation = validateUsername(formData.username)
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message
    isValid = false
  }

  // Validate GSTIN
  const gstinValidation = validateGSTIN(formData.gstin)
  if (!gstinValidation.isValid) {
    errors.gstin = gstinValidation.message
    isValid = false
  }

  // Validate state code if provided
  if (formData.stateCode) {
    const stateCodeValidation = validateStateCode(formData.stateCode)
    if (!stateCodeValidation.isValid) {
      errors.stateCode = stateCodeValidation.message
      isValid = false
    }
  }

  return { isValid, errors }
}