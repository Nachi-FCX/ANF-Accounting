/**
 * useInvoiceValidation Composable
 * Handles form validation logic
 */

import { ref, computed, watch, type Ref } from 'vue'
import type {
  InvoiceFormErrors,
  LineItemErrors,
  InvoiceLineItem,
  CreateInvoiceData
} from '../types/sales-invoice-types'
import {
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
} from '../utils/invoice-validation'

export function useInvoiceValidation() {
  // State
  const errors = ref<InvoiceFormErrors>({})
  const lineItemErrors = ref<Record<number, LineItemErrors>>({})
  const isValidating = ref(false)
  
  // Computed
  const hasErrors = computed(() => hasFormErrors(errors.value))
  const errorMessages = computed(() => getErrorMessages(errors.value))
  const hasLineItemErrors = computed(() => 
    Object.keys(lineItemErrors.value).some(key => 
      Object.keys(lineItemErrors.value[parseInt(key)]).length > 0
    )
  )
  
  /**
   * Validate entire invoice form
   */
  const validateForm = (data: CreateInvoiceData): boolean => {
    isValidating.value = true
    errors.value = validateInvoiceForm(data)
    
    // Validate all line items
    lineItemErrors.value = {}
    data.lineItems.forEach((item, index) => {
      const itemErrors = validateLineItem(item)
      if (Object.keys(itemErrors).length > 0) {
        lineItemErrors.value[index] = itemErrors
      }
    })
    
    isValidating.value = false
    return !hasErrors.value && !hasLineItemErrors.value
  }
  
  /**
   * Validate single field
   */
  const validateField = (fieldName: string, value: any, extraData?: any): string | undefined => {
    let error: string | undefined
    
    switch (fieldName) {
      case 'invoiceNumber':
        error = validateInvoiceNumber(value)
        break
      case 'customerName':
        error = validateCustomerName(value)
        break
      case 'customerEmail':
        error = validateEmail(value)
        break
      case 'customerPhone':
        error = validatePhone(value)
        break
      case 'customerGSTIN':
        error = validateGstin(value)
        break
      case 'invoiceDate':
      case 'dueDate':
        error = validateDate(value)
        break
      case 'dateRange':
        if (extraData?.invoiceDate && extraData?.dueDate) {
          error = validateDateRange(extraData.invoiceDate, extraData.dueDate)
        }
        break
      case 'placeOfSupply':
        error = !value || value.trim() === '' ? 'Place of supply is required' : undefined
        break
      default:
        error = undefined
    }
    
    if (error) {
      errors.value[fieldName] = error
    } else {
      delete errors.value[fieldName]
    }
    
    return error
  }
  
  /**
   * Validate single line item
   */
  const validateLineItemByIndex = (index: number, item: InvoiceLineItem): boolean => {
    const itemErrors = validateLineItem(item)
    
    if (Object.keys(itemErrors).length > 0) {
      lineItemErrors.value[index] = itemErrors
      return false
    } else {
      delete lineItemErrors.value[index]
      return true
    }
  }
  
  /**
   * Clear specific field error
   */
  const clearFieldError = (fieldName: string) => {
    delete errors.value[fieldName]
  }
  
  /**
   * Clear line item error
   */
  const clearLineItemError = (index: number, fieldName?: string) => {
    if (fieldName && lineItemErrors.value[index]) {
      delete lineItemErrors.value[index][fieldName]
      
      // Remove the index entry if no errors left
      if (Object.keys(lineItemErrors.value[index]).length === 0) {
        delete lineItemErrors.value[index]
      }
    } else {
      delete lineItemErrors.value[index]
    }
  }
  
  /**
   * Clear all errors
   */
  const clearErrors = () => {
    errors.value = {}
    lineItemErrors.value = {}
  }
  
  /**
   * Get error for specific field
   */
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.value[fieldName]
  }
  
  /**
   * Get line item error
   */
  const getLineItemError = (index: number, fieldName: string): string | undefined => {
    return lineItemErrors.value[index]?.[fieldName]
  }
  
  /**
   * Check if field has error
   */
  const hasFieldError = (fieldName: string): boolean => {
    return !!errors.value[fieldName]
  }
  
  /**
   * Check if line item has error
   */
  const hasLineItemError = (index: number, fieldName?: string): boolean => {
    if (fieldName) {
      return !!lineItemErrors.value[index]?.[fieldName]
    }
    return !!lineItemErrors.value[index] && Object.keys(lineItemErrors.value[index]).length > 0
  }
  
  /**
   * Set custom error
   */
  const setError = (fieldName: string, message: string) => {
    errors.value[fieldName] = message
  }
  
  /**
   * Set line item error
   */
  const setLineItemError = (index: number, fieldName: string, message: string) => {
    if (!lineItemErrors.value[index]) {
      lineItemErrors.value[index] = {}
    }
    lineItemErrors.value[index][fieldName] = message
  }
  
  return {
    // State
    errors,
    lineItemErrors,
    isValidating,
    
    // Computed
    hasErrors,
    errorMessages,
    hasLineItemErrors,
    
    // Methods
    validateForm,
    validateField,
    validateLineItemByIndex,
    clearFieldError,
    clearLineItemError,
    clearErrors,
    getFieldError,
    getLineItemError,
    hasFieldError,
    hasLineItemError,
    setError,
    setLineItemError
  }
}

/**
 * Composable for real-time field validation
 */
export function useFieldValidation(fieldName: string, value: Ref<any>, extraData?: Ref<any>) {
  const error = ref<string | undefined>()
  const { validateField } = useInvoiceValidation()
  
  watch(
    () => value.value,
    (newValue) => {
      error.value = validateField(fieldName, newValue, extraData?.value)
    }
  )
  
  const validate = () => {
    error.value = validateField(fieldName, value.value, extraData?.value)
    return !error.value
  }
  
  const clearError = () => {
    error.value = undefined
  }
  
  return {
    error,
    validate,
    clearError,
    hasError: computed(() => !!error.value)
  }
}
