/**
 * Invoice Validation Utilities
 * Form and data validation functions
 */

import type {
  InvoiceFormErrors,
  LineItemErrors,
  InvoiceLineItem,
  CreateInvoiceData
} from '../types/sales-invoice-types'
import {
  VALIDATION_RULES,
  INVOICE_NUMBER_PATTERN,
  GSTIN_PATTERN,
  EMAIL_PATTERN,
  PHONE_PATTERN
} from '../constants/sales-invoice-constants'

/**
 * Validate invoice number format
 */
export function validateInvoiceNumber(invoiceNumber: string): string | undefined {
  if (!invoiceNumber || invoiceNumber.trim() === '') {
    return VALIDATION_RULES.INVOICE_NUMBER.message
  }
  
  if (!INVOICE_NUMBER_PATTERN.test(invoiceNumber)) {
    return VALIDATION_RULES.INVOICE_NUMBER.message
  }
  
  return undefined
}

/**
 * Validate customer name
 */
export function validateCustomerName(name: string): string | undefined {
  if (!name || name.trim() === '') {
    return VALIDATION_RULES.CUSTOMER_NAME.message
  }
  
  if (name.length < VALIDATION_RULES.CUSTOMER_NAME.minLength) {
    return VALIDATION_RULES.CUSTOMER_NAME.message
  }
  
  if (name.length > VALIDATION_RULES.CUSTOMER_NAME.maxLength) {
    return VALIDATION_RULES.CUSTOMER_NAME.message
  }
  
  return undefined
}

/**
 * Validate email format
 */
export function validateEmail(email?: string): string | undefined {
  if (!email || email.trim() === '') {
    return undefined // Email is optional
  }
  
  if (!EMAIL_PATTERN.test(email)) {
    return VALIDATION_RULES.EMAIL.message
  }
  
  return undefined
}

/**
 * Validate phone number
 */
export function validatePhone(phone?: string): string | undefined {
  if (!phone || phone.trim() === '') {
    return undefined // Phone is optional
  }
  
  if (!PHONE_PATTERN.test(phone)) {
    return VALIDATION_RULES.PHONE.message
  }
  
  return undefined
}

/**
 * Validate GSTIN format
 */
export function validateGstin(gstin?: string): string | undefined {
  if (!gstin || gstin.trim() === '') {
    return undefined // GSTIN is optional
  }
  
  if (!GSTIN_PATTERN.test(gstin)) {
    return VALIDATION_RULES.GSTIN.message
  }
  
  return undefined
}

/**
 * Validate date is required
 */
export function validateDate(date: string | Date | null): string | undefined {
  if (!date) {
    return VALIDATION_RULES.DATE.message
  }
  
  return undefined
}

/**
 * Validate due date is after invoice date
 */
export function validateDateRange(
  invoiceDate: string | Date,
  dueDate: string | Date
): string | undefined {
  const invDate = new Date(invoiceDate)
  const dueDateObj = new Date(dueDate)
  
  if (dueDateObj < invDate) {
    return 'Due date must be after invoice date'
  }
  
  return undefined
}

/**
 * Validate product name in line item
 */
export function validateProductName(name: string): string | undefined {
  if (!name || name.trim() === '') {
    return VALIDATION_RULES.PRODUCT_NAME.message
  }
  
  if (name.length < VALIDATION_RULES.PRODUCT_NAME.minLength) {
    return VALIDATION_RULES.PRODUCT_NAME.message
  }
  
  if (name.length > VALIDATION_RULES.PRODUCT_NAME.maxLength) {
    return VALIDATION_RULES.PRODUCT_NAME.message
  }
  
  return undefined
}

/**
 * Validate quantity
 */
export function validateQuantity(quantity: number): string | undefined {
  if (quantity < VALIDATION_RULES.QUANTITY.min) {
    return VALIDATION_RULES.QUANTITY.message
  }
  
  if (quantity > VALIDATION_RULES.QUANTITY.max) {
    return VALIDATION_RULES.QUANTITY.message
  }
  
  return undefined
}

/**
 * Validate unit price
 */
