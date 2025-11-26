// Authentication Constants

// Session Configuration
export const SESSION_CONFIG = {
  ACCESS_TOKEN_TTL: 30, // minutes
  REFRESH_TOKEN_TTL: 7, // days
  SESSION_TIMEOUT_WARNING: 5, // minutes before expiry
  MAX_CONCURRENT_SESSIONS: 3,
  AUTO_REFRESH_THRESHOLD: 5, // minutes before expiry to auto-refresh
  INACTIVITY_TIMEOUT: 60, // minutes of inactivity before logout
} as const

// Password Policy
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
  SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  EXPIRY_DAYS: 90,
} as const

// OTP Configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS: 3,
  RESEND_COOLDOWN: 60, // seconds
  MAX_RESEND_ATTEMPTS: 5,
  RATE_LIMIT_WINDOW: 3600, // seconds (1 hour)
  MAX_REQUESTS_PER_WINDOW: 10,
} as const

// Social Login Providers
export const SOCIAL_PROVIDERS = {
  GOOGLE: {
    name: 'Google',
    icon: 'pi pi-google',
    color: '#ea4335',
    scopes: ['email', 'profile'],
  },
  LINKEDIN: {
    name: 'LinkedIn',
    icon: 'pi pi-linkedin',
    color: '#0a66c2',
    scopes: ['r_liteprofile', 'r_emailaddress'],
  },
  APPLE: {
    name: 'Apple',
    icon: 'pi pi-apple',
    color: '#000000',
    scopes: ['name', 'email'],
  },
  FACEBOOK: {
    name: 'Facebook',
    icon: 'pi pi-facebook',
    color: '#1877f2',
    scopes: ['email', 'public_profile'],
  },
  MICROSOFT: {
    name: 'Microsoft',
    icon: 'pi pi-microsoft',
    color: '#00a1f1',
    scopes: ['User.Read'],
  },
  TWITTER: {
    name: 'Twitter',
    icon: 'pi pi-twitter',
    color: '#1da1f2',
    scopes: ['tweet.read', 'users.read'],
  },
  YAHOO: {
    name: 'Yahoo',
    icon: 'pi pi-yahoo',
    color: '#720e9e',
    scopes: ['profile', 'email'],
  },
} as const

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PHONE_INVALID: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_POLICY.MIN_LENGTH} characters`,
  PASSWORD_TOO_LONG: `Password must not exceed ${PASSWORD_POLICY.MAX_LENGTH} characters`,
  PASSWORD_NO_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_NO_LOWERCASE: 'Password must contain at least one lowercase letter',
  PASSWORD_NO_NUMBER: 'Password must contain at least one number',
  PASSWORD_NO_SPECIAL: 'Password must contain at least one special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  OTP_INVALID: `Please enter a valid ${OTP_CONFIG.LENGTH}-digit code`,
  OTP_EXPIRED: 'Verification code has expired. Please request a new one',
  TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions',
  COMPANY_NAME_REQUIRED: 'Company name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name must not exceed 50 characters',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  SIGN_IN: '/auth/login',
  SIGN_UP: '/auth/signup',
  SIGN_OUT: '/auth/signout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  
  // OTP
  SEND_OTP: '/auth/otp/send',
  VERIFY_OTP: '/auth/otp/verify',
  RESEND_OTP: '/auth/otp/resend',
  
  // Social Login
  SOCIAL_LOGIN: '/auth/social',
  SOCIAL_CALLBACK: '/auth/social/callback',
  LINK_SOCIAL: '/auth/social/link',
  UNLINK_SOCIAL: '/auth/social/unlink',
  
  // Session Management
  GET_SESSIONS: '/auth/sessions',
  TERMINATE_SESSION: '/auth/sessions/:sessionId',
  TERMINATE_ALL_SESSIONS: '/auth/sessions/terminate-all',
  
  // Company Management
  GET_COMPANIES: '/auth/companies',
  SWITCH_COMPANY: '/auth/companies/switch',
  CREATE_COMPANY: '/auth/companies',
  
  // Profile
  GET_PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/profile/password',
  UPDATE_PREFERENCES: '/auth/profile/preferences',
} as const

// Error Codes
export const AUTH_ERROR_CODES = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  PHONE_NOT_VERIFIED: 'PHONE_NOT_VERIFIED',
  
  // Session Errors
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',
  
  // OTP Errors
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_INVALID: 'OTP_INVALID',
  OTP_MAX_ATTEMPTS: 'OTP_MAX_ATTEMPTS',
  OTP_RATE_LIMITED: 'OTP_RATE_LIMITED',
  
  // Social Login Errors
  SOCIAL_AUTH_FAILED: 'SOCIAL_AUTH_FAILED',
  SOCIAL_ACCOUNT_EXISTS: 'SOCIAL_ACCOUNT_EXISTS',
  SOCIAL_EMAIL_MISMATCH: 'SOCIAL_EMAIL_MISMATCH',
  
  // Company Errors
  COMPANY_ACCESS_DENIED: 'COMPANY_ACCESS_DENIED',
  COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
  COMPANY_SUSPENDED: 'COMPANY_SUSPENDED',
  
  // Rate Limiting
  RATE_LIMITED: 'RATE_LIMITED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  SIGN_UP_SUCCESS: 'Account created successfully! Please verify your email.',
  SIGN_IN_SUCCESS: 'Welcome back!',
  EMAIL_VERIFIED: 'Email verified successfully!',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  OTP_SENT: 'Verification code sent successfully.',
  COMPANY_SWITCHED: 'Company switched successfully.',
  SESSION_TERMINATED: 'Session terminated successfully.',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'fincorpx_access_token',
  REFRESH_TOKEN: 'fincorpx_refresh_token',
  USER_DATA: 'fincorpx_user_data',
  CURRENT_COMPANY: 'fincorpx_current_company',
  REMEMBER_ME: 'fincorpx_remember_me',
  DEVICE_ID: 'fincorpx_device_id',
  LAST_EMAIL: 'fincorpx_last_email',
  THEME_PREFERENCE: 'fincorpx_theme',
  LANGUAGE_PREFERENCE: 'fincorpx_language',
} as const

// Route Names
export const ROUTE_NAMES = {
  SIGN_IN: 'auth-signin',
  SIGN_UP: 'auth-signup',
  FORGOT_PASSWORD: 'auth-forgot-password',
  RESET_PASSWORD: 'auth-reset-password',
  VERIFY_EMAIL: 'auth-verify-email',
  OTP_VERIFICATION: 'auth-otp-verification',
  COMPANY_SELECTION: 'auth-company-selection',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
} as const

// Device Detection
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
} as const

// Security Settings
export const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 30, // minutes
  SUSPICIOUS_ACTIVITY_THRESHOLD: 3,
  ENABLE_DEVICE_TRACKING: true,
  ENABLE_LOCATION_TRACKING: true,
  REQUIRE_DEVICE_VERIFICATION: false,
  SESSION_FINGERPRINTING: true,
} as const

// Carousel Configuration
export const CAROUSEL_CONFIG = {
  AUTOPLAY_INTERVAL: 5000, // milliseconds
  TRANSITION_DURATION: 500, // milliseconds
  SHOW_INDICATORS: true,
  SHOW_NAVIGATORS: false,
  CIRCULAR: true,
  NUM_VISIBLE: 1,
  NUM_SCROLL: 1,
} as const

// Company Roles and Permissions
export const COMPANY_ROLES = {
  OWNER: {
    name: 'Owner',
    level: 100,
    permissions: ['*'], // All permissions
  },
  ADMIN: {
    name: 'Administrator',
    level: 90,
    permissions: ['users.*', 'settings.*', 'billing.*', 'reports.*'],
  },
  MANAGER: {
    name: 'Manager',
    level: 70,
    permissions: ['users.read', 'users.update', 'reports.*', 'transactions.*'],
  },
  ACCOUNTANT: {
    name: 'Accountant',
    level: 60,
    permissions: ['transactions.*', 'reports.*', 'invoices.*'],
  },
  USER: {
    name: 'User',
    level: 50,
    permissions: ['transactions.read', 'reports.read', 'profile.*'],
  },
  VIEWER: {
    name: 'Viewer',
    level: 10,
    permissions: ['*.read'],
  },
} as const
