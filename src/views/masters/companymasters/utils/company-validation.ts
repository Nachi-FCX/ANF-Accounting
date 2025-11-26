// Company Validation Utilities

import { VALIDATION_PATTERNS, ERROR_MESSAGES } from '../constants/company-constants'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const validateGSTIN = (gstin: string): ValidationResult => {
  if (!gstin || gstin.trim() === '') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    }
  }

  const cleanGstin = gstin.trim().toUpperCase()
  
  if (!VALIDATION_PATTERNS.GSTIN.test(cleanGstin)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_GSTIN
    }
  }

  return { isValid: true }
}

export const validateStateCode = (stateCode: string): ValidationResult => {
  if (!stateCode || stateCode.trim() === '') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    }
  }

  const cleanStateCode = stateCode.trim()
  
  if (!VALIDATION_PATTERNS.STATE_CODE.test(cleanStateCode)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_STATE_CODE
    }
  }

  return { isValid: true }
}

export const validateUsername = (username: string): ValidationResult => {
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    }
  }

  const cleanUsername = username.trim()
  
  if (!VALIDATION_PATTERNS.USERNAME.test(cleanUsername)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_USERNAME
    }
  }

  return { isValid: true }
}

export const validateOTP = (otp: string): ValidationResult => {
  if (!otp || otp.trim() === '') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    }
  }

  const cleanOtp = otp.trim()
  
  if (cleanOtp.length !== 4 || !/^\d{4}$/.test(cleanOtp)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.OTP_INVALID
    }
  }

  return { isValid: true }
}

export const validateCompanyInputForm = (data: {
  username: string
  gstin: string
  stateCode: string
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  const usernameValidation = validateUsername(data.username)
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error!
  }

  const gstinValidation = validateGSTIN(data.gstin)
  if (!gstinValidation.isValid) {
    errors.gstin = gstinValidation.error!
  }

  const stateCodeValidation = validateStateCode(data.stateCode)
  if (!stateCodeValidation.isValid) {
    errors.stateCode = stateCodeValidation.error!
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
