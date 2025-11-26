// API Types for Company Creation

export interface FetchCompanyDetailsRequest {
  gstin: string
}

export interface FetchCompanyDetailsResponse {
  data: {
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
  success: boolean
  status?: number
  error?: {
    message: string
  }
}

export interface SendOtpRequest {
  username: string
  gstin: string
  stateCode: string
}

export interface SendOtpResponse {
  success: boolean
  error?: {
    message: string
  }
}

export interface VerifyOtpRequest {
  username: string
  gstin: string
  stateCode: string
  otp: string
}

export interface VerifyOtpResponse {
  success: boolean
  data?: any
  error?: {
    message: string
  }
}

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}
