// Company Store - Pinia State Management

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DialogPhase, type CompanyData, type CompanyInputData } from '../types/company-types'
import companyService from '../services/company.service'
import { LOADING_MESSAGES, SUCCESS_MESSAGES } from '../constants/company-constants'

export const useCompanyStore = defineStore('company', () => {
  // State
  const currentPhase = ref<DialogPhase>(DialogPhase.INPUT)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadingMessage = ref('')
  
  // Form data
  const inputData = ref<CompanyInputData>({
    username: '',
    gstin: '',
    stateCode: ''
  })
  
  const fetchedCompanyData = ref<CompanyData | null>(null)
  const otpValue = ref('')
  const companies = ref<CompanyData[]>([])

  // Computed
  const hasError = computed(() => !!error.value)
  const isInputPhase = computed(() => currentPhase.value === DialogPhase.INPUT)
  const isVerificationPhase = computed(() => currentPhase.value === DialogPhase.VERIFICATION)
  const isOtpPhase = computed(() => currentPhase.value === DialogPhase.OTP_ENTRY)
  const isSuccessPhase = computed(() => currentPhase.value === DialogPhase.SUCCESS)
  const isLoadingPhase = computed(() => currentPhase.value === DialogPhase.LOADING)

  // Actions
  const setPhase = (phase: DialogPhase) => {
    currentPhase.value = phase
    if (phase !== DialogPhase.ERROR) {
      error.value = null
    }
  }

  const setLoading = (loading: boolean, message = '') => {
    isLoading.value = loading
    loadingMessage.value = message
    if (loading) {
      setPhase(DialogPhase.LOADING)
    }
  }

  const setError = (errorMessage: string) => {
    error.value = errorMessage
    isLoading.value = false
    setPhase(DialogPhase.ERROR)
  }

  const clearError = () => {
    error.value = null
  }

  const updateInputData = (data: Partial<CompanyInputData>) => {
    inputData.value = { ...inputData.value, ...data }
  }

  const setFetchedCompanyData = (data: CompanyData) => {
    fetchedCompanyData.value = data
  }

  const setOtpValue = (otp: string) => {
    otpValue.value = otp
  }

  // API Actions
  const fetchCompanyDetails = async (gstin: string) => {
    try {
      setLoading(true, LOADING_MESSAGES.FETCHING_DETAILS)
      
      const response = await companyService.fetchCompanyDetails(gstin)
      
      if (response.success && response.data) {
        setFetchedCompanyData(response.data)
        setPhase(DialogPhase.VERIFICATION)
      } else {
        throw new Error('Failed to fetch company details')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch company details')
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = async () => {
    try {
      setLoading(true, LOADING_MESSAGES.SENDING_OTP)
      
      const otpData = {
        username: inputData.value.username,
        gstin: inputData.value.gstin,
        stateCode: inputData.value.stateCode
      }
      
      const response = await companyService.sendOtp(otpData)
      
      if (response.success) {
        setPhase(DialogPhase.OTP_ENTRY)
      } else {
        throw new Error(response.error?.message || 'Failed to send OTP')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (otp: string) => {
    try {
      setLoading(true, LOADING_MESSAGES.VERIFYING_OTP)
      
      const verifyData = {
        username: inputData.value.username,
        gstin: inputData.value.gstin,
        stateCode: inputData.value.stateCode,
        otp
      }
      
      const response = await companyService.verifyOtp(verifyData)
      
      if (response.success) {
        // Add company to the list
        if (fetchedCompanyData.value) {
          companies.value.push(fetchedCompanyData.value)
        }
        setPhase(DialogPhase.SUCCESS)
      } else {
        throw new Error(response.error?.message || 'OTP verification failed')
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  // Reset store state
  const resetStore = () => {
    currentPhase.value = DialogPhase.INPUT
    isLoading.value = false
    error.value = null
    loadingMessage.value = ''
    inputData.value = {
      username: '',
      gstin: '',
      stateCode: ''
    }
    fetchedCompanyData.value = null
    otpValue.value = ''
  }

  // Go back to previous phase
  const goToPreviousPhase = () => {
    switch (currentPhase.value) {
      case DialogPhase.VERIFICATION:
        setPhase(DialogPhase.INPUT)
        break
      case DialogPhase.OTP_ENTRY:
        setPhase(DialogPhase.VERIFICATION)
        break
      case DialogPhase.ERROR:
        // Go back to the last valid phase
        if (fetchedCompanyData.value) {
          setPhase(DialogPhase.VERIFICATION)
        } else {
          setPhase(DialogPhase.INPUT)
        }
        break
      default:
        setPhase(DialogPhase.INPUT)
    }
  }

  // Get company by GSTIN
  const getCompanyByGstin = (gstin: string) => {
    return companies.value.find(company => company.gstin === gstin)
  }

  // Remove company
  const removeCompany = (gstin: string) => {
    const index = companies.value.findIndex(company => company.gstin === gstin)
    if (index > -1) {
      companies.value.splice(index, 1)
    }
  }

  return {
    // State
    currentPhase,
    isLoading,
    error,
    loadingMessage,
    inputData,
    fetchedCompanyData,
    otpValue,
    companies,
    
    // Computed
    hasError,
    isInputPhase,
    isVerificationPhase,
    isOtpPhase,
    isSuccessPhase,
    isLoadingPhase,
    
    // Actions
    setPhase,
    setLoading,
    setError,
    clearError,
    updateInputData,
    setFetchedCompanyData,
    setOtpValue,
    fetchCompanyDetails,
    sendOtp,
    verifyOtp,
    resetStore,
    goToPreviousPhase,
    getCompanyByGstin,
    removeCompany
  }
})
