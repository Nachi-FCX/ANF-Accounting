// Company Creation Types

export enum DialogPhase {
  INPUT = 'input',
  VERIFICATION = 'verification',
  OTP_ENTRY = 'otp_entry',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface CompanyInputData {
  username: string
  gstin: string
  stateCode: string
}

export interface CompanyData {
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

export interface CompanyCreationState {
  currentPhase: DialogPhase
  inputData: CompanyInputData
  fetchedData: CompanyData | null
  otpValue: string
  isLoading: boolean
  error: string | null
  loadingMessage: string
}

export interface CompanyCreationProps {
  visible: boolean
}

export interface CompanyCreationEmits {
  'update:visible': [value: boolean]
  'company-added': [company: CompanyData]
  'close': []
}

export interface OtpInputData {
  digit1: string
  digit2: string
  digit3: string
  digit4: string
}
