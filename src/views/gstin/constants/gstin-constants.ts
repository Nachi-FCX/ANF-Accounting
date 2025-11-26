// GSTIN Creation Constants

export const OTP_CONFIG = {
  LENGTH: 4,
  RESEND_DELAY: 30, // seconds
  MAX_ATTEMPTS: 3,
  EXPIRY_TIME: 300 // 5 minutes
}

export const LOADING_MESSAGES = {
  FETCHING_DATA: 'Fetching GSTIN details...',
  SENDING_OTP: 'Sending OTP to registered mobile number...',
  VERIFYING_OTP: 'Verifying OTP...',
  CREATING_GSTIN: 'Adding GSTIN to your account...',
  FINALIZING: 'Finalizing GSTIN setup...'
}

export const SUCCESS_MESSAGES = {
  GSTIN_ADDED: 'GSTIN has been successfully added to your account!',
  OTP_SENT: 'OTP has been sent to your registered mobile number',
  DATA_FETCHED: 'GSTIN details retrieved successfully'
}

export const ERROR_MESSAGES = {
  INVALID_GSTIN: 'Please enter a valid 15-digit GSTIN',
  INVALID_USERNAME: 'Please enter a valid GST username',
  INVALID_OTP: 'Please enter a valid 4-digit OTP',
  ACCOUNT_NOT_FOUND: 'GSTIN account not found. Please check your details and try again.',
  GSTIN_NOT_FOUND: 'GSTIN not found. Please check your details and try again.',
  OTP_INVALID: 'Invalid OTP. Please check and try again.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  MAX_ATTEMPTS_EXCEEDED: 'Maximum OTP attempts exceeded. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  API_ERROR: 'Something went wrong. Please try again.',
  GSTIN_ALREADY_EXISTS: 'This GSTIN is already added to your account'
}

export const VALIDATION_RULES = {
  GSTIN: {
    MIN_LENGTH: 15,
    MAX_LENGTH: 15,
    PATTERN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9@._-]+$/
  },
  STATE_CODE: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 2,
    PATTERN: /^[0-9]{2}$/
  }
}

export const DIALOG_CONFIG = {
  WIDTH: {
    DESKTOP: '500px',
    TABLET: '75vw',
    MOBILE: '90vw'
  },
  BREAKPOINTS: {
    '960px': '75vw',
    '640px': '90vw'
  }
}

export const GSTIN_CREATION_PHASES = {
  INPUT: 'input',
  VERIFICATION: 'verification',
  OTP_ENTRY: 'otp_entry',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const

export type GstinCreationPhase = typeof GSTIN_CREATION_PHASES[keyof typeof GSTIN_CREATION_PHASES]