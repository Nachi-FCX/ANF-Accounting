/**
 * Sales Invoice Constants
 * Centralized configuration for sales invoice module
 */

import type {
  PaymentTermsOption,
  StatusOption,
  InvoiceStatus,
  PaymentTerms
} from '../types/sales-invoice-types'

// ==================== TAX CONFIGURATION ====================

/**
 * Standard GST Tax Rates
 */
export const TAX_RATES = {
  GST_0: 0,
  GST_5: 5,
  GST_12: 12,
  GST_18: 18,
  GST_28: 28
} as const

/**
 * Tax Rate Options for Dropdown
 */
export const TAX_RATE_OPTIONS = [
  { label: '0%', value: 0 },
  { label: '5%', value: 5 },
  { label: '12%', value: 12 },
  { label: '18%', value: 18 },
  { label: '28%', value: 28 }
]

/**
 * CGST/SGST split (equal distribution)
 */
export const CGST_SGST_SPLIT = 0.5

// ==================== PAYMENT TERMS ====================

/**
 * Payment Terms Options with Days
 */
export const PAYMENT_TERMS_OPTIONS: PaymentTermsOption[] = [
  { label: 'Due on Receipt', value: 'due_on_receipt' as PaymentTerms, days: 0 },
  { label: 'Net 15 Days', value: 'net_15' as PaymentTerms, days: 15 },
  { label: 'Net 30 Days', value: 'net_30' as PaymentTerms, days: 30 },
  { label: 'Net 60 Days', value: 'net_60' as PaymentTerms, days: 60 }
]

/**
 * Get days for payment terms
 */
export const getPaymentTermsDays = (terms: PaymentTerms): number => {
  const option = PAYMENT_TERMS_OPTIONS.find(opt => opt.value === terms)
  return option?.days ?? 0
}

// ==================== INVOICE STATUS ====================

/**
 * Status Options with Severity and Icons
 */
export const STATUS_OPTIONS: StatusOption[] = [
  {
    label: 'Draft',
    value: 'draft' as InvoiceStatus,
    severity: 'secondary',
    icon: 'pi pi-file-edit'
  },
  {
    label: 'Sent',
    value: 'sent' as InvoiceStatus,
    severity: 'info',
    icon: 'pi pi-send'
  },
  {
    label: 'Paid',
    value: 'paid' as InvoiceStatus,
    severity: 'success',
    icon: 'pi pi-check-circle'
  },
  {
    label: 'Overdue',
    value: 'overdue' as InvoiceStatus,
    severity: 'warning',
    icon: 'pi pi-exclamation-triangle'
  },
  {
    label: 'Cancelled',
    value: 'cancelled' as InvoiceStatus,
    severity: 'danger',
    icon: 'pi pi-times-circle'
  }
]

/**
 * Get status option configuration
 */
export const getStatusOption = (status: InvoiceStatus): StatusOption | undefined => {
  return STATUS_OPTIONS.find(opt => opt.value === status)
}

// ==================== VALIDATION RULES ====================

/**
 * Invoice Number Pattern (e.g., INV-0001, INV-2024-0001)
 */
export const INVOICE_NUMBER_PATTERN = /^INV-\d{4,}$/

/**
 * GSTIN Validation Pattern
 */
export const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

/**
 * Email Validation Pattern
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Phone Number Pattern (10 digits)
 */
export const PHONE_PATTERN = /^[6-9]\d{9}$/

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  // Invoice Number
  INVOICE_NUMBER: {
    required: true,
    pattern: INVOICE_NUMBER_PATTERN,
    message: 'Invoice number must be in format INV-XXXX'
  },
  
  // Customer Name
  CUSTOMER_NAME: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Customer name is required (2-100 characters)'
  },
  
  // Email
  EMAIL: {
    required: false,
    pattern: EMAIL_PATTERN,
    message: 'Invalid email format'
  },
  
  // Phone
  PHONE: {
    required: false,
    pattern: PHONE_PATTERN,
    message: 'Phone number must be 10 digits starting with 6-9'
  },
  
  // GSTIN
  GSTIN: {
    required: false,
    pattern: GSTIN_PATTERN,
    message: 'Invalid GSTIN format'
  },
  
  // Line Items
  LINE_ITEMS: {
    minItems: 1,
    message: 'At least one line item is required'
  },
  
  // Product Name
  PRODUCT_NAME: {
    required: true,
    minLength: 2,
    maxLength: 200,
    message: 'Product name is required (2-200 characters)'
  },
  
  // Quantity
  QUANTITY: {
    required: true,
    min: 0.01,
    max: 999999,
    message: 'Quantity must be between 0.01 and 999999'
  },
  
  // Unit Price
  UNIT_PRICE: {
    required: true,
    min: 0,
    max: 9999999,
    message: 'Unit price must be between 0 and 9999999'
  },
  
  // Discount
  DISCOUNT: {
    min: 0,
    max: 100,
    message: 'Discount must be between 0 and 100'
  },
  
  // Tax Rate
  TAX_RATE: {
    required: true,
    allowedValues: Object.values(TAX_RATES),
    message: 'Invalid tax rate'
  },
  
  // Dates
  DATE: {
    required: true,
    message: 'Date is required'
  }
} as const

// ==================== DEFAULT VALUES ====================

/**
 * Default Line Item
 */
export const DEFAULT_LINE_ITEM = {
  productName: '',
  description: '',
  hsnCode: '',
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  discountType: 'percentage' as const,
  taxRate: 18,
  amount: 0
}

/**
 * Default Invoice Prefix
 */
export const DEFAULT_INVOICE_PREFIX = 'INV'

/**
 * Default Payment Terms
 */
export const DEFAULT_PAYMENT_TERMS: PaymentTerms = 'net_30' as PaymentTerms

