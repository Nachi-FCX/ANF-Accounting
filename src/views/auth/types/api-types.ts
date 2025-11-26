// Auth API Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phoneNumber?: string
  companyName?: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// Auth API Response Types
export interface LoginSuccessResponse {
  data: {
    user: {
      id: number
      email: string
      emailVerified: boolean
      name: string | null
      phone: string | null
      phoneVerified: boolean
      countryCode: string | null
      userInfo: {
        name: string
      }
      createdAt: string
      updatedAt: string
      subscribed: string
      accounts: any[]
      token: string
    }
  }
  success: true
}

export interface LoginErrorResponse {
  error: {
    message: string
  }
  success: false
}

export interface RegisterSuccessResponse {
  data: {
    userId: string
    email: string
    verificationRequired: boolean
    verificationMethod: 'email' | 'sms'
    verificationId: string
  }
  success: true
}

export interface RegisterErrorResponse {
  error: {
    message: string
    code?: string
  }
  success: false
}

export interface RefreshTokenSuccessResponse {
  data: {
    accessToken: string
    refreshToken: string
    expiresIn: number
    user: {
      id: number
      email: string
      name: string
    }
  }
  success: true
}

export interface RefreshTokenErrorResponse {
  error: {
    message: string
  }
  success: false
}

// Union types for API responses
export type LoginResponse = LoginSuccessResponse | LoginErrorResponse
export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse
export type RefreshTokenResponse = RefreshTokenSuccessResponse | RefreshTokenErrorResponse

// API User data transformation types
export interface ApiUser {
  id: number
  email: string
  emailVerified: boolean
  name: string | null
  phone: string | null
  phoneVerified: boolean
  countryCode: string | null
  userInfo: {
    name: string
  }
  createdAt: string
  updatedAt: string
  subscribed: string
  accounts: any[]
  token: string
}

// Error codes specific to auth API
export enum AuthApiErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED'
}

// Common error messages mapping
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Wrong password': 'The password you entered is incorrect. Please try again.',
  'Invalid email': 'The email address you entered is not valid or not found.',
  'Email already exists': 'An account with this email address already exists.',
  'Weak password': 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.',
  'Token expired': 'Your session has expired. Please sign in again.',
  'Invalid token': 'Invalid authentication token. Please sign in again.',
  'Account locked': 'Your account has been temporarily locked due to multiple failed login attempts.',
  'Email not verified': 'Please verify your email address before signing in.'
}
