/**
 * useSalesInvoices Composable
 * Manages invoice data fetching and CRUD operations
 */

import { ref, computed } from 'vue'
import type {
  SalesInvoice,
  InvoiceFilters,
  CreateInvoiceData,
  UpdateInvoiceData
} from '../types/sales-invoice-types'
import { salesInvoiceService } from '../services/sales-invoice.service'
import { useSalesInvoiceStore } from '../stores/salesInvoiceStore'

export function useSalesInvoices() {
  const store = useSalesInvoiceStore()
  
  // Local state for non-store usage
  const localInvoices = ref<SalesInvoice[]>([])
  const localLoading = ref(false)
  const localError = ref<string | null>(null)
  
  // Computed
  const isLoading = computed(() => store.isLoading || localLoading.value)
  const error = computed(() => store.error || localError.value)
  const invoices = computed(() => store.invoices.length > 0 ? store.invoices : localInvoices.value)
  const hasError = computed(() => store.hasError || !!localError.value)
  const totalCount = computed(() => store.totalInvoices || localInvoices.value.length)
  
  /**
   * Fetch invoices with filters
   */
  const fetchInvoices = async (filters?: InvoiceFilters) => {
    try {
      await store.fetchInvoices(filters)
    } catch (err: any) {
      localError.value = err.message
      throw err
    }
  }
  
  /**
   * Fetch single invoice by ID
   */
  const fetchInvoiceById = async (id: number) => {
    try {
      return await store.fetchInvoiceById(id)
    } catch (err: any) {
      localError.value = err.message
      throw err
    }
  }
  
  /**
   * Create new invoice
   */
  const createInvoice = async (data: CreateInvoiceData) => {
    try {
      return await store.createInvoice(data)
    } catch (err: any) {
      localError.value = err.message
      throw err
    }
  }
  
  /**
   * Update invoice
   */
  const updateInvoice = async (id: number, data: UpdateInvoiceData) => {
    try {
      return await store.updateInvoice(id, data)
    } catch (err: any) {
      localError.value = err.message
      throw err
    }
  }
  
  /**
   * Delete invoice
   */
  const deleteInvoice = async (id: number) => {
    try {
      await store.deleteInvoice(id)
    } catch (err: any) {
      localError.value = err.message
      throw err
    }
  }
  
  /**
   * Search invoices
   */
  const searchInvoices = async (query: string) => {
    try {
      await store.searchInvoices(query)
    } catch (err: any) {
      localError.value = err.message
      throw err
    }
  }
  
  /**
   * Send invoice to customer
   */
  const sendInvoice = async (id: number, email?: string) => {
    try {
      await store.sendInvoice(id, email)
    } catch (err: any) {
      localError.value = err.message
      throw err
    }
  }
  
  /**
   * Generate next invoice number
   */
  const generateInvoiceNumber = async (): Promise<string> => {
    try {
      return await store.generateInvoiceNumber()
    } catch (err: any) {
      localError.value = err.message
      throw err
    }
  }
  
  /**
   * Download invoice PDF
   */
  const downloadInvoicePdf = async (id: number) => {
    try {
      localLoading.value = true
      const blob = await salesInvoiceService.downloadInvoicePdf(id)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      localError.value = err.message
      throw err
    } finally {
      localLoading.value = false
    }
  }
  
  /**
   * Export invoices
   */
  const exportInvoices = async (format: 'pdf' | 'excel', filters?: InvoiceFilters) => {
    try {
      localLoading.value = true
      const blob = await salesInvoiceService.exportInvoices(format, filters)
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoices-${new Date().getTime()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      localError.value = err.message
      throw err
    } finally {
      localLoading.value = false
    }
  }
  
  /**
   * Refresh invoices
   */
  const refreshInvoices = async () => {
    await store.refreshInvoices()
  }
  
  /**
   * Clear error
   */
  const clearError = () => {
    localError.value = null
    store.clearError()
  }
  
  /**
   * Get invoice by number
   */
  const getInvoiceByNumber = (invoiceNumber: string) => {
    return store.getInvoiceByNumber(invoiceNumber)
  }
  
  return {
    // State
    invoices,
    isLoading,
    error,
    hasError,
    totalCount,
    
    // Store access
    currentInvoice: computed(() => store.currentInvoice),
    draftInvoices: computed(() => store.draftInvoices),
    paidInvoices: computed(() => store.paidInvoices),
    overdueInvoices: computed(() => store.overdueInvoices),
    totalRevenue: computed(() => store.totalRevenue),
    outstandingAmount: computed(() => store.outstandingAmount),
    
    // Actions
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    searchInvoices,
    sendInvoice,
    generateInvoiceNumber,
    downloadInvoicePdf,
    exportInvoices,
    refreshInvoices,
    clearError,
    getInvoiceByNumber
  }
}
