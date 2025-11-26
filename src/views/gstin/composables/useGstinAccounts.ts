// GSTIN Accounts Composable

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gstinAccountsService } from '../services/gstin-accounts.service'
import type {
  GstinAccount,
  GstinAccountsState,
  GstinAccountFilters,
  GstinAccountSortOptions,
  GstinAccountPaginationOptions
} from '../types/gstin-accounts-types'

export function useGstinAccounts(accountId: number = 2) {
  // State
  const state = ref<GstinAccountsState>({
    accounts: [],
    isLoading: false,
    error: null,
    loadingMessage: '',
    totalRecords: 0,
    currentPage: 0,
    pageSize: 10
  })

  // Reactive state
  const accounts = computed(() => state.value.accounts)
  const isLoading = computed(() => state.value.isLoading)
  const error = computed(() => state.value.error)
  const loadingMessage = computed(() => state.value.loadingMessage)
  const totalRecords = computed(() => state.value.totalRecords)
  const currentPage = computed(() => state.value.currentPage)
  const pageSize = computed(() => state.value.pageSize)

  // Computed properties
  const hasError = computed(() => !!state.value.error)
  const hasAccounts = computed(() => state.value.accounts.length > 0)
  const accountsCount = computed(() => state.value.accounts.length)
  const isEmpty = computed(() => !state.value.isLoading && state.value.accounts.length === 0)

  // Filters and sorting
  const filters = ref<GstinAccountFilters>({})
  const sortOptions = ref<GstinAccountSortOptions>({
    field: 'companyName',
    order: 'asc'
  })

  // Filtered and sorted accounts
  const filteredAccounts = computed(() => {
    let result = [...state.value.accounts]

    // Apply filters
    if (filters.value.global) {
      const searchTerm = filters.value.global.toLowerCase()
      result = result.filter(account =>
        account.companyName.toLowerCase().includes(searchTerm) ||
        account.gstin.toLowerCase().includes(searchTerm) ||
        account.stateCode.toLowerCase().includes(searchTerm) ||
        account.username.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.value.companyName) {
      const searchTerm = filters.value.companyName.toLowerCase()
      result = result.filter(account =>
        account.companyName.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.value.gstin) {
      const searchTerm = filters.value.gstin.toLowerCase()
      result = result.filter(account =>
        account.gstin.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.value.stateCode) {
      const searchTerm = filters.value.stateCode.toLowerCase()
      result = result.filter(account =>
        account.stateCode.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.value.lastReconciled) {
      const searchTerm = filters.value.lastReconciled.toLowerCase()
      if (searchTerm === 'unavailable') {
        result = result.filter(account => account.lastReconciled === null)
      } else {
        result = result.filter(account =>
          account.lastReconciled && 
          gstinAccountsService.formatDate(account.lastReconciled).toLowerCase().includes(searchTerm)
        )
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortOptions.value.field]
      const bValue = b[sortOptions.value.field]
      
      if (aValue === null && bValue === null) return 0
      if (aValue === null) return sortOptions.value.order === 'asc' ? 1 : -1
      if (bValue === null) return sortOptions.value.order === 'asc' ? -1 : 1
      
      const comparison = String(aValue).localeCompare(String(bValue))
      return sortOptions.value.order === 'asc' ? comparison : -comparison
    })

    return result
  })

  // Paginated accounts
  const paginatedAccounts = computed(() => {
    const start = state.value.currentPage * state.value.pageSize
    const end = start + state.value.pageSize
    return filteredAccounts.value.slice(start, end)
  })

  // Actions
  const setLoading = (loading: boolean, message = '') => {
    state.value.isLoading = loading
    state.value.loadingMessage = message
    if (loading) {
      state.value.error = null
    }
  }

  const setError = (errorMessage: string) => {
    state.value.error = errorMessage
    state.value.isLoading = false
    state.value.loadingMessage = ''
  }

  const clearError = () => {
    state.value.error = null
  }

  const setAccounts = (newAccounts: GstinAccount[]) => {
    state.value.accounts = newAccounts
    state.value.totalRecords = newAccounts.length
  }

  // API Actions
  const fetchAccounts = async (refresh = false) => {
    try {
      if (refresh || state.value.accounts.length === 0) {
        setLoading(true, 'Loading GSTIN accounts...')
      }

      const response = await gstinAccountsService.fetchGstinAccounts(accountId)
      
      if (response.success && response.accounts) {
        setAccounts(response.accounts)
        return response.accounts
      } else {
        throw new Error('Failed to fetch GSTIN accounts')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GSTIN accounts')
      return []
    } finally {
      setLoading(false)
    }
  }

  const refreshAccounts = async () => {
    return await fetchAccounts(true)
  }

  const searchAccounts = async (query: string) => {
    try {
      setLoading(true, 'Searching accounts...')
      
      const results = await gstinAccountsService.searchGstinAccounts(query, accountId)
      setAccounts(results)
      
      return results
    } catch (err: any) {
      setError(err.message || 'Search failed')
      return []
    } finally {
      setLoading(false)
    }
  }

  const getAccountById = async (id: number): Promise<GstinAccount | null> => {
    try {
      // First check if account exists in current state
      const existingAccount = state.value.accounts.find(account => account.id === id)
      if (existingAccount) {
        return existingAccount
      }

      // If not found, fetch from API
      return await gstinAccountsService.getGstinAccountById(id, accountId)
    } catch (err: any) {
      console.error('Failed to get account by ID:', err)
      return null
    }
  }

  const getAccountByGstin = async (gstin: string): Promise<GstinAccount | null> => {
    try {
      // First check if account exists in current state
      const existingAccount = state.value.accounts.find(account => account.gstin === gstin)
      if (existingAccount) {
        return existingAccount
      }

      // If not found, fetch from API
      return await gstinAccountsService.getGstinAccountByGstin(gstin, accountId)
    } catch (err: any) {
      console.error('Failed to get account by GSTIN:', err)
      return null
    }
  }

  // Filter actions
  const setGlobalFilter = (value: string) => {
    filters.value.global = value
    state.value.currentPage = 0 // Reset to first page when filtering
  }

  const setColumnFilter = (column: keyof GstinAccountFilters, value: string) => {
    filters.value[column] = value
    state.value.currentPage = 0 // Reset to first page when filtering
  }

  const clearFilters = () => {
    filters.value = {}
    state.value.currentPage = 0
  }

  // Sort actions
  const setSortOptions = (field: keyof GstinAccount, order: 'asc' | 'desc') => {
    sortOptions.value = { field, order }
  }

  const toggleSort = (field: keyof GstinAccount) => {
    if (sortOptions.value.field === field) {
      sortOptions.value.order = sortOptions.value.order === 'asc' ? 'desc' : 'asc'
    } else {
      sortOptions.value = { field, order: 'asc' }
    }
  }

  // Pagination actions
  const setPage = (page: number) => {
    state.value.currentPage = Math.max(0, Math.min(page, Math.ceil(filteredAccounts.value.length / state.value.pageSize) - 1))
  }

  const setPageSize = (size: number) => {
    state.value.pageSize = size
    state.value.currentPage = 0 // Reset to first page when changing page size
  }

  const nextPage = () => {
    const maxPage = Math.ceil(filteredAccounts.value.length / state.value.pageSize) - 1
    if (state.value.currentPage < maxPage) {
      state.value.currentPage++
    }
  }

  const previousPage = () => {
    if (state.value.currentPage > 0) {
      state.value.currentPage--
    }
  }

  // Utility actions
  const getReconciliationStatus = (account: GstinAccount) => {
    return gstinAccountsService.getReconciliationStatus(account)
  }

  const formatDate = (dateString: string | null) => {
    return gstinAccountsService.formatDate(dateString)
  }

  const getUnreconciledCount = computed(() => {
    return state.value.accounts.filter(account => account.lastReconciled === null).length
  })

  const getReconciledCount = computed(() => {
    return state.value.accounts.filter(account => account.lastReconciled !== null).length
  })

  // Lifecycle
  let refreshInterval: number | null = null

  const startAutoRefresh = (intervalMs = 300000) => { // 5 minutes default
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    
    refreshInterval = setInterval(() => {
      if (!state.value.isLoading) {
        fetchAccounts(true)
      }
    }, intervalMs)
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Initialize on mount
  onMounted(() => {
    fetchAccounts()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    // State
    accounts,
    filteredAccounts,
    paginatedAccounts,
    isLoading,
    error,
    loadingMessage,
    totalRecords,
    currentPage,
    pageSize,
    
    // Computed
    hasError,
    hasAccounts,
    accountsCount,
    isEmpty,
    getUnreconciledCount,
    getReconciledCount,
    
    // Filters and sorting
    filters,
    sortOptions,
    
    // Actions
    fetchAccounts,
    refreshAccounts,
    searchAccounts,
    getAccountById,
    getAccountByGstin,
    setLoading,
    setError,
    clearError,
    
    // Filter actions
    setGlobalFilter,
    setColumnFilter,
    clearFilters,
    
    // Sort actions
    setSortOptions,
    toggleSort,
    
    // Pagination actions
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    
    // Utility actions
    getReconciliationStatus,
    formatDate,
    
    // Auto refresh
    startAutoRefresh,
    stopAutoRefresh
  }
}
