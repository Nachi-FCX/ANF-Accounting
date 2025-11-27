/**
 * Sales Invoice Types & Interfaces
 * Defines all TypeScript types for the sales invoice module
 */

// ==================== ENUMS ====================

/**
 * Invoice status lifecycle
 */
export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

/**
 * Payment terms configuration
 */
export enum PaymentTerms {
  NET_15 = 'net_15',
  NET_30 = 'net_30',
  NET_60 = 'net_60',
  DUE_ON_RECEIPT = 'due_on_receipt'
}

/**
 * Tax type based on transaction nature
 */
export enum TaxType {
  CGST_SGST = 'cgst_sgst',  // Intra-state
  IGST = 'igst'              // Inter-state
}

// ==================== CUSTOMER INTERFACES ====================

/**
 * Customer Address Interface
 */
export interface CustomerAddress {
  id?: number
  customerId: number
  addressType: 'billing' | 'shipping'
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

/**
 * Customer Interface
 */
export interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  gstin?: string
  trnNumber?: string  // TRN Number for UAE/GCC
  customerType: 'individual' | 'business'
  addresses: CustomerAddress[]
  createdAt: string
  updatedAt: string
}

/**
 * Customer Selection Option
 */
export interface CustomerOption {
  label: string
  value: number
  customer: Customer
}

// ==================== MAIN INTERFACES ====================

/**
 * Sales Invoice Line Item
 */
export interface InvoiceLineItem {
  id?: number
  productId?: number
  productName: string
  description?: string
  hsnCode?: string
  quantity: number
  unit?: string
  unitPrice: number
  discount: number
  discountType: 'percentage' | 'amount'
  taxRate: number
  amount: number
}

/**
 * Main Sales Invoice Interface
 */
export interface SalesInvoice {
  id: number
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  
  // Customer details
  customerId: number
  customerName: string
  customerEmail?: string
  customerPhone?: string
  customerGSTIN?: string
  customerAddress?: string
  
  // Billing & Shipping (if different)
  billingAddress?: string
  shippingAddress?: string
  
  // Invoice details
  status: InvoiceStatus
  paymentTerms: PaymentTerms
  placeOfSupply: string
  
  // Line items
  lineItems: InvoiceLineItem[]
  
  // Financial calculations
  subtotal: number
  totalDiscount: number
  taxableAmount: number
  cgst: number
  sgst: number
  igst: number
  totalTax: number
  totalAmount: number
  roundOff: number
  
  // Additional info
  notes?: string
  termsAndConditions?: string
  
  // Metadata
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

/**
 * Create Invoice Payload
 */
export interface CreateInvoiceData {
  invoiceNumber?: string  // Optional - auto-generated if not provided
  invoiceDate: string
  dueDate: string
  reference?: string
  brandingTheme?: string
  customerId: number
  customerName: string
  customerEmail?: string
  customerPhone?: string
  customerGSTIN?: string
  customerAddress?: string
  billingAddress?: string
  shippingAddress?: string
  paymentTerms: PaymentTerms
  placeOfSupply: string
  lineItems: InvoiceLineItem[]
  notes?: string
  termsAndConditions?: string
}

/**
 * Update Invoice Payload
 */
export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {
  status?: InvoiceStatus
}

/**
 * Invoice Filters for listing
 */
export interface InvoiceFilters {
  status?: InvoiceStatus | InvoiceStatus[]
  customerId?: number
  dateFrom?: string
  dateTo?: string
  search?: string
  paymentTerms?: PaymentTerms
  minAmount?: number
  maxAmount?: number
}

/**
 * Invoice Statistics
 */
export interface InvoiceStats {
  totalInvoices: number
  draftCount: number
  sentCount: number
  paidCount: number
  overdueCount: number
  totalRevenue: number
  outstandingAmount: number
}

// ==================== TABLE COLUMN TYPES ====================

/**
 * DataTable Column Definition
 */
export interface InvoiceTableColumn {
  field: keyof SalesInvoice | 'actions'
  header: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  bodyClass?: string
  headerClass?: string
  hidden?: boolean
}

// ==================== API RESPONSE TYPES ====================

/**
 * Generic API Response
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: ApiError
}

/**
 * API Error Structure
 */
export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: Record<string, any>
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ==================== VALIDATION TYPES ====================

/**
 * Form Validation Errors
 */
export interface InvoiceFormErrors {
  invoiceDate?: string
  dueDate?: string
  customerId?: string
  customerName?: string
  placeOfSupply?: string
  lineItems?: string
  [key: string]: string | undefined
}

/**
 * Line Item Validation Errors
 */
export interface LineItemErrors {
  productName?: string
  quantity?: string
  unitPrice?: string
  taxRate?: string
  [key: string]: string | undefined
}

// ==================== CALCULATION TYPES ====================

/**
 * Tax Calculation Result
 */
export interface TaxCalculation {
  subtotal: number
  totalDiscount: number
  taxableAmount: number
  cgst: number
  sgst: number
  igst: number
  totalTax: number
  totalAmount: number
  roundOff: number
}

/**
 * Line Item Calculation
 */
export interface LineItemCalculation {
  amount: number
  discountAmount: number
  taxableAmount: number
  taxAmount: number
  totalAmount: number
}

// ==================== UTILITY TYPES ====================

/**
 * Payment Terms Option
 */
export interface PaymentTermsOption {
  label: string
  value: PaymentTerms
  days: number
}

/**
 * Invoice Status Option
 */
export interface StatusOption {
  label: string
  value: InvoiceStatus
  severity: 'secondary' | 'info' | 'success' | 'warning' | 'danger'
  icon: string
}

/**
 * Customer Option for Dropdown
 */
export interface CustomerOption {
  id: number
  name: string
  gstin?: string
  email?: string
  phone?: string
}

/**
 * Product Option for Dropdown
 */
export interface ProductOption {
  id: number
  name: string
  description?: string
  hsnCode?: string
  unitPrice: number
  taxRate: number
}
