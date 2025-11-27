/**
 * Sales Invoice Module Exports
 * Barrel file for exporting all public APIs
 */

// Components
export { default as SalesInvoiceDataTable } from './components/SalesInvoiceDataTable.vue'

// Views
export { default as SalesInvoiceListView } from './views/SalesInvoiceListView.vue'
export { default as SalesInvoiceCreateView } from './views/SalesInvoiceCreateView.vue'
export { default as SalesInvoiceEditView } from './views/SalesInvoiceEditView.vue'

// Composables
export { useSalesInvoices } from './composables/useSalesInvoices'
export { useInvoiceCalculations, useInvoiceOverdue, useDueDateCalculation } from './composables/useInvoiceCalculations'
export { useInvoiceValidation, useFieldValidation } from './composables/useInvoiceValidation'

// Store
export { useSalesInvoiceStore } from './stores/salesInvoiceStore'

// Services
export { salesInvoiceService } from './services/sales-invoice.service'

// Types
export type {
  SalesInvoice,
  InvoiceLineItem,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceFilters,
  InvoiceStats,
  InvoiceTableColumn,
  InvoiceFormErrors,
  LineItemErrors,
  TaxCalculation,
  LineItemCalculation
} from './types/sales-invoice-types'

export {
  InvoiceStatus,
  PaymentTerms,
  TaxType
} from './types/sales-invoice-types'

// Constants
export {
  TAX_RATES,
  TAX_RATE_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
  STATUS_OPTIONS,
  VALIDATION_RULES,
  DEFAULT_LINE_ITEM,
  DEFAULT_PAYMENT_TERMS,
  DEFAULT_TAX_RATE,
  CURRENCY_CONFIG,
  PAGINATION_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  INDIAN_STATES,
  getPaymentTermsDays,
  getStatusOption
} from './constants/sales-invoice-constants'

// Utilities
export {
  calculateLineItem,
  calculateInvoiceTotals,
  updateLineItemAmount,
  calculateGstBreakdown,
  calculateDueDate,
  isInvoiceOverdue,
  calculatePercentage,
  roundToTwo,
  calculateDiscount
} from './utils/invoice-calculations'

export {
  validateInvoiceForm,
  validateLineItem,
  validateInvoiceNumber,
  validateCustomerName,
  validateEmail,
  validatePhone,
  validateGstin,
  validateDate,
  validateDateRange,
  hasFormErrors,
  getErrorMessages
} from './utils/invoice-validation'

export {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateForInput,
  formatDateTime,
  formatRelativeDate,
  formatStatus,
  formatPercentage,
  formatPhoneNumber,
  formatGstin,
  formatDaysRemaining,
  getStatusSeverity,
  getStatusIcon,
  truncateText,
  capitalizeFirst
} from './utils/invoice-formatters'
