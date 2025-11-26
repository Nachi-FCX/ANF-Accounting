// Firebase Configuration for Authentication

import { initializeApp, type FirebaseApp } from 'firebase/app'
import { 
  getAuth, 
  type Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  connectAuthEmulator
} from 'firebase/auth'

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Environment-specific Firebase configurations
const firebaseConfigs: Record<string, FirebaseConfig> = {
  development: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_DEV || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEV || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_DEV || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_DEV || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEV || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID_DEV || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_DEV
  },
  testing: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_TEST || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_TEST || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_TEST || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_TEST || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_TEST || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID_TEST || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_TEST
  },
  demo: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_DEMO || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEMO || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_DEMO || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_DEMO || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEMO || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID_DEMO || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_DEMO
  },
  production: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_PROD || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_PROD || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_PROD || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_PROD || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_PROD || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID_PROD || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_PROD
  }
}

// Get current environment
const getCurrentEnvironment = (): string => {
  return import.meta.env.MODE || 'development'
}

// Get Firebase config for current environment
const getFirebaseConfig = (): FirebaseConfig | null => {
  const env = getCurrentEnvironment()
  const config = firebaseConfigs[env]
  
  if (!config) {
    console.warn(`Firebase configuration not found for environment: ${env}`)
    return null
  }
  
  // Validate required fields
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
  const missingFields = requiredFields.filter(field => !config[field as keyof FirebaseConfig])
  
  if (missingFields.length > 0) {
    console.warn(`Missing Firebase configuration fields: ${missingFields.join(', ')}. Firebase will be disabled.`)
    return null
  }
  
  return config
}

// Initialize Firebase app
let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null

try {
  const config = getFirebaseConfig()
  
  if (config) {
    firebaseApp = initializeApp(config)
    auth = getAuth(firebaseApp)
    
    // Connect to Firebase Auth emulator in development
    if (getCurrentEnvironment() === 'development' && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      const emulatorHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost'
      const emulatorPort = import.meta.env.VITE_FIREBASE_EMULATOR_PORT || '9099'
      connectAuthEmulator(auth, `http://${emulatorHost}:${emulatorPort}`)
    }
    
    console.log('Firebase initialized successfully')
  } else {
    console.warn('Firebase not initialized - missing configuration. Auth system will work in mock mode.')
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
  console.warn('Firebase initialization failed. Auth system will work in mock mode.')
  firebaseApp = null
  auth = null
}

// Social Auth Providers
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export const facebookProvider = new FacebookAuthProvider()
facebookProvider.addScope('email')
facebookProvider.addScope('public_profile')

export const twitterProvider = new TwitterAuthProvider()

// Apple Auth Provider
export const appleProvider = new OAuthProvider('apple.com')
appleProvider.addScope('email')
appleProvider.addScope('name')

// Microsoft Auth Provider
export const microsoftProvider = new OAuthProvider('microsoft.com')
microsoftProvider.addScope('User.Read')

// LinkedIn Auth Provider (Custom implementation needed)
export const linkedinProvider = new OAuthProvider('oidc.linkedin')
linkedinProvider.addScope('r_liteprofile')
linkedinProvider.addScope('r_emailaddress')

// Yahoo Auth Provider
export const yahooProvider = new OAuthProvider('yahoo.com')
yahooProvider.addScope('profile')
yahooProvider.addScope('email')

// Provider mapping
export const authProviders = {
  google: googleProvider,
  facebook: facebookProvider,
  twitter: twitterProvider,
  apple: appleProvider,
  microsoft: microsoftProvider,
  linkedin: linkedinProvider,
  yahoo: yahooProvider
} as const

// Firebase Auth configuration
export const authConfig = {
  // Enable persistence
  persistence: true,
  
  // Custom claims
  customClaims: {
    role: 'user',
    companyId: null,
    permissions: []
  },
  
  // Token refresh settings
  tokenRefresh: {
    threshold: 5 * 60 * 1000, // 5 minutes in milliseconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },
  
  // Session settings
  session: {
    timeout: 30 * 60 * 1000, // 30 minutes in milliseconds
    warningTime: 5 * 60 * 1000, // 5 minutes warning
    checkInterval: 60 * 1000 // Check every minute
  }
}

// Auth state change listeners
export const authStateListeners = new Set<(user: any) => void>()

// Add auth state listener
export const addAuthStateListener = (callback: (user: any) => void) => {
  authStateListeners.add(callback)
}

// Remove auth state listener
export const removeAuthStateListener = (callback: (user: any) => void) => {
  authStateListeners.delete(callback)
}

// Firebase Auth instance
export { auth }

// Firebase app instance
export { firebaseApp }

// Environment utilities
export const firebaseUtils = {
  getCurrentEnvironment,
  getFirebaseConfig,
  isEmulatorMode: () => getCurrentEnvironment() === 'development' && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true',
  isProduction: () => getCurrentEnvironment() === 'production'
}

// Error handling utilities
export const firebaseErrors = {
  // Map Firebase error codes to user-friendly messages
  getErrorMessage: (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/popup-blocked': 'Pop-up was blocked by your browser.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
      'auth/credential-already-in-use': 'This credential is already associated with a different user account.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/invalid-credential': 'The credential is malformed or has expired.',
      'auth/custom-token-mismatch': 'The custom token corresponds to a different audience.',
      'auth/invalid-custom-token': 'The custom token format is incorrect.',
      'auth/token-expired': 'The user\'s credential is no longer valid. The user must sign in again.',
      'auth/user-token-expired': 'The user\'s credential is no longer valid. The user must sign in again.',
      'auth/null-user': 'User is not signed in.',
      'auth/invalid-user-token': 'The user\'s credential is no longer valid. The user must sign in again.',
      'auth/requires-recent-login': 'This operation is sensitive and requires recent authentication. Log in again before retrying this request.'
    }
    
    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.'
  },
  
  // Check if error is retryable
  isRetryableError: (errorCode: string): boolean => {
    const retryableErrors = [
      'auth/network-request-failed',
      'auth/too-many-requests',
      'auth/timeout'
    ]
    return retryableErrors.includes(errorCode)
  }
}

export default firebaseApp
