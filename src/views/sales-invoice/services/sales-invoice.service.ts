/**
 * Sales Invoice API Service
 * Handles all API operations for sales invoices
 */

import { http } from '@/services/http'
import { API_CONFIG } from '@/services/config'
import type {
  SalesInvoice,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceFilters,
  ApiResponse,
  ApiError,
  PaginatedResponse,
  InvoiceStats
} from '../types/sales-invoice-types'

class SalesInvoiceService {
  /**
   * Fetch all sales invoices with optional filters
   */
  async fetchInvoices(filters?: InvoiceFilters): Promise<SalesInvoice[]> {
    try {
      const response = await http.get<ApiResponse<SalesInvoice[]>>(
        `${API_CONFIG.BASE_URL}/sales-invoices`,
        { params: filters }
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch invoices')
    } catch (error: any) {
      console.error('Sales Invoice Service - Fetch Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to fetch invoices',
        status: error.status || 500,
        code: error.code || 'FETCH_INVOICES_ERROR'
      })
    }
  }

  /**
   * Fetch paginated invoices
   */
  async fetchPaginatedInvoices(
    page: number = 1,
    pageSize: number = 10,
    filters?: InvoiceFilters
  ): Promise<PaginatedResponse<SalesInvoice>> {
    try {
      const response = await http.get<ApiResponse<PaginatedResponse<SalesInvoice>>>(
        `${API_CONFIG.BASE_URL}/sales-invoices/paginated`,
        { 
          params: { 
            page, 
            pageSize,
            ...filters 
          } 
        }
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch paginated invoices')
    } catch (error: any) {
      console.error('Sales Invoice Service - Fetch Paginated Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to fetch paginated invoices',
        status: error.status || 500,
        code: error.code || 'FETCH_PAGINATED_INVOICES_ERROR'
      })
    }
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(id: number): Promise<SalesInvoice> {
    try {
      const response = await http.get<ApiResponse<SalesInvoice>>(
        `${API_CONFIG.BASE_URL}/sales-invoices/${id}`
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Invoice not found')
    } catch (error: any) {
      console.error('Sales Invoice Service - Get By ID Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to fetch invoice',
        status: error.status || 404,
        code: error.code || 'GET_INVOICE_ERROR'
      })
    }
  }

  /**
   * Create new sales invoice
   */
  async createInvoice(data: CreateInvoiceData): Promise<SalesInvoice> {
    try {
      const response = await http.post<ApiResponse<SalesInvoice>>(
        `${API_CONFIG.BASE_URL}/sales-invoices`,
        data
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to create invoice')
    } catch (error: any) {
      console.error('Sales Invoice Service - Create Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to create invoice',
        status: error.status || 500,
        code: error.code || 'CREATE_INVOICE_ERROR'
      })
    }
  }

  /**
   * Update existing invoice
   */
  async updateInvoice(id: number, data: UpdateInvoiceData): Promise<SalesInvoice> {
    try {
      const response = await http.put<ApiResponse<SalesInvoice>>(
        `${API_CONFIG.BASE_URL}/sales-invoices/${id}`,
        data
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to update invoice')
    } catch (error: any) {
      console.error('Sales Invoice Service - Update Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to update invoice',
        status: error.status || 500,
        code: error.code || 'UPDATE_INVOICE_ERROR'
      })
    }
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(id: number): Promise<void> {
    try {
      const response = await http.delete<ApiResponse<void>>(
        `${API_CONFIG.BASE_URL}/sales-invoices/${id}`
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete invoice')
      }
    } catch (error: any) {
      console.error('Sales Invoice Service - Delete Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to delete invoice',
        status: error.status || 500,
        code: error.code || 'DELETE_INVOICE_ERROR'
      })
    }
  }

  /**
   * Search invoices by query
   */
  async searchInvoices(query: string): Promise<SalesInvoice[]> {
    try {
      const response = await http.get<ApiResponse<SalesInvoice[]>>(
        `${API_CONFIG.BASE_URL}/sales-invoices/search`,
        { params: { q: query } }
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to search invoices')
    } catch (error: any) {
      console.error('Sales Invoice Service - Search Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to search invoices',
        status: error.status || 500,
        code: error.code || 'SEARCH_INVOICES_ERROR'
      })
    }
  }

  /**
   * Get invoice statistics
   */
  async getInvoiceStats(): Promise<InvoiceStats> {
    try {
      const response = await http.get<ApiResponse<InvoiceStats>>(
        `${API_CONFIG.BASE_URL}/sales-invoices/stats`
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch statistics')
    } catch (error: any) {
      console.error('Sales Invoice Service - Get Stats Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to fetch statistics',
        status: error.status || 500,
        code: error.code || 'GET_STATS_ERROR'
      })
    }
  }

  /**
   * Send invoice to customer
   */
  async sendInvoice(id: number, email?: string): Promise<void> {
    try {
      const response = await http.post<ApiResponse<void>>(
        `${API_CONFIG.BASE_URL}/sales-invoices/${id}/send`,
        { email }
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to send invoice')
      }
    } catch (error: any) {
      console.error('Sales Invoice Service - Send Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to send invoice',
        status: error.status || 500,
        code: error.code || 'SEND_INVOICE_ERROR'
      })
    }
  }

