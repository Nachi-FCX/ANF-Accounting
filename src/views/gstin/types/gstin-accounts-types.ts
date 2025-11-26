// GSTIN Accounts Types

export enum DialogPhase {
  INPUT = 'input',
  VERIFICATION = 'verification',
  OTP_ENTRY = 'otp_entry',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface GstinInputData {
  username: string
  gstin: string
  stateCode: string
}

export interface GstinAddress {
  bnm: string
  st: string
  loc: string
  bno: string
  dst: string
  lt: string
  locality: string
  pncd: string
  landMark: string
  stcd: string
  geocodelvl: string
  flno: string
  lg: string
}

export interface GstinData {
  gstin: string
  lgnm: string
  tradeNam?: string
  sts: string
  ctb: string
  rgdt: string
  lstupdt: string
  pradr: {
    addr: GstinAddress
    ntr: string
  }
  nba: string[]
  stjCd: string
  stj: string
  dty: string
  ctjCd: string
  ctj: string
  einvoiceStatus: string
  cxdt?: string
  adadr?: any[]
}

export interface GstinAccount {
  id: number
  gstin: string
  companyName: string
  stateCode: string
  username: string
  txn: string
  userId: number
  expiryTime: string
  lastImsInvoiceSync: string | null
  lastUserInvoiceUpload: string | null
  lastReconciled: string | null
  createdAt: string
  updatedAt: string
  isActive?: boolean
}

export interface GstinAccountsResponse {
  success: boolean
  accounts: GstinAccount[]
  message?: string
  error?: {
    message: string
    code?: string
    status?: number
  }
}

export interface GstinAccountsApiError {
  message: string
  status?: number
  code?: string
}

export interface GstinAccountsState {
  accounts: GstinAccount[]
  isLoading: boolean
  error: string | null
  loadingMessage: string
  totalRecords: number
  currentPage: number
  pageSize: number
}

export interface GstinCreationState {
  currentPhase: DialogPhase
  inputData: GstinInputData
  fetchedData: GstinAccount | null
  otpValue: string
  isLoading: boolean
  error: string | null
  loadingMessage: string
}

export interface GstinCreationProps {
  visible: boolean
}

export interface GstinCreationEmits {
  'update:visible': [value: boolean]
  'gstin-added': [gstin: GstinAccount]
  'close': []
}

export interface OtpInputData {
  digit1: string
  digit2: string
  digit3: string
  digit4: string
}

export interface GstinAccountTableColumn {
  field: keyof GstinAccount | 'actions'
  header: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  bodyClass?: string
  headerClass?: string
  hidden?: boolean
}

export interface GstinAccountFilters {
  global?: string
  companyName?: string
  gstin?: string
  stateCode?: string
  lastReconciled?: string
}

export interface GstinAccountSortOptions {
  field: keyof GstinAccount
  order: 'asc' | 'desc'
}

export interface GstinAccountPaginationOptions {
  page: number
  size: number
  totalRecords: number
}

// Utility types for table operations
export type GstinAccountTableData = GstinAccount[]
export type GstinAccountSelection = GstinAccount | GstinAccount[] | null
