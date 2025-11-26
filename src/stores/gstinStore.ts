// GSTIN Store - Pinia State Management

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  GstinCompanyData, 
  GstinInputData, 
  GstinState 
} from '@/types/common'
import { gstinApiService } from '@/services/common'

export const useGstinStore = defineStore('gstin', () => {
  // State
  const companies = ref<GstinCompanyData[]>([])
  const currentCompany = ref<GstinCompanyData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadingMessage = ref('')

  // Computed
  const hasError = computed(() => !!error.value)
  const hasCompanies = computed(() => companies.value.length > 0)
  const companiesCount = computed(() => companies.value.length)

  // Actions
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

  const setCurrentCompany = (company: GstinCompanyData | null) => {
    currentCompany.value = company
  }

  // API Actions
  const fetchGstinDetails = async (gstin: string): Promise<GstinCompanyData | null> => {
    try {
      setLoading(true, 'Fetching GSTIN details...')
      
      // Check if company already exists in cache
      const existingCompany = getCompanyByGstin(gstin)
      if (existingCompany) {
        setCurrentCompany(existingCompany)
        return existingCompany
      }

      const response = await gstinApiService.fetchGstinDetails(gstin)
      
      if (response.success && response.data) {
        setCurrentCompany(response.data)
        return response.data
      } else {
        throw new Error('Failed to fetch GSTIN details')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GSTIN details')
      return null
    } finally {
      setLoading(false)
    }
  }

  const sendGstinOtp = async (data: GstinInputData): Promise<boolean> => {
    try {
      setLoading(true, 'Sending OTP...')
      
      const response = await gstinApiService.sendGstinOtp(data)
      
      if (response.success) {
        return true
      } else {
        throw new Error(response.error?.message || 'Failed to send OTP')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
      return false
    } finally {
      setLoading(false)
    }
  }

  const verifyGstinOtp = async (data: GstinInputData & { otp: string }): Promise<boolean> => {
    try {
      setLoading(true, 'Verifying OTP...')
      
      const response = await gstinApiService.verifyGstinOtp(data)
      
      if (response.success) {
        // Add company to the list if verification successful and company data exists
        if (currentCompany.value && !getCompanyByGstin(currentCompany.value.gstin)) {
          addCompany(currentCompany.value)
        }
        return true
      } else {
        throw new Error(response.error?.message || 'OTP verification failed')
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Company Management
  const addCompany = (company: GstinCompanyData) => {
    const existingIndex = companies.value.findIndex(c => c.gstin === company.gstin)
    if (existingIndex === -1) {
      companies.value.push(company)
    } else {
      // Update existing company
      companies.value[existingIndex] = company
    }
  }

  const removeCompany = (gstin: string) => {
    const index = companies.value.findIndex(company => company.gstin === gstin)
    if (index > -1) {
      companies.value.splice(index, 1)
      
      // Clear current company if it's the one being removed
      if (currentCompany.value?.gstin === gstin) {
        currentCompany.value = null
      }
    }
  }

  const getCompanyByGstin = (gstin: string): GstinCompanyData | undefined => {
    return companies.value.find(company => company.gstin === gstin)
  }

  const updateCompany = (gstin: string, updates: Partial<GstinCompanyData>) => {
    const index = companies.value.findIndex(company => company.gstin === gstin)
    if (index > -1) {
      companies.value[index] = { ...companies.value[index], ...updates }
      
      // Update current company if it's the one being updated
      if (currentCompany.value?.gstin === gstin) {
        currentCompany.value = companies.value[index]
      }
    }
  }

  // Utility Actions
  const clearAll = () => {
    companies.value = []
    currentCompany.value = null
    isLoading.value = false
    error.value = null
    loadingMessage.value = ''
  }

  const resetState = () => {
    currentCompany.value = null
    isLoading.value = false
    error.value = null
    loadingMessage.value = ''
  }

  // Health Check
  const checkApiHealth = async (): Promise<boolean> => {
    try {
      return await gstinApiService.healthCheck()
    } catch (error) {
      return false
    }
  }

  return {
    // State
    companies,
    currentCompany,
    isLoading,
    error,
    loadingMessage,
    
    // Computed
    hasError,
    hasCompanies,
    companiesCount,
    
    // Actions
    setLoading,
    setError,
    clearError,
    setCurrentCompany,
    fetchGstinDetails,
    sendGstinOtp,
    verifyGstinOtp,
    addCompany,
    removeCompany,
    getCompanyByGstin,
    updateCompany,
    clearAll,
    resetState,
    checkApiHealth
  }
})