  /**
   * Generate next invoice number
   */
  async generateInvoiceNumber(): Promise<string> {
    try {
      const response = await http.get<ApiResponse<{ invoiceNumber: string }>>(
        `${API_CONFIG.BASE_URL}/sales-invoices/generate-number`
      )

      if (response.success && response.data?.invoiceNumber) {
        return response.data.invoiceNumber
      }

      throw new Error(response.message || 'Failed to generate invoice number')
    } catch (error: any) {
      console.error('Sales Invoice Service - Generate Number Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to generate invoice number',
        status: error.status || 500,
        code: error.code || 'GENERATE_NUMBER_ERROR'
      })
    }
  }

  /**
   * Validate invoice number uniqueness
   */
  async validateInvoiceNumber(invoiceNumber: string, excludeId?: number): Promise<boolean> {
    try {
      const response = await http.get<ApiResponse<{ isValid: boolean }>>(
        `${API_CONFIG.BASE_URL}/sales-invoices/validate-number`,
        { params: { invoiceNumber, excludeId } }
      )

      if (response.success && response.data) {
        return response.data.isValid
      }

      return false
    } catch (error: any) {
      console.error('Sales Invoice Service - Validate Number Error:', error)
      return false
    }
  }

  /**
   * Export invoices to PDF/Excel
   */
  async exportInvoices(format: 'pdf' | 'excel', filters?: InvoiceFilters): Promise<Blob> {
    try {
      const response = await http.get(
        `${API_CONFIG.BASE_URL}/sales-invoices/export`,
        { 
          params: { format, ...filters },
          responseType: 'blob'
        }
      )

      return response as unknown as Blob
    } catch (error: any) {
      console.error('Sales Invoice Service - Export Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to export invoices',
        status: error.status || 500,
        code: error.code || 'EXPORT_INVOICES_ERROR'
      })
    }
  }

  /**
   * Download invoice PDF
   */
  async downloadInvoicePdf(id: number): Promise<Blob> {
    try {
      const response = await http.get(
        `${API_CONFIG.BASE_URL}/sales-invoices/${id}/pdf`,
        { responseType: 'blob' }
      )

      return response as unknown as Blob
    } catch (error: any) {
      console.error('Sales Invoice Service - Download PDF Error:', error)
      throw this.transformApiError({
        message: error.message || 'Failed to download invoice PDF',
        status: error.status || 500,
        code: error.code || 'DOWNLOAD_PDF_ERROR'
      })
    }
  }

  /**
   * Transform API error to standard format
   */
  private transformApiError(error: Partial<ApiError>): ApiError {
    return {
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      status: error.status || 500,
      details: error.details || {}
    }
  }
}

// Export singleton instance
export const salesInvoiceService = new SalesInvoiceService()
export default salesInvoiceService
