// Session Management Types

export interface SessionData {
  sessionId: string
  userId: string
  companyId: string
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer'
  expiresAt: Date
  refreshExpiresAt: Date
  loginTime: Date
  lastActivityTime: Date
  ipAddress: string
  userAgent: string
  deviceInfo: DeviceInfo
  loginMethod: 'email' | 'google' | 'linkedin' | 'apple' | 'facebook' | 'microsoft'
  isActive: boolean
  permissions: Permission[]
  companyRole: CompanyRole
}

export interface DeviceInfo {
  deviceId: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  location?: GeoLocation
  fingerprint: string
  isRegistered: boolean
  registeredAt?: Date
  lastSeenAt: Date
}

export interface GeoLocation {
  country: string
  region: string
  city: string
  latitude?: number
  longitude?: number
  timezone: string
  isp?: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
  tokenType: 'Bearer'
  scope: string[]
  issuedAt: Date
}

export interface DeviceSession {
  sessionId: string
  deviceInfo: DeviceInfo
  loginTime: Date
  lastActivityTime: Date
  isCurrentSession: boolean
  location?: GeoLocation
}

export interface LoginRecord {
  id: string
  userId: string
  loginTime: Date
  logoutTime?: Date
  ipAddress: string
  userAgent: string
  deviceInfo: DeviceInfo
  loginMethod: string
  success: boolean
  failureReason?: string
  location?: GeoLocation
  sessionDuration?: number // in minutes
}

export interface SecurityAlert {
  id: string
  userId: string
  type: 'suspicious_login' | 'new_device' | 'multiple_failed_attempts' | 'unusual_location' | 'concurrent_sessions'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  details: Record<string, any>
  createdAt: Date
  acknowledged: boolean
  acknowledgedAt?: Date
  acknowledgedBy?: string
}

export interface SessionConfiguration {
  accessTokenTTL: number // in minutes
  refreshTokenTTL: number // in days
  sessionTimeoutWarning: number // in minutes before expiry
  maxConcurrentSessions: number
  requireDeviceRegistration: boolean
  enableLocationTracking: boolean
  enableSuspiciousActivityDetection: boolean
  ipWhitelistEnabled: boolean
  allowedCountries?: string[]
}

export interface SessionState {
  currentSession: SessionData | null
  activeSessions: DeviceSession[]
  loginHistory: LoginRecord[]
  securityAlerts: SecurityAlert[]
  configuration: SessionConfiguration
  isSessionValid: boolean
  timeUntilExpiry: number // in minutes
  showTimeoutWarning: boolean
}

// Session Events
export interface SessionEvent {
  type: 'login' | 'logout' | 'refresh' | 'timeout' | 'device_change' | 'suspicious_activity'
  timestamp: Date
  sessionId: string
  userId: string
  details: Record<string, any>
}

// Session Middleware Types
export interface SessionMiddlewareConfig {
  autoRefresh: boolean
  refreshThreshold: number // minutes before expiry to auto-refresh
  onSessionExpired: () => void
  onSessionWarning: (minutesLeft: number) => void
  onSuspiciousActivity: (alert: SecurityAlert) => void
}

// Import types from auth-types to avoid circular dependency
import type { Permission, CompanyRole } from './auth-types'