export function validateUnitPrice(price: number): string | undefined {
  if (price < VALIDATION_RULES.UNIT_PRICE.min) {
    return VALIDATION_RULES.UNIT_PRICE.message
  }
  
  if (price > VALIDATION_RULES.UNIT_PRICE.max) {
    return VALIDATION_RULES.UNIT_PRICE.message
  }
  
  return undefined
}

/**
 * Validate discount
 */
export function validateDiscount(
  discount: number,
  discountType: 'percentage' | 'amount',
  baseAmount: number
): string | undefined {
  if (discount < 0) {
    return 'Discount cannot be negative'
  }
  
  if (discountType === 'percentage' && discount > 100) {
    return VALIDATION_RULES.DISCOUNT.message
  }
  
  if (discountType === 'amount' && discount > baseAmount) {
    return 'Discount amount cannot exceed base amount'
  }
  
  return undefined
}

/**
 * Validate single line item
 */
export function validateLineItem(item: InvoiceLineItem): LineItemErrors {
  const errors: LineItemErrors = {}
  
  const nameError = validateProductName(item.productName)
  if (nameError) errors.productName = nameError
  
  const quantityError = validateQuantity(item.quantity)
  if (quantityError) errors.quantity = quantityError
  
  const priceError = validateUnitPrice(item.unitPrice)
  if (priceError) errors.unitPrice = priceError
  
  const baseAmount = item.quantity * item.unitPrice
  const discountError = validateDiscount(item.discount, item.discountType, baseAmount)
  if (discountError) errors.discount = discountError
  
  return errors
}

/**
 * Validate all line items
 */
export function validateLineItems(items: InvoiceLineItem[]): string | undefined {
  if (!items || items.length === 0) {
    return VALIDATION_RULES.LINE_ITEMS.message
  }
  
  // Check if any line item has errors
  for (const item of items) {
    const itemErrors = validateLineItem(item)
    if (Object.keys(itemErrors).length > 0) {
      return 'Please fix errors in line items'
    }
  }
  
  return undefined
}

/**
 * Validate complete invoice form
 */
export function validateInvoiceForm(data: CreateInvoiceData): InvoiceFormErrors {
  const errors: InvoiceFormErrors = {}
  
  // Validate dates
  const invoiceDateError = validateDate(data.invoiceDate)
  if (invoiceDateError) errors.invoiceDate = invoiceDateError
  
  const dueDateError = validateDate(data.dueDate)
  if (dueDateError) errors.dueDate = dueDateError
  
  // Validate date range if both dates are valid
  if (!invoiceDateError && !dueDateError) {
    const dateRangeError = validateDateRange(data.invoiceDate, data.dueDate)
    if (dateRangeError) errors.dueDate = dateRangeError
  }
  
  // Validate customer details
  const customerNameError = validateCustomerName(data.customerName)
  if (customerNameError) errors.customerName = customerNameError
  
  const emailError = validateEmail(data.customerEmail)
  if (emailError) errors.customerEmail = emailError
  
  const phoneError = validatePhone(data.customerPhone)
  if (phoneError) errors.customerPhone = phoneError
  
  const gstinError = validateGstin(data.customerGSTIN)
  if (gstinError) errors.customerGSTIN = gstinError
  
  // Validate place of supply
  if (!data.placeOfSupply || data.placeOfSupply.trim() === '') {
    errors.placeOfSupply = 'Place of supply is required'
  }
  
  // Validate line items
  const lineItemsError = validateLineItems(data.lineItems)
  if (lineItemsError) errors.lineItems = lineItemsError
  
  return errors
}

/**
 * Check if form has any errors
 */
export function hasFormErrors(errors: InvoiceFormErrors): boolean {
  return Object.keys(errors).length > 0
}

/**
 * Extract error messages as array
 */
export function getErrorMessages(errors: InvoiceFormErrors): string[] {
  return Object.values(errors).filter((msg): msg is string => !!msg)
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): string | undefined {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`
  }
  return undefined
}

/**
 * Validate min/max length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | undefined {
  if (value.length < min || value.length > max) {
    return `${fieldName} must be between ${min} and ${max} characters`
  }
  return undefined
}

/**
 * Validate numeric range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | undefined {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`
  }
  return undefined
}
