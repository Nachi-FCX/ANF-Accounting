import { STORAGE_KEYS } from '../constants/auth-constants'
import type { User } from '../types/auth-types'

// Token Storage Utilities
export const tokenStorage = {
  // Set access token
  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  },

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  // Set refresh token
  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
  },

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  // Set both tokens
  setTokens(tokens: { accessToken: string; refreshToken?: string }): void {
    this.setAccessToken(tokens.accessToken)
    if (tokens.refreshToken) {
      this.setRefreshToken(tokens.refreshToken)
    }
  },

  // Clear all tokens
  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  // Check if access token exists
  hasAccessToken(): boolean {
    return !!this.getAccessToken()
  },

  // Check if refresh token exists
  hasRefreshToken(): boolean {
    return !!this.getRefreshToken()
  }
}

// User Data Storage Utilities
export const userStorage = {
  // Set user data
  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
  },

  // Get user data
  getUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error)
        this.clearUser()
        return null
      }
    }
    return null
  },

  // Clear user data
  clearUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
  },

  // Check if user data exists
  hasUser(): boolean {
    return !!this.getUser()
  }
}

// Remember Me Utilities
export const rememberMeStorage = {
  // Set remember me preference
  setRememberMe(email: string): void {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
    localStorage.setItem(STORAGE_KEYS.LAST_EMAIL, email)
  },

  // Get remember me preference
  getRememberMe(): { rememberMe: boolean; lastEmail: string | null } {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    const lastEmail = localStorage.getItem(STORAGE_KEYS.LAST_EMAIL)
    return { rememberMe, lastEmail }
  },

  // Clear remember me data
  clearRememberMe(): void {
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
    localStorage.removeItem(STORAGE_KEYS.LAST_EMAIL)
  }
}

// Company Storage Utilities
export const companyStorage = {
  // Set current company
  setCurrentCompany(company: any): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_COMPANY, JSON.stringify(company))
  },

  // Get current company
  getCurrentCompany(): any | null {
    const companyData = localStorage.getItem(STORAGE_KEYS.CURRENT_COMPANY)
    if (companyData) {
      try {
        return JSON.parse(companyData)
      } catch (error) {
        console.error('Error parsing company data from localStorage:', error)
        this.clearCurrentCompany()
        return null
      }
    }
    return null
  },

  // Clear current company
  clearCurrentCompany(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_COMPANY)
  }
}

// Preferences Storage Utilities
export const preferencesStorage = {
  // Set theme preference
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    localStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme)
  },

  // Get theme preference
  getTheme(): 'light' | 'dark' | 'system' | null {
    return localStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE) as 'light' | 'dark' | 'system' | null
  },

  // Set language preference
  setLanguage(language: string): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, language)
  },

  // Get language preference
  getLanguage(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCE)
  }
}

// Device ID Utilities
export const deviceStorage = {
  // Generate and set device ID
  generateDeviceId(): string {
    const deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId)
    return deviceId
  },

  // Get device ID (generate if not exists)
  getDeviceId(): string {
    let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID)
    if (!deviceId) {
      deviceId = this.generateDeviceId()
    }
    return deviceId
  },

  // Clear device ID
  clearDeviceId(): void {
    localStorage.removeItem(STORAGE_KEYS.DEVICE_ID)
  }
}

// Complete Auth Data Management
export const authStorage = {
  // Clear all auth-related data
  clearAll(): void {
    tokenStorage.clearTokens()
    userStorage.clearUser()
    companyStorage.clearCurrentCompany()
    // Note: We don't clear remember me and preferences on logout
  },

  // Check if user is authenticated (has valid tokens and user data)
  isAuthenticated(): boolean {
    return tokenStorage.hasAccessToken() && userStorage.hasUser()
  },

  // Initialize auth data from storage
  initialize(): {
    user: User | null
    hasTokens: boolean
    rememberMe: { rememberMe: boolean; lastEmail: string | null }
    currentCompany: any | null
  } {
    return {
      user: userStorage.getUser(),
      hasTokens: tokenStorage.hasAccessToken(),
      rememberMe: rememberMeStorage.getRememberMe(),
      currentCompany: companyStorage.getCurrentCompany()
    }
  },

  // Set complete auth session
  setAuthSession(data: {
    user: User
    accessToken: string
    refreshToken?: string
    company?: any
  }): void {
    userStorage.setUser(data.user)
    tokenStorage.setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    })
    if (data.company) {
      companyStorage.setCurrentCompany(data.company)
    }
  }
}

// Export all utilities
export {
  tokenStorage as tokens,
  userStorage as user,
  rememberMeStorage as rememberMe,
  companyStorage as company,
  preferencesStorage as preferences,
  deviceStorage as device,
  authStorage as auth
}
