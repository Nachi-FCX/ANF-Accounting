import type { ErrorState, LoadingState, SuccessState } from '@/components/statecomponents/types/state-types'

// Base User Interface
export interface User {
  userId: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  profilePicture?: string
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
  status: 'active' | 'inactive' | 'suspended'
  role: 'admin' | 'user' | 'manager' | 'viewer'
  preferences: UserPreferences
}

// User Preferences
export interface UserPreferences {
  language: string
  theme: 'light' | 'dark' | 'system'
  timezone: string
  dateFormat: string
  currency: string
  notifications: NotificationPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
}

// Company Interface
export interface Company {
  companyId: string
  name: string
  domain: string
  logo?: string
  subscription: SubscriptionPlan
  settings: CompanySettings
  createdAt: Date
  status: 'active' | 'inactive' | 'trial'
}

export interface SubscriptionPlan {
  planId: string
  name: string
  type: 'free' | 'basic' | 'premium' | 'enterprise'
  features: string[]
  limits: PlanLimits
  expiresAt?: Date
}

export interface PlanLimits {
  users: number
  storage: number // in GB
  transactions: number
  apiCalls: number
}

export interface CompanySettings {
  allowSocialLogin: boolean
  requireTwoFactor: boolean
  sessionTimeout: number // in minutes
  passwordPolicy: PasswordPolicy
  ipWhitelist?: string[]
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  expiryDays?: number
}

// User-Company Association
export interface UserCompanyAssociation {
  userId: string
  companyId: string
  role: CompanyRole
  permissions: Permission[]
  joinedAt: Date
  isActive: boolean
  invitedBy?: string
  invitedAt?: Date
}

export type CompanyRole = 'owner' | 'admin' | 'manager' | 'accountant' | 'user' | 'viewer'

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
  conditions?: Record<string, any>
}

// Authentication specific types extending your state types
export interface AuthErrorState extends ErrorState {
  authCode?: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'EMAIL_NOT_VERIFIED' | 'OTP_EXPIRED' | 'OTP_INVALID' | 'OTP_MAX_ATTEMPTS' | 'SOCIAL_AUTH_FAILED' | 'COMPANY_ACCESS_DENIED'
  remainingAttempts?: number
  lockoutTime?: Date
  redirectUrl?: string
}

export interface AuthLoadingState extends LoadingState {
  authStep?: 'signing-in' | 'verifying-otp' | 'verifying-gstin' | 'creating-account' | 'social-auth' | 'switching-company' | 'refreshing-token' | 'forgot-password'
}

export interface AuthSuccessState extends SuccessState {
  redirectUrl?: string
  showWelcome?: boolean
  newUser?: boolean
  companyName?: string
}

// Form Data Interfaces
export interface SignInFormData {
  emailOrMobile: string
  password?: string
  rememberMe: boolean
}

export interface SignUpFormData {
  name?: string
  companyName?: string
  gstinNumber?: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  // Legacy fields for backward compatibility
  email?: string
  phoneNumber?: string
  subscribeToNewsletter?: boolean
}

export interface OtpVerificationData {
  otp: string
  verificationId: string
  method: 'email' | 'sms'
  contactInfo: string
}

export interface GSTINVerificationData {
  gstin: string
  otp: string
  username: string
  stateCode: string
  otpId?: string
}

export interface GSTINVerificationState {
  gstin: string
  username: string
  stateCode: string
  otpId?: string
  canResend: boolean
  resendCooldown: number
  attemptsRemaining: number
  expiresAt: Date | null
  otpSent: boolean
}

export interface ForgotPasswordData {
  emailOrMobile: string
  newPassword?: string
  confirmPassword?: string
}

export interface ForgotPasswordInitData {
  emailOrMobile: string
}

export interface ForgotPasswordOtpData {
  emailOrMobile: string
  otp: string
  verificationId: string
}

export interface ForgotPasswordResetData {
  emailOrMobile: string
  otp: string
  verificationId: string
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordState {
  currentStep: 'init' | 'otp-verification' | 'reset-password'
  emailOrMobile: string
  verificationId: string
  otpSent: boolean
  otpVerified: boolean
  canResend: boolean
  resendCooldown: number
  attemptsRemaining: number
  expiresAt: Date | null
  method: 'email' | 'sms'
}

export interface ResetPasswordData {
  token: string
  newPassword: string
  confirmPassword: string
}

// Social Login Types
export type SocialProvider = 'google' | 'linkedin' | 'apple' | 'facebook' | 'microsoft' | 'twitter' | 'yahoo'

export interface SocialLoginData {
  provider: SocialProvider
  accessToken: string
  idToken?: string
  profile: SocialProfile
}

export interface SocialProfile {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  picture?: string
  verified?: boolean
}

// Form State Management
export interface FormState {
  isLoading: boolean
  isValid: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
  data: Record<string, any>
}

// Auth Flow States
export type AuthStep = 
  | 'idle'
  | 'email-input'
  | 'password-input'
  | 'otp-verification'
  | 'gstin-verification'
  | 'company-selection'
  | 'profile-completion'
  | 'success'

export type SignUpStep = 
  | 'personal-info'
  | 'company-info'
  | 'verification'
  | 'complete'

// Validation Rules
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormValidationRules {
  [fieldName: string]: ValidationRule
}

// API Response Types
export interface AuthResponse {
  success: boolean
  data?: any
  error?: AuthErrorState
  message?: string
}

export interface LoginResponse extends AuthResponse {
  data?: {
    user: User
    session: any // SessionData - imported separately to avoid circular imports
    companies: Company[]
    tokens: any // TokenPair - imported separately to avoid circular imports
  }
}

export interface SignUpResponse extends AuthResponse {
  data?: {
    userId: string
    verificationRequired: boolean
    verificationMethod: 'email' | 'sms'
    verificationId: string
  }
}


// API Response Transformation Types
export interface ApiUserTransform {
  id: number
  email: string
  name: string | null
  userInfo?: {
    name: string
  }
  emailVerified: boolean
  phoneVerified: boolean
  phone: string | null
  createdAt: string
  updatedAt: string
  subscribed: string
  token: string
}

// Note: SessionData and TokenPair are now defined here to avoid circular imports
