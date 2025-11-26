// useGstin - GSTIN Operations Composable

import { ref, computed } from 'vue'
import { useGstinStore } from '@/stores/gstinStore'
import { useApiState } from './useApiState'
import type { 
  GstinInputData, 
  GstinCompanyData 
} from '@/types/common'

export function useGstin() {
  // Store
  const gstinStore = useGstinStore()
  
  // API State
  const fetchApiState = useApiState()
  const otpApiState = useApiState()
  const verifyApiState = useApiState()

  // Local state
  const currentGstin = ref('')
  const otpValue = ref('')

  // Computed
  const isAnyLoading = computed(() => 
    fetchApiState.isLoading.value || 
    otpApiState.isLoading.value || 
    verifyApiState.isLoading.value ||
    gstinStore.isLoading
  )

  const hasAnyError = computed(() => 
    fetchApiState.hasError.value || 
    otpApiState.hasError.value || 
    verifyApiState.hasError.value ||
    gstinStore.hasError
  )

  const currentError = computed(() => 
    fetchApiState.error.value || 
    otpApiState.error.value || 
    verifyApiState.error.value ||
    gstinStore.error
  )

  const companies = computed(() => gstinStore.companies)
  const currentCompany = computed(() => gstinStore.currentCompany)
  const companiesCount = computed(() => gstinStore.companiesCount)

  // Actions
  const fetchCompanyDetails = async (gstin: string): Promise<GstinCompanyData | null> => {
    currentGstin.value = gstin
    
    return await fetchApiState.executeAsync(
      () => gstinStore.fetchGstinDetails(gstin),
      {
        errorMessage: 'Failed to fetch company details'
      }
    )
  }

  const sendOtp = async (data: GstinInputData): Promise<boolean> => {
    const result = await otpApiState.executeAsync(
      () => gstinStore.sendGstinOtp(data),
      {
        errorMessage: 'Failed to send OTP'
      }
    )
    
    return result === true
  }

  const verifyOtp = async (data: GstinInputData, otp: string): Promise<boolean> => {
    otpValue.value = otp
    
    const result = await verifyApiState.executeAsync(
      () => gstinStore.verifyGstinOtp({ ...data, otp }),
      {
        errorMessage: 'Failed to verify OTP'
      }
    )
    
    return result === true
  }

  // Complete GSTIN flow
  const completeGstinFlow = async (data: GstinInputData, otp: string): Promise<boolean> => {
    try {
      // Step 1: Fetch company details
      const company = await fetchCompanyDetails(data.gstin)
      if (!company) {
        return false
      }

      // Step 2: Send OTP
      const otpSent = await sendOtp(data)
      if (!otpSent) {
        return false
      }

      // Step 3: Verify OTP
      const otpVerified = await verifyOtp(data, otp)
      return otpVerified
    } catch (error) {
      console.error('Complete GSTIN flow error:', error)
      return false
    }
  }

  // Company management
  const addCompany = (company: GstinCompanyData) => {
    gstinStore.addCompany(company)
  }

  const removeCompany = (gstin: string) => {
    gstinStore.removeCompany(gstin)
  }

  const getCompanyByGstin = (gstin: string): GstinCompanyData | undefined => {
    return gstinStore.getCompanyByGstin(gstin)
  }

  const updateCompany = (gstin: string, updates: Partial<GstinCompanyData>) => {
    gstinStore.updateCompany(gstin, updates)
  }

  // Utility functions
  const clearAllErrors = () => {
    fetchApiState.clearError()
    otpApiState.clearError()
    verifyApiState.clearError()
    gstinStore.clearError()
  }

  const resetAllStates = () => {
    fetchApiState.reset()
    otpApiState.reset()
    verifyApiState.reset()
    gstinStore.resetState()
    currentGstin.value = ''
    otpValue.value = ''
  }

  const clearAll = () => {
    resetAllStates()
    gstinStore.clearAll()
  }

  // Form helpers
  const createFormData = (username: string, gstin: string, stateCode: string): GstinInputData => {
    return {
      username,
      gstin,
      stateCode
    }
  }

  const validateGstinFormat = (gstin: string): boolean => {
    // Basic GSTIN format validation (15 characters)
    return !!(gstin && gstin.length === 15)
  }

  const extractStateCode = (gstin: string): string => {
    // Extract state code from GSTIN (first 2 digits)
    return gstin ? gstin.substring(0, 2) : ''
  }

  // Health check
  const checkApiHealth = async (): Promise<boolean> => {
    return await gstinStore.checkApiHealth()
  }

  // Batch operations
  const fetchMultipleCompanies = async (gstins: string[]): Promise<GstinCompanyData[]> => {
    const results = await fetchApiState.executeMultiple(
      gstins.map(gstin => () => gstinStore.fetchGstinDetails(gstin)),
      {
        stopOnError: false,
        onProgress: (completed, total) => {
          console.log(`Fetched ${completed}/${total} companies`)
        }
      }
    )
    
    return results.filter(Boolean) as GstinCompanyData[]
  }

  // Retry operations
  const fetchWithRetry = async (gstin: string, maxRetries: number = 3): Promise<GstinCompanyData | null> => {
    return await fetchApiState.executeWithRetry(
      () => gstinStore.fetchGstinDetails(gstin),
      maxRetries,
      1000,
      {
        onRetry: (attempt, error) => {
          console.log(`Retry attempt ${attempt} for GSTIN ${gstin}:`, error.message)
        }
      }
    )
  }

  return {
    // State
    currentGstin,
    otpValue,
    companies,
    currentCompany,
    companiesCount,
    
    // Computed
    isAnyLoading,
    hasAnyError,
    currentError,
    
    // API States
    fetchApiState: fetchApiState.state,
    otpApiState: otpApiState.state,
    verifyApiState: verifyApiState.state,
    
    // Core Actions
    fetchCompanyDetails,
    sendOtp,
    verifyOtp,
    completeGstinFlow,
    
    // Company Management
    addCompany,
    removeCompany,
    getCompanyByGstin,
    updateCompany,
    
    // Utility Actions
    clearAllErrors,
    resetAllStates,
    clearAll,
    checkApiHealth,
    
    // Form Helpers
    createFormData,
    validateGstinFormat,
    extractStateCode,
    
    // Batch Operations
    fetchMultipleCompanies,
    fetchWithRetry
  }
}

export default useGstin
