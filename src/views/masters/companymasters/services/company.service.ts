// Company Service - API Integration

import { http } from '@/services/http'
import { API_CONFIG } from '@/services/config'
import type {
  FetchCompanyDetailsRequest,
  FetchCompanyDetailsResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ApiError
} from '../types/api-types'
import { ERROR_MESSAGES } from '../constants/company-constants'
import { transformCompanyApiError } from '../utils/error-handler'

class CompanyService {
  /**
   * Fetch company details by GSTIN
   */
  async fetchCompanyDetails(gstin: string): Promise<FetchCompanyDetailsResponse> {
    try {
      const response = await http.get<FetchCompanyDetailsResponse>(
        `${API_CONFIG.ENDPOINTS.COMPANY.FETCH_DETAILS}?gstin=${gstin}`
      )

      if (!response.success) {
        throw new Error(ERROR_MESSAGES.COMPANY_NOT_FOUND)
      }

      return response
    } catch (error: any) {
      console.error('Company Service - Fetch Details Error:', error)
      
      // Transform and re-throw the error
      throw transformCompanyApiError({
        message: error.message || 'Failed to fetch company details',
        status: error.status || 500,
        code: error.code || 'FETCH_DETAILS_ERROR'
      })
    }
  }

  /**
   * Send OTP for company verification
   */
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    try {
      const response = await http.post<SendOtpResponse>(
        API_CONFIG.ENDPOINTS.COMPANY.SEND_OTP,
        data
      )

      // Check if response is successful
      if (response.success) {
        return response
      } else {
        // Handle error response
        throw new Error('Failed to send OTP')
      }
    } catch (error: any) {
      console.error('Company Service - Send OTP Error:', error)
      
      // Transform and re-throw the error
      throw transformCompanyApiError({
        message: error.message || 'Failed to send OTP',
        status: error.status || 500,
        code: error.code || 'SEND_OTP_ERROR'
      })
    }
  }

  /**
   * Verify OTP for company registration
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    try {
      const response = await http.post<VerifyOtpResponse>(
        API_CONFIG.ENDPOINTS.COMPANY.VERIFY_OTP,
        data
      )

      // Check if response is successful
      if (response.success) {
        return response
      } else {
        // Handle error response
        throw new Error('OTP verification failed')
      }
    } catch (error: any) {
      console.error('Company Service - Verify OTP Error:', error)
      
      // Transform and re-throw the error
      throw transformCompanyApiError({
        message: error.message || 'Failed to verify OTP',
        status: error.status || 500,
        code: error.code || 'VERIFY_OTP_ERROR'
      })
    }
  }

  /**
   * Check if API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Simple health check by making a request to the base API
      await http.get(`${API_CONFIG.ENDPOINTS.COMPANY.FETCH_DETAILS}?gstin=health-check`)
      return true
    } catch (error) {
      return false
    }
  }
}

// Export singleton instance
export const companyService = new CompanyService()
export default companyService
