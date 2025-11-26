// GSTIN Master Types

export interface GstinInputData {
  username: string
  gstin: string
  stateCode: string
}

export interface GstinCompanyData {
  stjCd: string
  lgnm: string
  stj: string
  dty: string
  adadr: any[]
  cxdt: string
  nba: string[]
  gstin: string
  lstupdt: string
  rgdt: string
  ctb: string
  pradr: {
    addr: {
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
    ntr: string
  }
  tradeNam: string
  sts: string
  ctjCd: string
  ctj: string
  einvoiceStatus: string
}

export interface GstinApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    status?: number
  }
  message?: string
}

export interface FetchGstinDetailsRequest {
  gstin: string
}

export interface FetchGstinDetailsResponse extends GstinApiResponse<GstinCompanyData> {}

export interface SendGstinOtpRequest {
  username: string
  gstin: string
  stateCode: string
}

export interface SendGstinOtpResponse extends GstinApiResponse {
  otpSent?: boolean
  otpId?: string
}

export interface VerifyGstinOtpRequest {
  username: string
  gstin: string
  stateCode: string
  otp: string
  otpId?: string
}

export interface VerifyGstinOtpResponse extends GstinApiResponse {
  verified?: boolean
  companyData?: GstinCompanyData
}

export interface GstinApiError {
  message: string
  status?: number
  code?: string
}

export interface GstinState {
  companies: GstinCompanyData[]
  currentCompany: GstinCompanyData | null
  isLoading: boolean
  error: string | null
  loadingMessage: string
}

export interface ApiState {
  loading: boolean
  error: string | null
  success: boolean
}
