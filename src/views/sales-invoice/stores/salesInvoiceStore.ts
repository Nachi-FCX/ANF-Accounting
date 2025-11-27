/**
 * Sales Invoice Store - Pinia State Management
 * Manages sales invoice state, API calls, and business logic
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  SalesInvoice,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceFilters,
  InvoiceStats,
  InvoiceStatus
} from '../types/sales-invoice-types'
import { salesInvoiceService } from '../services/sales-invoice.service'

export const useSalesInvoiceStore = defineStore('salesInvoice', () => {
  // ==================== STATE ====================
  
  const invoices = ref<SalesInvoice[]>([])
  const currentInvoice = ref<SalesInvoice | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadingMessage = ref('')
  const filters = ref<InvoiceFilters>({})
  const stats = ref<InvoiceStats | null>(null)
  
  // Pagination state
  const currentPage = ref(0)
  const pageSize = ref(10)
  const totalRecords = ref(0)
  
  // ==================== COMPUTED ====================
  
  const hasError = computed(() => !!error.value)
  const hasInvoices = computed(() => invoices.value.length > 0)
  const totalInvoices = computed(() => invoices.value.length)
  
  // Filter invoices by status
  const draftInvoices = computed(() =>
    invoices.value.filter(inv => inv.status === 'draft')
  )
  
  const sentInvoices = computed(() =>
    invoices.value.filter(inv => inv.status === 'sent')
  )
  
  const paidInvoices = computed(() =>
    invoices.value.filter(inv => inv.status === 'paid')
  )
  
  const overdueInvoices = computed(() =>
    invoices.value.filter(inv => inv.status === 'overdue')
  )
  
  // Calculate totals
  const totalRevenue = computed(() =>
    invoices.value.reduce((sum, inv) => sum + inv.totalAmount, 0)
  )
  
  const outstandingAmount = computed(() =>
    invoices.value
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.totalAmount, 0)
  )
  
  // ==================== ACTIONS - LOADING & ERROR ====================
  
  const setLoading = (loading: boolean, message = '') => {
    isLoading.value = loading
    loadingMessage.value = message
    if (loading) {
      error.value = null
    }
  }
  
  const setError = (errorMessage: string) => {
    error.value = errorMessage
    isLoading.value = false
    loadingMessage.value = ''
  }
  
  const clearError = () => {
    error.value = null
  }
  
  // ==================== ACTIONS - INVOICE OPERATIONS ====================
  
  /**
   * Fetch all invoices with optional filters
   */
  const fetchInvoices = async (newFilters?: InvoiceFilters) => {
    try {
      setLoading(true, 'Loading invoices...')
      
      if (newFilters) {
        filters.value = newFilters
      }
      
      const data = await salesInvoiceService.fetchInvoices(filters.value)
      invoices.value = data
      totalRecords.value = data.length
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Fetch invoice by ID
   */
  const fetchInvoiceById = async (id: number) => {
    try {
      setLoading(true, 'Loading invoice...')
      
      const invoice = await salesInvoiceService.getInvoiceById(id)
      currentInvoice.value = invoice
      
      return invoice
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Create new invoice
   */
  const createInvoice = async (data: CreateInvoiceData) => {
    try {
      setLoading(true, 'Creating invoice...')
      
      const newInvoice = await salesInvoiceService.createInvoice(data)
      
      // Add to local state
      invoices.value.unshift(newInvoice)
      currentInvoice.value = newInvoice
      totalRecords.value += 1
      
      return newInvoice
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Update existing invoice
   */
  const updateInvoice = async (id: number, data: UpdateInvoiceData) => {
    try {
      setLoading(true, 'Updating invoice...')
      
      const updatedInvoice = await salesInvoiceService.updateInvoice(id, data)
      
      // Update in local state
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index > -1) {
        invoices.value[index] = updatedInvoice
      }
      
      // Update current invoice if it's the one being edited
      if (currentInvoice.value?.id === id) {
        currentInvoice.value = updatedInvoice
      }
      
      return updatedInvoice
    } catch (err: any) {
      setError(err.message || 'Failed to update invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Delete invoice
   */
  const deleteInvoice = async (id: number) => {
    try {
      setLoading(true, 'Deleting invoice...')
      
      await salesInvoiceService.deleteInvoice(id)
      
      // Remove from local state
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index > -1) {
        invoices.value.splice(index, 1)
        totalRecords.value -= 1
      }
      
      // Clear current invoice if it's the one being deleted
      if (currentInvoice.value?.id === id) {
        currentInvoice.value = null
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Search invoices
   */
  const searchInvoices = async (query: string) => {
    try {
      setLoading(true, 'Searching invoices...')
      
      const results = await salesInvoiceService.searchInvoices(query)
      invoices.value = results
      totalRecords.value = results.length
      
    } catch (err: any) {
      setError(err.message || 'Failed to search invoices')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Send invoice to customer
   */
  const sendInvoice = async (id: number, email?: string) => {
    try {
      setLoading(true, 'Sending invoice...')
      
      await salesInvoiceService.sendInvoice(id, email)
      
      // Update status in local state
      const invoice = invoices.value.find(inv => inv.id === id)
      if (invoice) {
        invoice.status = 'sent' as InvoiceStatus
      }
      
      if (currentInvoice.value?.id === id) {
        currentInvoice.value.status = 'sent' as InvoiceStatus
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to send invoice')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Fetch invoice statistics
   */
  const fetchStats = async () => {
    try {
      const data = await salesInvoiceService.getInvoiceStats()
      stats.value = data
      return data
    } catch (err: any) {
      console.error('Failed to fetch statistics:', err)
      return null
    }
  }
  
  /**
   * Generate next invoice number
   */
  const generateInvoiceNumber = async (): Promise<string> => {
    try {
      return await salesInvoiceService.generateInvoiceNumber()
    } catch (err: any) {
      console.error('Failed to generate invoice number:', err)
      throw err
    }
  }
  
  // ==================== ACTIONS - STATE MANAGEMENT ====================
  
  /**
   * Set current invoice
   */
  const setCurrentInvoice = (invoice: SalesInvoice | null) => {
    currentInvoice.value = invoice
  }
  
  /**
   * Update filters
   */
  const setFilters = (newFilters: InvoiceFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  /**
   * Clear filters
   */
  const clearFilters = () => {
    filters.value = {}
  }
  
  /**
   * Set pagination
   */
  const setPagination = (page: number, size: number) => {
    currentPage.value = page
    pageSize.value = size
  }
  
  /**
   * Get invoice by ID from local state
   */
  const getInvoiceById = (id: number): SalesInvoice | undefined => {
    return invoices.value.find(inv => inv.id === id)
  }
  
  /**
   * Get invoice by invoice number
   */
  const getInvoiceByNumber = (invoiceNumber: string): SalesInvoice | undefined => {
    return invoices.value.find(inv => inv.invoiceNumber === invoiceNumber)
  }
  
  /**
   * Reset store to initial state
   */
  const reset = () => {
    invoices.value = []
    currentInvoice.value = null
    error.value = null
    isLoading.value = false
    loadingMessage.value = ''
    filters.value = {}
    stats.value = null
    currentPage.value = 0
    pageSize.value = 10
    totalRecords.value = 0
  }
  
  /**
   * Refresh invoices (re-fetch with current filters)
   */
  const refreshInvoices = async () => {
    await fetchInvoices(filters.value)
  }
  
  // ==================== RETURN ====================
  
  return {
    // State
    invoices,
    currentInvoice,
    isLoading,
    error,
    loadingMessage,
    filters,
    stats,
    currentPage,
    pageSize,
    totalRecords,
    
    // Computed
    hasError,
    hasInvoices,
    totalInvoices,
    draftInvoices,
    sentInvoices,
    paidInvoices,
    overdueInvoices,
    totalRevenue,
    outstandingAmount,
    
    // Actions - Loading & Error
    setLoading,
    setError,
    clearError,
    
    // Actions - Invoice Operations
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    searchInvoices,
    sendInvoice,
    fetchStats,
    generateInvoiceNumber,
    
    // Actions - State Management
    setCurrentInvoice,
    setFilters,
    clearFilters,
    setPagination,
    getInvoiceById,
    getInvoiceByNumber,
    reset,
    refreshInvoices
  }
})
