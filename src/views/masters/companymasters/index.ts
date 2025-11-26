// Company Masters Module Exports

// Main View Component
export { default as CompanyCreation } from './views/CompanyCreation.vue'

// Sub Components
export { default as CompanyInputForm } from './components/CompanyInputForm.vue'
export { default as CompanyVerificationForm } from './components/CompanyVerificationForm.vue'
export { default as CompanyOtpForm } from './components/CompanyOtpForm.vue'
export { default as CompanyLoadingState } from './components/CompanyLoadingState.vue'
export { default as CompanySuccessState } from './components/CompanySuccessState.vue'

// Store
export { useCompanyStore } from './stores/companyStore'

// Services
export { default as companyService } from './services/company.service'

// Types
export type {
  CompanyData,
  CompanyInputData,
  CompanyCreationState,
  CompanyCreationProps,
  CompanyCreationEmits,
  OtpInputData,
  DialogPhase
} from './types/company-types'

export type {
  FetchCompanyDetailsRequest,
  FetchCompanyDetailsResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ApiError
} from './types/api-types'

// Constants
export {
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  DIALOG_CONFIG,
  OTP_CONFIG
} from './constants/company-constants'

// Utilities
export {
  validateGSTIN,
  validateStateCode,
  validateUsername,
  validateOTP,
  validateCompanyInputForm
} from './utils/company-validation'

export {
  extractStateCodeFromGSTIN,
  formatCompanyAddress,
  getCompanyStatusColor,
  formatDate,
  getCompanyDisplayName,
  hasEInvoiceCapability,
  getBusinessNatureText,
  cleanGSTIN,
  generateFormId,
  debounce,
  isNetworkError,
  formatOTPDisplay,
  formatRemainingTime
} from './utils/company-helpers'
