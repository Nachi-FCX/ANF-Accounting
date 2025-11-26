// GSTIN Accounts API Service

import { http } from '@/services/http'
import { API_CONFIG } from '@/services/config'
import type {
  GstinAccountsResponse,
  GstinAccountsApiError,
  GstinAccount
} from '../types/gstin-accounts-types'

class GstinAccountsService {
  /**
   * Fetch GSTIN accounts for a specific account ID
   */
  async fetchGstinAccounts(accountId: number = 2): Promise<GstinAccountsResponse> {
    try {
      const response = await http.get<GstinAccountsResponse>(
        `${API_CONFIG.BASE_URL}/accounts/get-gst?accountId=${accountId}`
      )

      if (response.success && response.accounts) {
        return {
          success: true,
          accounts: response.accounts,
          message: response.message
        }
      } else {
        throw new Error('Failed to fetch GSTIN accounts')
      }
    } catch (error: any) {
      console.error('GSTIN Accounts Service - Fetch Error:', error)
      
      throw this.transformApiError({
        message: error.message || 'Failed to fetch GSTIN accounts',
        status: error.status || 500,
        code: error.code || 'FETCH_GSTIN_ACCOUNTS_ERROR'
      })
    }
  }

  /**
   * Search GSTIN accounts by query
   */
  async searchGstinAccounts(query: string, accountId: number = 2): Promise<GstinAccount[]> {
    try {
      const response = await this.fetchGstinAccounts(accountId)
      
      if (!response.success || !response.accounts) {
        return []
      }

      // Filter accounts based on search query
      const searchQuery = query.toLowerCase().trim()
      if (!searchQuery) {
        return response.accounts
      }

      return response.accounts.filter(account => 
        account.companyName.toLowerCase().includes(searchQuery) ||
        account.gstin.toLowerCase().includes(searchQuery) ||
        account.stateCode.toLowerCase().includes(searchQuery) ||
        account.username.toLowerCase().includes(searchQuery)
      )
    } catch (error: any) {
      console.error('GSTIN Accounts Service - Search Error:', error)
      throw error
    }
  }

  /**
   * Get GSTIN account by ID
   */
  async getGstinAccountById(id: number, accountId: number = 2): Promise<GstinAccount | null> {
    try {
      const response = await this.fetchGstinAccounts(accountId)
      
      if (!response.success || !response.accounts) {
        return null
      }

      return response.accounts.find(account => account.id === id) || null
    } catch (error: any) {
      console.error('GSTIN Accounts Service - Get By ID Error:', error)
      return null
    }
  }

  /**
   * Get GSTIN account by GSTIN number
   */
  async getGstinAccountByGstin(gstin: string, accountId: number = 2): Promise<GstinAccount | null> {
    try {
      const response = await this.fetchGstinAccounts(accountId)
      
      if (!response.success || !response.accounts) {
        return null
      }

      return response.accounts.find(account => account.gstin === gstin) || null
    } catch (error: any) {
      console.error('GSTIN Accounts Service - Get By GSTIN Error:', error)
      return null
    }
  }

  /**
   * Filter accounts by state code
   */
  async getGstinAccountsByState(stateCode: string, accountId: number = 2): Promise<GstinAccount[]> {
    try {
      const response = await this.fetchGstinAccounts(accountId)
      
      if (!response.success || !response.accounts) {
        return []
      }

      return response.accounts.filter(account => account.stateCode === stateCode)
    } catch (error: any) {
      console.error('GSTIN Accounts Service - Get By State Error:', error)
      return []
    }
  }

  /**
   * Get accounts that need reconciliation (lastReconciled is null)
   */
  async getUnreconciledAccounts(accountId: number = 2): Promise<GstinAccount[]> {
    try {
      const response = await this.fetchGstinAccounts(accountId)
      
      if (!response.success || !response.accounts) {
        return []
      }

      return response.accounts.filter(account => account.lastReconciled === null)
    } catch (error: any) {
      console.error('GSTIN Accounts Service - Get Unreconciled Error:', error)
      return []
    }
  }

  /**
   * Fetch GSTIN details for registration (new GSTIN)
   */
  async fetchGstinDetailsForRegistration(gstin: string): Promise<any> {
    try {
      const response = await http.get<any>(
        `${API_CONFIG.ENDPOINTS.COMPANY.FETCH_DETAILS}?gstin=${gstin}`
      )

      if (response.success && response.data) {
        return response
      } else {
        throw new Error('Failed to fetch GSTIN details')
      }
    } catch (error: any) {
      console.error('GSTIN Service - Fetch Details Error:', error)
      
      throw this.transformApiError({
        message: error.message || 'Failed to fetch GSTIN details',
        status: error.status || 500,
        code: error.code || 'FETCH_DETAILS_ERROR'
      })
    }
  }

  /**
   * Send OTP for GSTIN verification
   */
  async sendOtp(data: { username: string; gstin: string; stateCode: string }): Promise<any> {
    try {
      const response = await http.post<any>(
        API_CONFIG.ENDPOINTS.COMPANY.SEND_OTP,
        data
      )

      if (response.success) {
        return response
      } else {
        throw new Error('Failed to send OTP')
      }
    } catch (error: any) {
      console.error('GSTIN Service - Send OTP Error:', error)
      
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
  async verifyOtp(data: { username: string; gstin: string; stateCode: string; otp: string }): Promise<any> {
    try {
      const response = await http.post<any>(
        API_CONFIG.ENDPOINTS.COMPANY.VERIFY_OTP,
        data
      )

      if (response.success) {
        return response
      } else {
        throw new Error('OTP verification failed')
      }
    } catch (error: any) {
      console.error('GSTIN Service - Verify OTP Error:', error)
      
      throw this.transformApiError({
        message: error.message || 'Failed to verify OTP',
        status: error.status || 500,
        code: error.code || 'VERIFY_OTP_ERROR'
      })
    }
  }

  /**
   * Check if GSTIN accounts API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.fetchGstinAccounts(2)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Transform API errors to consistent format
   */
  private transformApiError(error: GstinAccountsApiError): GstinAccountsApiError {
    return {
      message: error.message,
      status: error.status,
      code: error.code
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string | null): string {
    if (!dateString) {
      return 'Unavailable'
    }

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  /**
   * Get reconciliation status
   */
  getReconciliationStatus(account: GstinAccount): 'available' | 'unavailable' | 'pending' {
    if (account.lastReconciled) {
      return 'available'
    }
    
    if (account.lastImsInvoiceSync || account.lastUserInvoiceUpload) {
      return 'pending'
    }
    
    return 'unavailable'
  }
}

// Export singleton instance
export const gstinAccountsService = new GstinAccountsService()
export default gstinAccountsService
