import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import type { 
  User, 
  Company, 
  AuthErrorState, 
  AuthLoadingState, 
  AuthSuccessState,
  SignInFormData,
  SignUpFormData,
  OtpVerificationData,
  ForgotPasswordInitData,
  ForgotPasswordOtpData,
  ForgotPasswordResetData,
  SocialProvider,
  AuthStep,
  SignUpStep
} from '../types/auth-types'
import type { SessionData, TokenPair } from '../types/session-types'
import type { ErrorState, LoadingState, SuccessState } from '@/components/statecomponents/types/state-types'
import { STORAGE_KEYS, AUTH_ERROR_CODES, SUCCESS_MESSAGES } from '../constants/auth-constants'
import { authService } from '../services/auth.service'
import { authStorage } from '../utils/storage'

export const useAuthStore = defineStore('auth', () => {
  // Core State
  const user = ref<User | null>(null)
  const currentCompany = ref<Company | null>(null)
  const userCompanies = ref<Company[]>([])
  const session = ref<SessionData | null>(null)
  const tokens = ref<TokenPair | null>(null)

  // Authentication State
  const isAuthenticated = ref(false)
  const authStep = ref<AuthStep>('idle')
  const signUpStep = ref<SignUpStep>('personal-info')

  // State Management (using your existing state component interfaces)
  const loading = ref<AuthLoadingState | null>(null)
  const error = ref<AuthErrorState | null>(null)
  const success = ref<AuthSuccessState | null>(null)

  // Session Tracking
  const loginTime = ref<Date | null>(null)
  const lastActivityTime = ref<Date | null>(null)
  const sessionTimeoutWarning = ref(false)
  const sessionExpired = ref(false)

  // Multi-company Support
  const switchingCompany = ref(false)

  // OTP State
  const otpVerification = ref({
    isVerifying: false,
    verificationMethod: 'email' as 'email' | 'sms',
    contactInfo: '',
    verificationId: '',
    expiresAt: null as Date | null,
    canResend: true,
    resendCooldown: 0,
    attemptsRemaining: 3
  })

  // GSTIN Verification State
  const gstinVerification = ref({
    gstin: '',
    username: '',
    stateCode: '',
    otpId: undefined as string | undefined,
    canResend: true,
    resendCooldown: 0,
    attemptsRemaining: 3,
    expiresAt: null as Date | null,
    otpSent: false
  })

  // Signup Form Data Storage
  const signupFormData = ref<any>(null)

  // Forgot Password State
  const forgotPasswordState = ref({
    currentStep: 'init' as 'init' | 'otp-verification' | 'reset-password',
    emailOrMobile: '',
    verificationId: '',
    otpSent: false,
    otpVerified: false,
    canResend: true,
    resendCooldown: 0,
    attemptsRemaining: 3,
    expiresAt: null as Date | null,
    method: 'email' as 'email' | 'sms'
  })

  // Social Login State
  const socialProvider = ref<SocialProvider | null>(null)

  // Computed Properties
  const isLoading = computed(() => loading.value !== null)
  const hasError = computed(() => error.value !== null)
  const hasSuccess = computed(() => success.value !== null)
  const isSessionValid = computed(() => {
    if (!session.value || !tokens.value) return false
    return new Date() < new Date(tokens.value.expiresIn)
  })
  const timeUntilExpiry = computed(() => {
    if (!tokens.value) return 0
    const now = new Date().getTime()
    const expiry = new Date(tokens.value.expiresIn).getTime()
    return Math.max(0, Math.floor((expiry - now) / (1000 * 60))) // minutes
  })

  // Actions
  const setLoading = (loadingState: AuthLoadingState | null) => {
    loading.value = loadingState
  }

  const setError = (errorState: AuthErrorState | null) => {
    error.value = errorState
    if (errorState) {
      loading.value = null
      success.value = null
    }
  }

  const setSuccess = (successState: AuthSuccessState | null) => {
    success.value = successState
    if (successState) {
      loading.value = null
      error.value = null
    }
  }

  const clearStates = () => {
    loading.value = null
    error.value = null
    success.value = null
  }

  // Forgot Password Step Management
  const setForgotPasswordStep = (step: 'init' | 'otp-verification' | 'reset-password') => {
    forgotPasswordState.value.currentStep = step
  }

  const resetForgotPasswordState = () => {
    forgotPasswordState.value = {
      currentStep: 'init',
      emailOrMobile: '',
      verificationId: '',
      otpSent: false,
      otpVerified: false,
      canResend: true,
      resendCooldown: 0,
      attemptsRemaining: 3,
      expiresAt: null,
      method: 'email'
    }
  }

  // Authentication Actions
  const signIn = async (formData: SignInFormData) => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Signing you in...',
        authStep: 'signing-in'
      })
      
      authStep.value = 'email-input'
      
      // Call real API service
      const result = await authService.signIn(formData)
      
      // Check email verification status
      if (result.user.emailVerified === false || result.emailVerifyStatus === 0) {
        // Email not verified - set up OTP verification for email
        console.log('🔐 Email verification required for signin user:', result.user.email)
        
        otpVerification.value = {
          isVerifying: true,
          verificationMethod: 'email',
          contactInfo: formData.emailOrMobile.includes('@') ? formData.emailOrMobile : result.user.email,
          verificationId: result.verificationId || 'signin-email-verification',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          canResend: true,
          resendCooldown: 0,
          attemptsRemaining: 3
        }

        // Store the user data temporarily (but don't authenticate yet)
        user.value = result.user
        
        // Clear signup data to indicate this is signin flow
        signupFormData.value = null
        
        // Set auth step to OTP verification
        authStep.value = 'otp-verification'

        console.log('🔐 Auth step set to otp-verification for email verification')

        // Don't show success message immediately - let the OTP form handle messaging
        // setSuccess({
        //   type: 'info',
        //   message: 'Please verify your email address to continue',
        //   title: 'Email Verification Required',
        //   duration: 3000
        // })

        return { 
          success: true, 
          emailVerificationRequired: true,
          user: result.user,
          verificationMethod: 'email'
        }
      } else {
        // Email is verified - proceed with normal signin
        user.value = result.user
        isAuthenticated.value = true
        loginTime.value = new Date()
        lastActivityTime.value = new Date()
        authStep.value = 'success'

        // Store auth session data
        authStorage.setAuthSession({
          user: result.user,
          accessToken: result.token
        })

        // Handle remember me preference
        if (formData.rememberMe) {
          localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
          localStorage.setItem(STORAGE_KEYS.LAST_EMAIL, formData.emailOrMobile)
        }

        setSuccess({
          type: 'success',
          message: SUCCESS_MESSAGES.SIGN_IN_SUCCESS,
          title: `Welcome back, ${result.user.firstName}!`,
          showWelcome: true
        })

        return { success: true, user: result.user }
      }
    } catch (err: any) {
      // Error is already transformed by authService
      setError(err)
      throw err
    } finally {
      if (loading.value?.authStep === 'signing-in') {
        setLoading(null)
      }
    }
  }

  const signUp = async (formData: SignUpFormData) => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Creating your account...',
        authStep: 'creating-account'
      })

      signUpStep.value = 'personal-info'
      
      // Call real API service
      const result = await authService.signUp(formData)

      // Set up OTP verification state with real data from API
      otpVerification.value = {
        isVerifying: true,
        verificationMethod: result.verificationMethod,
        contactInfo: formData.email || formData.phoneNumber || '',
        verificationId: result.verificationId,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        canResend: true,
        resendCooldown: 0,
        attemptsRemaining: 3
      }

      // Navigate to OTP verification step
      signUpStep.value = 'verification'
      authStep.value = 'otp-verification'

      setSuccess({
        type: 'info',
        message: `Verification code sent to your ${result.verificationMethod}`,
        title: `Check your ${result.verificationMethod}`
      })

      return { 
        success: true, 
        verificationRequired: result.verificationRequired,
        verificationMethod: result.verificationMethod,
        verificationId: result.verificationId
      }
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      if (loading.value?.authStep === 'creating-account') {
        setLoading(null)
      }
    }
  }

  const verifyOtp = async (otpData: OtpVerificationData) => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Verifying code...',
        authStep: 'verifying-otp'
      })

      // TODO: Implement actual OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (otpData.otp === '123456') { // Mock valid OTP
        const isSignupFlow = Boolean(signupFormData.value)
        
        if (isSignupFlow) {
          // Signup flow - create new user
          const mockUser: User = {
            userId: 'new-user-123',
            email: otpVerification.value.contactInfo,
            firstName: 'New',
            lastName: 'User',
            profilePicture: undefined,
            emailVerified: true,
            phoneVerified: otpData.method === 'sms',
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: new Date(),
            status: 'active',
            role: 'user',
            preferences: {
              language: 'en',
              theme: 'light',
              timezone: 'UTC',
              dateFormat: 'DD/MM/YYYY',
              currency: 'USD',
              notifications: {
                email: true,
                push: true,
                sms: false,
                marketing: false
              }
            }
          }

          user.value = mockUser
          isAuthenticated.value = true
          loginTime.value = new Date()
          lastActivityTime.value = new Date()

          // Store auth session data
          authStorage.setAuthSession({
            user: mockUser,
            accessToken: 'mock-access-token'
          })

          otpVerification.value.isVerifying = false
          signUpStep.value = 'complete'
          
          // Check if user provided GSTIN during signup
          const hasGSTIN = signupFormData.value && signupFormData.value.gstinNumber && signupFormData.value.gstinNumber.trim().length > 0
          
          if (hasGSTIN) {
            // Pre-populate GSTIN verification with signup data
            gstinVerification.value = {
              ...gstinVerification.value,
              gstin: signupFormData.value.gstinNumber,
              username: signupFormData.value.email || signupFormData.value.phoneNumber || '',
              stateCode: signupFormData.value.gstinNumber.substring(0, 2),
              otpSent: false,
              canResend: true,
              resendCooldown: 0,
              attemptsRemaining: 3,
              expiresAt: null,
              otpId: undefined
            }
            
            // Move to GSTIN verification
            authStep.value = 'gstin-verification'

            setSuccess({
              type: 'info',
              message: 'Phone verified! Now verify your GSTIN.',
              title: 'Next: Business Verification',
              duration: 3000
            })
          } else {
            // No GSTIN provided, go directly to success
            authStep.value = 'success'

            setSuccess({
              type: 'success',
              message: 'Account verified successfully!',
              title: 'Welcome to FinCorpX',
              newUser: true
            })
          }
        } else {
          // Signin flow - email verification completed
          console.log('📧 Email verification completed for signin user')
          
          // Create or update user for signin flow
          if (!user.value) {
            // Create a mock user for testing signin flow
            user.value = {
              userId: 'signin-user-123',
              email: otpVerification.value.contactInfo,
              firstName: 'John',
              lastName: 'Doe',
              profilePicture: undefined,
              emailVerified: true,
              phoneVerified: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              lastLoginAt: new Date(),
              status: 'active',
              role: 'user',
              preferences: {
                language: 'en',
                theme: 'light',
                timezone: 'UTC',
                dateFormat: 'DD/MM/YYYY',
                currency: 'USD',
                notifications: {
                  email: true,
                  push: true,
                  sms: false,
                  marketing: false
                }
              }
            }
            console.log('👤 Created mock user for signin flow:', user.value)
          } else {
            // Update existing user email verification status
            user.value.emailVerified = true
            user.value.updatedAt = new Date()
            console.log('✅ Updated existing user email verification status')
          }
          
          // Store auth session data
          authStorage.setAuthSession({
            user: user.value,
            accessToken: 'mock-access-token'
          })

          isAuthenticated.value = true
          loginTime.value = new Date()
          lastActivityTime.value = new Date()
          otpVerification.value.isVerifying = false
          authStep.value = 'success'

          console.log('✅ User authenticated after email verification')
          console.log('🔍 Final auth state:', {
            isAuthenticated: isAuthenticated.value,
            authStep: authStep.value,
            user: user.value?.email,
            loginTime: loginTime.value
          })

          setSuccess({
            type: 'success',
            message: 'Email verified successfully!',
            title: `Welcome back${user.value?.firstName ? `, ${user.value.firstName}` : ''}!`,
            showWelcome: true
          })
        }

        // Clear success state after showing message
        setTimeout(() => {
          clearStates()
        }, 3000)

        return { success: true, user: user.value }
      } else {
        otpVerification.value.attemptsRemaining--
        
        if (otpVerification.value.attemptsRemaining <= 0) {
          setError({
            type: 'client',
            status: 400,
            message: 'Too many failed attempts. Please request a new code.',
            authCode: 'OTP_MAX_ATTEMPTS'
          })
        } else {
          setError({
            type: 'client',
            status: 400,
            message: `Invalid code. ${otpVerification.value.attemptsRemaining} attempts remaining.`,
            authCode: 'OTP_INVALID'
          })
        }
        
        throw new Error('Invalid OTP')
      }
    } catch (err: any) {
      throw err
    } finally {
      if (loading.value?.authStep === 'verifying-otp') {
        setLoading(null)
      }
    }
  }

  const resendOtp = async () => {
    try {
      setLoading({
        type: 'spinner',
        message: 'Sending new code...'
      })

      // TODO: Implement actual OTP resend
      await new Promise(resolve => setTimeout(resolve, 1000))

      otpVerification.value.canResend = false
      otpVerification.value.resendCooldown = 60
      otpVerification.value.attemptsRemaining = 3
      otpVerification.value.expiresAt = new Date(Date.now() + 10 * 60 * 1000)

      // Start cooldown timer
      const timer = setInterval(() => {
        otpVerification.value.resendCooldown--
        if (otpVerification.value.resendCooldown <= 0) {
          otpVerification.value.canResend = true
          clearInterval(timer)
        }
      }, 1000)

      // Show success message temporarily
      setSuccess({
        type: 'info',
        message: 'New verification code sent',
        duration: 2000
      })

      // After 2 seconds, clear the success state and ensure we're back to OTP verification
      setTimeout(() => {
        clearStates() // Clear success state
        authStep.value = 'otp-verification' // Ensure we're in OTP verification step
      }, 2000)

      return { success: true }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 400,
        message: 'Failed to send verification code'
      })
      throw err
    } finally {
      setLoading(null)
    }
  }

  const signInWithSocial = async (provider: SocialProvider) => {
    try {
      setLoading({
        type: 'overlay',
        message: `Signing in with ${provider}...`,
        authStep: 'social-auth'
      })

      socialProvider.value = provider

      // TODO: Implement actual social sign-in with Firebase
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock successful social sign-in
      const mockUser: User = {
        userId: 'social-signin-user-123',
        email: 'signin@example.com',
        firstName: 'Social',
        lastName: 'User',
        profilePicture: 'https://example.com/avatar.jpg',
        emailVerified: true,
        phoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        status: 'active',
        role: 'user',
        preferences: {
          language: 'en',
          theme: 'light',
          timezone: 'UTC',
          dateFormat: 'DD/MM/YYYY',
          currency: 'USD',
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false
          }
        }
      }

      user.value = mockUser
      isAuthenticated.value = true
      loginTime.value = new Date()
      lastActivityTime.value = new Date()
      authStep.value = 'success'

      // Store auth session data for social sign-in
      authStorage.setAuthSession({
        user: mockUser,
        accessToken: 'mock-social-signin-token'
      })

      setSuccess({
        type: 'success',
        message: `Successfully signed in with ${provider}`,
        title: `Welcome back, ${mockUser.firstName}!`,
        showWelcome: true
      })

      return { success: true, user: mockUser }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 401,
        message: `${provider} sign-in failed`,
        authCode: 'SOCIAL_AUTH_FAILED'
      })
      throw err
    } finally {
      socialProvider.value = null
      if (loading.value?.authStep === 'social-auth') {
        setLoading(null)
      }
    }
  }

  const signUpWithSocial = async (provider: SocialProvider) => {
    try {
      setLoading({
        type: 'overlay',
        message: `Creating account with ${provider}...`,
        authStep: 'social-auth'
      })

      socialProvider.value = provider

      // TODO: Implement actual social sign-up with Firebase
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock successful social sign-up
      const mockUser: User = {
        userId: 'social-signup-user-123',
        email: 'signup@example.com',
        firstName: 'Social',
        lastName: 'User',
        profilePicture: 'https://example.com/avatar.jpg',
        emailVerified: true,
        phoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        status: 'active',
        role: 'user',
        preferences: {
          language: 'en',
          theme: 'light',
          timezone: 'UTC',
          dateFormat: 'DD/MM/YYYY',
          currency: 'USD',
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false
          }
        }
      }

      user.value = mockUser
      isAuthenticated.value = true
      loginTime.value = new Date()
      lastActivityTime.value = new Date()
      authStep.value = 'success'

      // Store auth session data for social sign-up
      authStorage.setAuthSession({
        user: mockUser,
        accessToken: 'mock-social-signup-token'
      })

      setSuccess({
        type: 'success',
        message: `Account created successfully with ${provider}`,
        title: `Welcome to FinCorpX, ${mockUser.firstName}!`,
        showWelcome: true,
        newUser: true
      })

      return { success: true, user: mockUser }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 401,
        message: `${provider} sign-up failed`,
        authCode: 'SOCIAL_AUTH_FAILED'
      })
      throw err
    } finally {
      socialProvider.value = null
      if (loading.value?.authStep === 'social-auth') {
        setLoading(null)
      }
    }
  }

  const forgotPassword = async (formData: any) => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Processing password reset...',
        authStep: 'forgot-password' as any
      })

      // TODO: Implement actual forgot password logic
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSuccess({
        type: 'success',
        message: 'Password reset successful! You can now sign in with your new password.',
        title: 'Password Reset Complete'
      })

      return { success: true }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 400,
        message: err.message || 'Password reset failed'
      })
      throw err
    } finally {
      if (loading.value?.authStep === 'forgot-password') {
        setLoading(null)
      }
    }
  }

  const sendForgotPasswordOtp = async (data: { emailOrMobile: string }) => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Sending verification code...',
        authStep: 'forgot-password' as any
      })

      // Update forgot password state
      forgotPasswordState.value.emailOrMobile = data.emailOrMobile

      // TODO: Implement actual OTP sending logic
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock verification ID - in real implementation, this would come from the backend
      const verificationId = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const method = data.emailOrMobile.includes('@') ? 'email' : 'sms'
      const maskedContact = data.emailOrMobile.includes('@') 
        ? data.emailOrMobile.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + gp3.replace(/./g, '*'))
        : data.emailOrMobile.replace(/(\d{2})(\d*)(\d{2})/, '$1' + '*'.repeat(Math.max(0, data.emailOrMobile.length - 4)) + '$3')

      // Update forgot password state
      forgotPasswordState.value.verificationId = verificationId
      forgotPasswordState.value.method = method
      forgotPasswordState.value.otpSent = true

      setSuccess({
        type: 'success',
        message: `Verification code sent to your ${method}: ${maskedContact}`,
        title: 'Code Sent Successfully',
        duration: 500 // Shorter duration to prevent unmounting
      })

      // Auto-advance to OTP verification step after success message
      setTimeout(() => {
        setForgotPasswordStep('otp-verification')
        setSuccess(null) // Clear success state
      }, 3000) // 3 seconds to match your existing timing

      return { 
        success: true, 
        verificationId,
        method,
        maskedContact
      }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 400,
        message: err.message || 'Failed to send verification code'
      })
      throw err
    } finally {
      if (loading.value?.authStep === 'forgot-password') {
        setLoading(null)
      }
    }
  }

  const verifyForgotPasswordOtp = async (data: { emailOrMobile: string; otp: string; verificationId: string }) => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Verifying code...',
        authStep: 'forgot-password' as any
      })

      // TODO: Implement actual OTP verification logic
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock verification - in real implementation, verify against backend
      if (data.otp === '123456' || data.otp.length === 6) {
        // Update forgot password state
        forgotPasswordState.value.otpVerified = true

        setSuccess({
          type: 'success',
          message: 'Code verified successfully! You can now set your new password.',
          title: 'Verification Successful',
          duration: 500 // Shorter duration to prevent unmounting
        })

        // Auto-advance to password reset step after success message
        setTimeout(() => {
          setForgotPasswordStep('reset-password')
          setSuccess(null) // Clear success state
        }, 3000) // 3 seconds to match your existing timing

        return { success: true }
      } else {
        throw new Error('Invalid verification code. Please try again.')
      }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 400,
        message: err.message || 'Verification failed'
      })
      throw err
    } finally {
      if (loading.value?.authStep === 'forgot-password') {
        setLoading(null)
      }
    }
  }

  const resetPasswordWithOtp = async (data: { 
    emailOrMobile: string; 
    otp: string; 
    verificationId: string; 
    newPassword: string; 
    confirmPassword: string 
  }) => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Resetting your password...',
        authStep: 'forgot-password' as any
      })

      // TODO: Implement actual password reset logic
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSuccess({
        type: 'success',
        message: 'Password reset successful! You can now sign in with your new password.',
        title: 'Password Reset Complete',
        duration: 2000 // 2 seconds duration to allow redirect
      })

      return { success: true }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 400,
        message: err.message || 'Password reset failed'
      })
      throw err
    } finally {
      if (loading.value?.authStep === 'forgot-password') {
        setLoading(null)
      }
    }
  }

  const sendPasswordResetEmail = async (email: string) => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Sending password reset email...',
        authStep: 'forgot-password' as any
      })

      // TODO: Implement actual email sending logic
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSuccess({
        type: 'success',
        message: `Password reset email sent to ${email}. Please check your inbox and follow the instructions.`,
        title: 'Email Sent Successfully'
      })

      return { success: true }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 400,
        message: err.message || 'Failed to send password reset email'
      })
      throw err
    } finally {
      if (loading.value?.authStep === 'forgot-password') {
        setLoading(null)
      }
    }
  }

  const signOut = async () => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Signing out...'
      })

      // TODO: Implement actual sign-out logic
      await new Promise(resolve => setTimeout(resolve, 500))

      // Clear all state
      user.value = null
      currentCompany.value = null
      userCompanies.value = []
      session.value = null
      tokens.value = null
      isAuthenticated.value = false
      authStep.value = 'idle'
      signUpStep.value = 'personal-info'
      loginTime.value = null
      lastActivityTime.value = null
      sessionTimeoutWarning.value = false
      sessionExpired.value = false
      otpVerification.value = {
        isVerifying: false,
        verificationMethod: 'email',
        contactInfo: '',
        verificationId: '',
        expiresAt: null,
        canResend: true,
        resendCooldown: 0,
        attemptsRemaining: 3
      }

      // Use proper storage utilities to clear auth data
      authStorage.clearAll()

      clearStates()

      return { success: true }
    } catch (err: any) {
      console.error('Auth store signOut error:', err)
      // Still clear state even if there's an error
      user.value = null
      isAuthenticated.value = false
      authStorage.clearAll()
      throw err
    } finally {
      setLoading(null)
    }
  }

  const switchCompany = async (companyId: string) => {
    try {
      switchingCompany.value = true
      setLoading({
        type: 'overlay',
        message: 'Switching company...',
        authStep: 'switching-company'
      })

      // TODO: Implement actual company switching
      await new Promise(resolve => setTimeout(resolve, 1500))

      const mockCompany: Company = {
        companyId,
        name: 'New Company',
        domain: 'newcompany.com',
        subscription: {
          planId: 'basic',
          name: 'Basic Plan',
          type: 'basic',
          features: ['feature1', 'feature2'],
          limits: {
            users: 10,
            storage: 5,
            transactions: 1000,
            apiCalls: 10000
          }
        },
        settings: {
          allowSocialLogin: true,
          requireTwoFactor: false,
          sessionTimeout: 30,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true
          }
        },
        createdAt: new Date(),
        status: 'active'
      }

      currentCompany.value = mockCompany
      localStorage.setItem(STORAGE_KEYS.CURRENT_COMPANY, JSON.stringify(mockCompany))

      setSuccess({
        type: 'success',
        message: SUCCESS_MESSAGES.COMPANY_SWITCHED,
        companyName: mockCompany.name
      })

      return { success: true, company: mockCompany }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 403,
        message: 'Failed to switch company',
        authCode: 'COMPANY_ACCESS_DENIED'
      })
      throw err
    } finally {
      switchingCompany.value = false
      if (loading.value?.authStep === 'switching-company') {
        setLoading(null)
      }
    }
  }

  const updateLastActivity = () => {
    lastActivityTime.value = new Date()
  }

  const checkSessionValidity = () => {
    if (!isSessionValid.value) {
      sessionExpired.value = true
      signOut()
    } else if (timeUntilExpiry.value <= 5) { // 5 minutes warning
      sessionTimeoutWarning.value = true
    }
  }

  const extendSession = async () => {
    try {
      // TODO: Implement session extension/token refresh
      if (tokens.value) {
        tokens.value.expiresIn = Date.now() + (30 * 60 * 1000) // Extend by 30 minutes
        sessionTimeoutWarning.value = false
      }
    } catch (err) {
      console.error('Failed to extend session:', err)
    }
  }

  const resetAuthFlow = () => {
    authStep.value = 'idle'
    signUpStep.value = 'personal-info'
    otpVerification.value = {
      isVerifying: false,
      verificationMethod: 'email',
      contactInfo: '',
      verificationId: '',
      expiresAt: null,
      canResend: true,
      resendCooldown: 0,
      attemptsRemaining: 3
    }
    
    // Clear temporarily stored user data if not authenticated
    if (!isAuthenticated.value) {
      user.value = null
    }
    
    clearStates()
  }

  const setAuthStep = (step: AuthStep) => {
    authStep.value = step
  }

  const setOtpVerificationState = (state: Partial<typeof otpVerification.value>) => {
    otpVerification.value = { ...otpVerification.value, ...state }
  }

  const setSignupFormData = (data: any) => {
    signupFormData.value = data
  }

  // GSTIN Verification Actions
  const sendGSTINOTP = async (gstinData: { gstin: string; username: string; stateCode: string }) => {
    try {
      setLoading({
        type: 'spinner',
        message: 'Sending GSTIN verification code...'
      })

      // TODO: Implement actual GSTIN OTP sending using existing GSTIN service
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update GSTIN verification state
      gstinVerification.value = {
        ...gstinVerification.value,
        gstin: gstinData.gstin,
        username: gstinData.username,
        stateCode: gstinData.stateCode,
        otpSent: true,
        canResend: false,
        resendCooldown: 60,
        attemptsRemaining: 3,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        otpId: 'mock-otp-id-123'
      }

      // Start cooldown timer
      const timer = setInterval(() => {
        gstinVerification.value.resendCooldown--
        if (gstinVerification.value.resendCooldown <= 0) {
          gstinVerification.value.canResend = true
          clearInterval(timer)
        }
      }, 1000)

      setSuccess({
        type: 'info',
        message: 'GSTIN verification code sent successfully',
        duration: 3000
      })

      // Clear success state after showing message
      setTimeout(() => {
        clearStates()
      }, 3000)

      return { success: true, otpId: 'mock-otp-id-123' }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 400,
        message: err.message || 'Failed to send GSTIN verification code'
      })
      throw err
    } finally {
      setLoading(null)
    }
  }

  const verifyGSTINOTP = async (verificationData: { gstin: string; otp: string; username: string; stateCode: string; otpId?: string }) => {
    try {
      setLoading({
        type: 'overlay',
        message: 'Verifying GSTIN...',
        authStep: 'verifying-gstin' as any
      })

      // TODO: Implement actual GSTIN OTP verification using existing GSTIN service
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (verificationData.otp === '123456') { // Mock valid OTP
        // GSTIN verification successful - immediately set auth step to success
        authStep.value = 'success'
        
        // Show success message
        setSuccess({
          type: 'success',
          message: 'GSTIN verified successfully!',
          title: 'GSTIN Registration Verified',
          newUser: true
        })

        return { success: true, verified: true }
      } else {
        gstinVerification.value.attemptsRemaining--
        
        if (gstinVerification.value.attemptsRemaining <= 0) {
          setError({
            type: 'client',
            status: 400,
            message: 'Too many failed attempts. Please request a new code.',
            authCode: 'OTP_MAX_ATTEMPTS'
          })
        } else {
          setError({
            type: 'client',
            status: 400,
            message: `Invalid GSTIN code. ${gstinVerification.value.attemptsRemaining} attempts remaining.`,
            authCode: 'OTP_INVALID'
          })
        }
        
        throw new Error('Invalid GSTIN OTP')
      }
    } catch (err: any) {
      throw err
    } finally {
      if (loading.value?.authStep === 'verifying-gstin') {
        setLoading(null)
      }
    }
  }

  const resendGSTINOTP = async () => {
    try {
      setLoading({
        type: 'spinner',
        message: 'Sending new GSTIN code...'
      })

      // TODO: Implement actual GSTIN OTP resend
      await new Promise(resolve => setTimeout(resolve, 1000))

      gstinVerification.value.canResend = false
      gstinVerification.value.resendCooldown = 60
      gstinVerification.value.attemptsRemaining = 3
      gstinVerification.value.expiresAt = new Date(Date.now() + 10 * 60 * 1000)

      // Start cooldown timer
      const timer = setInterval(() => {
        gstinVerification.value.resendCooldown--
        if (gstinVerification.value.resendCooldown <= 0) {
          gstinVerification.value.canResend = true
          clearInterval(timer)
        }
      }, 1000)

      setSuccess({
        type: 'info',
        message: 'New GSTIN verification code sent',
        duration: 2000
      })

      // Clear success state after showing message
      setTimeout(() => {
        clearStates()
      }, 2000)

      return { success: true }
    } catch (err: any) {
      setError({
        type: 'client',
        status: 400,
        message: 'Failed to send GSTIN verification code'
      })
      throw err
    } finally {
      setLoading(null)
    }
  }

  // Initialize from localStorage
  const initializeFromStorage = () => {
    try {
      // Use the proper storage utilities
      const authData = authStorage.initialize()
      
      // Enhanced validation: check if authentication data is valid and not expired
      if (authData.user && authData.hasTokens) {
        // Additional validation: check if user data is complete and valid
        const isValidUser = authData.user.userId && 
                           authData.user.email && 
                           authData.user.firstName && 
                           authData.user.status === 'active'
        
        if (isValidUser) {
          user.value = authData.user
          isAuthenticated.value = true
          
          // Set company data if available
          if (authData.currentCompany) {
            currentCompany.value = authData.currentCompany
          }
          
          // Update activity time
          lastActivityTime.value = new Date()
          
          console.log('User authenticated from storage:', authData.user.email)
        } else {
          console.log('Invalid user data found, clearing authentication')
          authStorage.clearAll()
          user.value = null
          currentCompany.value = null
          isAuthenticated.value = false
        }
      } else {
        // No valid authentication data - ensure clean state
        user.value = null
        currentCompany.value = null
        isAuthenticated.value = false
        
        // Clear any partial/invalid auth data
        if (authData.user && !authData.hasTokens) {
          console.log('Clearing invalid auth data (user without tokens)')
          authStorage.clearAll()
        }
        
        console.log('No valid authentication found in storage')
      }
      
    } catch (err) {
      console.error('Failed to initialize from storage:', err)
      // Clear all auth data on error
      authStorage.clearAll()
      user.value = null
      currentCompany.value = null
      isAuthenticated.value = false
    }
  }

  return {
    // State
    user: readonly(user),
    currentCompany: readonly(currentCompany),
    userCompanies: readonly(userCompanies),
    session: readonly(session),
    tokens: readonly(tokens),
    isAuthenticated: readonly(isAuthenticated),
    authStep: readonly(authStep),
    signUpStep: readonly(signUpStep),
    loading: readonly(loading),
    error: readonly(error),
    success: readonly(success),
    loginTime: readonly(loginTime),
    lastActivityTime: readonly(lastActivityTime),
    sessionTimeoutWarning: readonly(sessionTimeoutWarning),
    sessionExpired: readonly(sessionExpired),
    switchingCompany: readonly(switchingCompany),
    otpVerification: readonly(otpVerification),
    gstinVerification: readonly(gstinVerification),
    signupFormData: readonly(signupFormData),
    forgotPasswordState: readonly(forgotPasswordState),
    socialProvider: readonly(socialProvider),

    // Computed
    isLoading,
    hasError,
    hasSuccess,
    isSessionValid,
    timeUntilExpiry,

    // Actions
    setLoading,
    setError,
    setSuccess,
    clearStates,
    setForgotPasswordStep,
    resetForgotPasswordState,
    signIn,
    signUp,
    verifyOtp,
    resendOtp,
    sendGSTINOTP,
    verifyGSTINOTP,
    resendGSTINOTP,
    signInWithSocial,
    signUpWithSocial,
    forgotPassword,
    sendForgotPasswordOtp,
    verifyForgotPasswordOtp,
    resetPasswordWithOtp,
    sendPasswordResetEmail,
    signOut,
    switchCompany,
    updateLastActivity,
    checkSessionValidity,
    extendSession,
    resetAuthFlow,
    setAuthStep,
    setOtpVerificationState,
    setSignupFormData,
    initializeFromStorage
  }
})
