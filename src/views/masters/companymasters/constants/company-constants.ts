// Company Creation Constants
// Note: API endpoints are now centralized in @/services/config.ts

export const VALIDATION_PATTERNS = {
  GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  STATE_CODE: /^[0-9]{2}$/,
  USERNAME: /^[A-Za-z0-9_.]{3,20}$/
} as const

export const ERROR_MESSAGES = {
  INVALID_GSTIN: 'Please enter a valid GSTIN format (e.g., 36AAACH7409R1Z2)',
  INVALID_STATE_CODE: 'Please enter a valid 2-digit state code',
  INVALID_USERNAME: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and dots',
  REQUIRED_FIELD: 'This field is required',
  API_ERROR: 'An error occurred while processing your request',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  OTP_INVALID: 'Please enter a valid 4-digit OTP',
  OTP_EXPIRED: 'OTP has expired. Please request a new one',
  COMPANY_NOT_FOUND: 'Company details not found for the provided GSTIN'
} as const

export const SUCCESS_MESSAGES = {
  OTP_SENT: 'OTP has been sent successfully',
  COMPANY_ADDED: 'Company has been added successfully',
  DETAILS_FETCHED: 'Company details fetched successfully'
} as const

export const LOADING_MESSAGES = {
  FETCHING_DETAILS: 'Fetching company details...',
  SENDING_OTP: 'Sending OTP...',
  VERIFYING_OTP: 'Verifying OTP...',
  ADDING_COMPANY: 'Adding company...'
} as const

export const DIALOG_CONFIG = {
  WIDTH: '500px',
  MAX_WIDTH: '90vw',
  ANIMATION_DURATION: 300
} as const

export const OTP_CONFIG = {
  LENGTH: 4,
  EXPIRY_TIME: 300, // 5 minutes in seconds
  RESEND_DELAY: 30 // 30 seconds
} as const
