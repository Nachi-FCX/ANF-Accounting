// GSTIN API Service - API Integration

import { http } from '@/services/http'
import { API_CONFIG } from '@/services/config'
import type {
  FetchGstinDetailsResponse,
  SendGstinOtpRequest,
  SendGstinOtpResponse,
  VerifyGstinOtpRequest,
  VerifyGstinOtpResponse,
  GstinApiError
} from '@/types/common'

class GstinApiService {
  /**
   * Fetch company details by GSTIN
   */
  async fetchGstinDetails(gstin: string): Promise<FetchGstinDetailsResponse> {
    try {
      const response = await http.get<FetchGstinDetailsResponse>(
        `${API_CONFIG.ENDPOINTS.COMPANY.FETCH_DETAILS}?gstin=${gstin}`
      )

      if (!response.success) {
        throw new Error('Company not found')
      }

      return response
    } catch (error: any) {
      console.error('GSTIN API Service - Fetch Details Error:', error)
      
      throw this.transformApiError({
        message: error.message || 'Failed to fetch GSTIN details',
        status: error.status || 500,
        code: error.code || 'FETCH_GSTIN_ERROR'
      })
    }
  }

  /**
   * Send OTP for GSTIN verification
   */
  async sendGstinOtp(data: SendGstinOtpRequest): Promise<SendGstinOtpResponse> {
    try {
      const response = await http.post<SendGstinOtpResponse>(
        API_CONFIG.ENDPOINTS.COMPANY.SEND_OTP,
        data
      )

      if (response.success) {
        return response
      } else {
        throw new Error('Failed to send OTP')
      }
    } catch (error: any) {
      console.error('GSTIN API Service - Send OTP Error:', error)
      
      throw this.transformApiError({
        message: error.message || 'Failed to send OTP',
        status: error.status || 500,
        code: error.code || 'SEND_OTP_ERROR'
      })
    }
  }

  /**
   * Verify OTP for GSTIN registration
   */
  async verifyGstinOtp(data: VerifyGstinOtpRequest): Promise<VerifyGstinOtpResponse> {
    try {
      const response = await http.post<VerifyGstinOtpResponse>(
        API_CONFIG.ENDPOINTS.COMPANY.VERIFY_OTP,
        data
      )

      if (response.success) {
        return response
      } else {
        throw new Error('OTP verification failed')
      }
    } catch (error: any) {
      console.error('GSTIN API Service - Verify OTP Error:', error)
      
      throw this.transformApiError({
        message: error.message || 'Failed to verify OTP',
        status: error.status || 500,
        code: error.code || 'VERIFY_OTP_ERROR'
      })
    }
  }

  /**
   * Check if GSTIN API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      await http.get(`${API_CONFIG.ENDPOINTS.COMPANY.FETCH_DETAILS}?gstin=health-check`)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Transform API errors to consistent format
   */
  private transformApiError(error: GstinApiError): GstinApiError {
    return {
      message: error.message,
      status: error.status,
      code: error.code
    }
  }
}

// Export singleton instance
export const gstinApiService = new GstinApiService()
export default gstinApiService
