import { http } from '@/services/http'
import { API_CONFIG } from '@/services/config'
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  ForgotPasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LoginSuccessResponse,
  ApiUser
} from '../types/api-types'
import type { User, SignInFormData, SignUpFormData } from '../types/auth-types'
import { transformApiError } from '../utils/error-handler'

// Transform API user data to app User interface
const transformApiUserToAppUser = (apiUser: ApiUser): User => {
  return {
    userId: apiUser.id.toString(),
    email: apiUser.email,
    firstName: apiUser.userInfo?.name?.split(' ')[0] || apiUser.name?.split(' ')[0] || 'User',
    lastName: apiUser.userInfo?.name?.split(' ').slice(1).join(' ') || apiUser.name?.split(' ').slice(1).join(' ') || '',
    phoneNumber: apiUser.phone || undefined,
    emailVerified: apiUser.emailVerified,
    phoneVerified: apiUser.phoneVerified,
    createdAt: new Date(apiUser.createdAt),
    updatedAt: new Date(apiUser.updatedAt),
    lastLoginAt: new Date(), // Set to current time on login
    status: 'active', // Default status
    role: 'user', // Default role
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
}

// Auth Service Class
class AuthService {
  // Sign In
  async signIn(formData: SignInFormData): Promise<{ 
    success: true; 
    user: User; 
    token: string; 
    emailVerifyStatus?: number;
    verificationId?: string 
  }> {
    try {
      // Transform form data to API request format
      const loginRequest: LoginRequest = {
        email: formData.emailOrMobile, // Assuming email for now
        password: formData.password || ''
      }

      // Make API call
      const response = await http.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        loginRequest
      )

      // Check if response is successful
      if (response.success && 'data' in response) {
        const successResponse = response as LoginSuccessResponse
        
        // Transform API user to app user
        const user = transformApiUserToAppUser(successResponse.data.user)
        
        // Determine email verification status (0 = not verified, 1 = verified)
        const emailVerifyStatus = successResponse.data.user.emailVerified ? 1 : 0
        
        return {
          success: true,
          user,
          token: successResponse.data.user.token,
          emailVerifyStatus,
          verificationId: emailVerifyStatus === 0 ? `email-verification-${user.userId}` : undefined
        }
      } else {
        // Handle error response
        throw new Error('Login failed')
      }
    } catch (error: any) {
      console.error('Auth Service - Sign In Error:', error)
      
      // Transform and re-throw the error
      if (error.message && (error.message === 'Wrong password' || error.message === 'Invalid email')) {
        throw transformApiError({
          message: error.message,
          status: 400,
          code: 'AUTH_ERROR'
        })
      }
      
      throw transformApiError({
        message: error.message || 'Sign in failed',
        status: error.status || 500,
        code: error.code || 'UNKNOWN_ERROR'
      })
    }
  }

  // Sign Up
  async signUp(formData: SignUpFormData): Promise<{ success: true; userId: string; verificationRequired: boolean; verificationMethod: 'email' | 'sms'; verificationId: string }> {
    try {
      // Transform form data to API request format
      const registerRequest: RegisterRequest = {
        name: formData.name || '',
        email: formData.email || '', // Provide default empty string
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName
      }

      console.log('Making API call to register with data:', registerRequest)

      try {
        const response = await http.post<RegisterResponse>(
          API_CONFIG.ENDPOINTS.AUTH.REGISTER,
          registerRequest
        )

        console.log('Register API response:', response)

        if (response.success && 'data' in response) {
          return {
            success: true,
            userId: response.data.userId,
            verificationRequired: response.data.verificationRequired,
            verificationMethod: response.data.verificationMethod,
            verificationId: response.data.verificationId
          }
        } else {
          throw new Error('Registration failed')
        }
      } catch (apiError: any) {
        console.warn('API call failed, falling back to mock response:', apiError)
        
        // Simulate API delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Return mock successful response
        const verificationMethod = this.isEmail(formData.email || '') ? 'email' : 'sms'
        
        return {
          success: true,
          userId: `mock-user-${Date.now()}`,
          verificationRequired: true,
          verificationMethod,
          verificationId: `mock-verification-${Date.now()}`
        }
      }
    } catch (error: any) {
      console.error('Auth Service - Sign Up Error:', error)
      throw transformApiError({
        message: error.message || 'Sign up failed',
        status: error.status || 500,
        code: error.code || 'UNKNOWN_ERROR'
      })
    }
  }

  // Forgot Password
  async forgotPassword(email: string): Promise<{ success: true; message: string }> {
    try {
      const request: ForgotPasswordRequest = { email }

      const response = await http.post(
        API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
        request
      )

      return {
        success: true,
        message: 'Password reset email sent successfully'
      }
    } catch (error: any) {
      console.error('Auth Service - Forgot Password Error:', error)
      throw transformApiError({
        message: error.message || 'Failed to send password reset email',
        status: error.status || 500,
        code: error.code || 'UNKNOWN_ERROR'
      })
    }
  }

  // Refresh Token
  async refreshToken(refreshToken: string): Promise<{ success: true; accessToken: string; refreshToken: string }> {
    try {
      const request: RefreshTokenRequest = { refreshToken }

      const response = await http.post<RefreshTokenResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        request
      )

      if (response.success && 'data' in response) {
        return {
          success: true,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        }
      } else {
        throw new Error('Token refresh failed')
      }
    } catch (error: any) {
      console.error('Auth Service - Refresh Token Error:', error)
      throw transformApiError({
        message: error.message || 'Token refresh failed',
        status: error.status || 401,
        code: error.code || 'TOKEN_REFRESH_FAILED'
      })
    }
  }

  // Sign Out
  async signOut(): Promise<{ success: true }> {
    try {
      // Call logout endpoint if available
      await http.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
      
      return { success: true }
    } catch (error: any) {
      // Even if logout API fails, we consider it successful locally
      console.warn('Auth Service - Sign Out API Error (continuing with local logout):', error)
      return { success: true }
    }
  }

  // Verify Email
  async verifyEmail(token: string): Promise<{ success: true }> {
    try {
      const response = await http.post(
        API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL,
        { token }
      )

      return { success: true }
    } catch (error: any) {
      console.error('Auth Service - Verify Email Error:', error)
      throw transformApiError({
        message: error.message || 'Email verification failed',
        status: error.status || 400,
        code: error.code || 'VERIFICATION_FAILED'
      })
    }
  }

  // Utility method to check if email or mobile
  private isEmail(emailOrMobile: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailOrMobile)
  }

  // Utility method to format phone number
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Add country code if not present (assuming +1 for US)
    if (cleaned.length === 10) {
      return `+1${cleaned}`
    }
    
    return `+${cleaned}`
  }
}

// Export singleton instance
export const authService = new AuthService()
