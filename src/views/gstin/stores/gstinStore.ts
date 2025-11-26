// GSTIN Store - Pinia State Management

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DialogPhase, type GstinInputData, type GstinAccount, type GstinData } from '../types/gstin-accounts-types'
import { LOADING_MESSAGES, SUCCESS_MESSAGES } from '../constants/gstin-constants'
import gstinAccountsService from '../services/gstin-accounts.service'

export const useGstinStore = defineStore('gstin', () => {
  // State
  const currentPhase = ref<DialogPhase>(DialogPhase.INPUT)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadingMessage = ref('')
  
  // Form data
  const inputData = ref<GstinInputData>({
    username: '',
    gstin: '',
    stateCode: ''
  })
  
  const fetchedGstinData = ref<GstinData | null>(null)
  const createdGstinAccount = ref<GstinAccount | null>(null)
  const otpValue = ref('')
  const gstinAccounts = ref<GstinAccount[]>([])

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

  const updateInputData = (data: Partial<GstinInputData>) => {
    inputData.value = { ...inputData.value, ...data }
  }

  const setFetchedGstinData = (data: GstinData) => {
    fetchedGstinData.value = data
  }

  const setOtpValue = (otp: string) => {
    otpValue.value = otp
  }

  // API Actions
  const fetchGstinDetails = async (gstin: string) => {
    try {
      // Validate GSTIN before making API call
      if (!gstin || gstin.trim() === '') {
        throw new Error('GSTIN is required')
      }
      
      if (gstin.length !== 15) {
        throw new Error('GSTIN must be exactly 15 characters')
      }

      setLoading(true, LOADING_MESSAGES.FETCHING_DATA)
      
      const response = await gstinAccountsService.fetchGstinDetailsForRegistration(gstin)
      
      if (response.success && response.data) {
        // Transform API response to match GstinData interface
        const gstinData: GstinData = {
          gstin: response.data.gstin,
          lgnm: response.data.lgnm,
          tradeNam: response.data.tradeNam || '',
          sts: response.data.sts,
          ctb: response.data.ctb,
          rgdt: response.data.rgdt,
          lstupdt: response.data.lstupdt,
          pradr: response.data.pradr,
          nba: response.data.nba || [],
          stjCd: response.data.stjCd,
          stj: response.data.stj,
          dty: response.data.dty,
          ctjCd: response.data.ctjCd,
          ctj: response.data.ctj,
          einvoiceStatus: response.data.einvoiceStatus,
          cxdt: response.data.cxdt || '',
          adadr: response.data.adadr || []
        }
        
        setFetchedGstinData(gstinData)
        setPhase(DialogPhase.VERIFICATION)
      } else {
        throw new Error('Failed to fetch GSTIN details')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GSTIN details')
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
      
      const response = await gstinAccountsService.sendOtp(otpData)
      
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
      
      const response = await gstinAccountsService.verifyOtp(verifyData)
      
      if (response.success) {
        // Create GSTIN account from fetched data and add to the list
        if (fetchedGstinData.value) {
          const newGstinAccount: GstinAccount = {
            id: Date.now(),
            gstin: fetchedGstinData.value.gstin,
            companyName: fetchedGstinData.value.lgnm,
            stateCode: fetchedGstinData.value.stjCd,
            username: inputData.value.username,
            txn: `TXN${Date.now()}`,
            userId: 1,
            expiryTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            lastImsInvoiceSync: null,
            lastUserInvoiceUpload: null,
            lastReconciled: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          createdGstinAccount.value = newGstinAccount
          gstinAccounts.value.push(newGstinAccount)
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
    fetchedGstinData.value = null
    createdGstinAccount.value = null
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
        if (fetchedGstinData.value) {
          setPhase(DialogPhase.VERIFICATION)
        } else {
          setPhase(DialogPhase.INPUT)
        }
        break
      default:
        setPhase(DialogPhase.INPUT)
    }
  }

  // Get GSTIN account by GSTIN
  const getGstinAccountByGstin = (gstin: string) => {
    return gstinAccounts.value.find(account => account.gstin === gstin)
  }

  // Remove GSTIN account
  const removeGstinAccount = (gstin: string) => {
    const index = gstinAccounts.value.findIndex(account => account.gstin === gstin)
    if (index > -1) {
      gstinAccounts.value.splice(index, 1)
    }
  }

  return {
    // State
    currentPhase,
    isLoading,
    error,
    loadingMessage,
    inputData,
    fetchedGstinData,
    createdGstinAccount,
    otpValue,
    gstinAccounts,
    
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
    setFetchedGstinData,
    setOtpValue,
    fetchGstinDetails,
    sendOtp,
    verifyOtp,
    resetStore,
    goToPreviousPhase,
    getGstinAccountByGstin,
    removeGstinAccount
  }
})