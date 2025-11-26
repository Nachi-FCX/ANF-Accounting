// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://ims-backend-phi.vercel.app/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email'
    },
    COMPANY: {
      FETCH_DETAILS: '/accounts/fetch-details',
      SEND_OTP: '/accounts/send-otp',
      VERIFY_OTP: '/accounts/verify-otp'
    }
  }
} as const

// Get API configuration values
export const getApiBaseUrl = (): string => {
  return API_CONFIG.BASE_URL
}

export const getApiTimeout = (): number => {
  return API_CONFIG.TIMEOUT
}

export const isLoggingEnabled = (): boolean => {
  return import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV
}

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV
}