/**
 * Default Tax Rate
 */
export const DEFAULT_TAX_RATE = TAX_RATES.GST_18

// ==================== DISPLAY CONFIGURATION ====================

/**
 * Currency Configuration
 */
export const CURRENCY_CONFIG = {
  symbol: '₹',
  code: 'INR',
  locale: 'en-IN',
  decimalPlaces: 2
}

/**
 * Date Format
 */
export const DATE_FORMAT = 'DD/MM/YYYY'
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm'

/**
 * Pagination Configuration
 */
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],
  paginatorTemplate: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
  currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries'
}

// ==================== ERROR MESSAGES ====================

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch invoices. Please try again.',
  CREATE_FAILED: 'Failed to create invoice. Please check your data and try again.',
  UPDATE_FAILED: 'Failed to update invoice. Please try again.',
  DELETE_FAILED: 'Failed to delete invoice. Please try again.',
  VALIDATION_FAILED: 'Please fix the validation errors before submitting.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Invoice not found.',
  DUPLICATE_INVOICE_NUMBER: 'Invoice number already exists.',
  INVALID_DATE_RANGE: 'Due date must be after invoice date.',
  CALCULATION_ERROR: 'Error calculating totals. Please check line items.'
} as const

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'Invoice created successfully.',
  UPDATE_SUCCESS: 'Invoice updated successfully.',
  DELETE_SUCCESS: 'Invoice deleted successfully.',
  SEND_SUCCESS: 'Invoice sent successfully.',
  PAYMENT_RECORDED: 'Payment recorded successfully.'
} as const

// ==================== LOADING MESSAGES ====================

/**
 * Loading Messages
 */
export const LOADING_MESSAGES = {
  FETCHING: 'Loading invoices...',
  CREATING: 'Creating invoice...',
  UPDATING: 'Updating invoice...',
  DELETING: 'Deleting invoice...',
  SENDING: 'Sending invoice...',
  CALCULATING: 'Calculating totals...'
} as const

// ==================== ACTION BUTTON CONFIGURATION ====================

/**
 * Table Action Buttons
 */
export const ACTION_BUTTONS = {
  ADD: {
    label: 'Create Invoice',
    icon: 'pi pi-plus',
    severity: 'primary' as const,
    size: 'medium' as const
  },
  REFRESH: {
    label: 'Refresh',
    icon: 'pi pi-refresh',
    severity: 'secondary' as const,
    size: 'medium' as const
  },
  EXPORT: {
    label: 'Export',
    icon: 'pi pi-download',
    severity: 'secondary' as const,
    size: 'medium' as const
  }
} as const

// ==================== DISCOUNT TYPES ====================

/**
 * Discount Type Options
 */
export const DISCOUNT_TYPE_OPTIONS = [
  { label: 'Percentage (%)', value: 'percentage' },
  { label: 'Amount (₹)', value: 'amount' }
]

// ==================== INDIAN STATES (for Place of Supply) ====================

/**
 * Indian States and Union Territories with State Codes
 */
export const INDIAN_STATES = [
  { label: 'Andhra Pradesh', value: 'Andhra Pradesh', code: '37' },
  { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh', code: '12' },
  { label: 'Assam', value: 'Assam', code: '18' },
  { label: 'Bihar', value: 'Bihar', code: '10' },
  { label: 'Chhattisgarh', value: 'Chhattisgarh', code: '22' },
  { label: 'Goa', value: 'Goa', code: '30' },
  { label: 'Gujarat', value: 'Gujarat', code: '24' },
  { label: 'Haryana', value: 'Haryana', code: '06' },
  { label: 'Himachal Pradesh', value: 'Himachal Pradesh', code: '02' },
  { label: 'Jharkhand', value: 'Jharkhand', code: '20' },
  { label: 'Karnataka', value: 'Karnataka', code: '29' },
  { label: 'Kerala', value: 'Kerala', code: '32' },
  { label: 'Madhya Pradesh', value: 'Madhya Pradesh', code: '23' },
  { label: 'Maharashtra', value: 'Maharashtra', code: '27' },
  { label: 'Manipur', value: 'Manipur', code: '14' },
  { label: 'Meghalaya', value: 'Meghalaya', code: '17' },
  { label: 'Mizoram', value: 'Mizoram', code: '15' },
  { label: 'Nagaland', value: 'Nagaland', code: '13' },
  { label: 'Odisha', value: 'Odisha', code: '21' },
  { label: 'Punjab', value: 'Punjab', code: '03' },
  { label: 'Rajasthan', value: 'Rajasthan', code: '08' },
  { label: 'Sikkim', value: 'Sikkim', code: '11' },
  { label: 'Tamil Nadu', value: 'Tamil Nadu', code: '33' },
  { label: 'Telangana', value: 'Telangana', code: '36' },
  { label: 'Tripura', value: 'Tripura', code: '16' },
  { label: 'Uttar Pradesh', value: 'Uttar Pradesh', code: '09' },
  { label: 'Uttarakhand', value: 'Uttarakhand', code: '05' },
  { label: 'West Bengal', value: 'West Bengal', code: '19' },
  { label: 'Andaman and Nicobar Islands', value: 'Andaman and Nicobar Islands', code: '35' },
  { label: 'Chandigarh', value: 'Chandigarh', code: '04' },
  { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'Dadra and Nagar Haveli and Daman and Diu', code: '26' },
  { label: 'Delhi', value: 'Delhi', code: '07' },
  { label: 'Jammu and Kashmir', value: 'Jammu and Kashmir', code: '01' },
  { label: 'Ladakh', value: 'Ladakh', code: '38' },
  { label: 'Lakshadweep', value: 'Lakshadweep', code: '31' },
  { label: 'Puducherry', value: 'Puducherry', code: '34' }
]
