/**
 * useInvoiceCalculations Composable
 * Handles all invoice calculation logic
 */

import { ref, computed, watch, type Ref } from 'vue'
import type {
  InvoiceLineItem,
  TaxCalculation
} from '../types/sales-invoice-types'
import {
  calculateInvoiceTotals,
  calculateLineItem,
  updateLineItemAmount,
  isInvoiceOverdue
} from '../utils/invoice-calculations'

export function useInvoiceCalculations(
  lineItems: Ref<InvoiceLineItem[]>,
  placeOfSupply?: Ref<string>,
  companyState?: string
) {
  // State
  const isInterState = ref(false)
  const totals = ref<TaxCalculation>({
    subtotal: 0,
    totalDiscount: 0,
    taxableAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalTax: 0,
    totalAmount: 0,
    roundOff: 0
  })
  
  /**
   * Determine if transaction is inter-state
   */
  const checkInterState = () => {
    if (!placeOfSupply?.value || !companyState) {
      isInterState.value = false
      return
    }
    
    // Extract state code from GSTIN or compare state names
    const supplyState = placeOfSupply.value.trim()
    isInterState.value = supplyState !== companyState
  }
  
  /**
   * Calculate all totals
   */
  const calculateTotals = () => {
    if (!lineItems.value || lineItems.value.length === 0) {
      totals.value = {
        subtotal: 0,
        totalDiscount: 0,
        taxableAmount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
        totalAmount: 0,
        roundOff: 0
      }
      return
    }
    
    checkInterState()
    totals.value = calculateInvoiceTotals(lineItems.value, isInterState.value)
  }
  
  /**
   * Update line item amount when quantity, price, or discount changes
   */
  const updateLineItem = (index: number) => {
    if (index >= 0 && index < lineItems.value.length) {
      lineItems.value[index] = updateLineItemAmount(lineItems.value[index])
      calculateTotals()
    }
  }
  
  /**
   * Add new line item
   */
  const addLineItem = (item: InvoiceLineItem) => {
    const updatedItem = updateLineItemAmount(item)
    lineItems.value.push(updatedItem)
    calculateTotals()
  }
  
  /**
   * Remove line item
   */
  const removeLineItem = (index: number) => {
    if (index >= 0 && index < lineItems.value.length) {
      lineItems.value.splice(index, 1)
      calculateTotals()
    }
  }
  
  /**
   * Get line item calculation details
   */
  const getLineItemDetails = (index: number) => {
    if (index >= 0 && index < lineItems.value.length) {
      return calculateLineItem(lineItems.value[index])
    }
    return null
  }
  
  /**
   * Calculate grand total with rounding
   */
  const grandTotal = computed(() => {
    return Math.round(totals.value.totalAmount)
  })
  
  /**
   * Calculate amount to pay (rounded)
   */
  const amountToPay = computed(() => {
    return grandTotal.value
  })
  
  // Watch for changes in line items or place of supply
  watch(
    () => lineItems.value,
    () => {
      calculateTotals()
    },
    { deep: true }
  )
  
  watch(
    () => placeOfSupply?.value,
    () => {
      calculateTotals()
    }
  )
  
  // Initial calculation
  calculateTotals()
  
  return {
    // State
    totals,
    isInterState,
    grandTotal,
    amountToPay,
    
    // Methods
    calculateTotals,
    updateLineItem,
    addLineItem,
    removeLineItem,
    getLineItemDetails,
    checkInterState
  }
}

/**
 * Composable for checking invoice overdue status
 */
export function useInvoiceOverdue(dueDate: Ref<string>, status: Ref<string>) {
  const isOverdue = computed(() => {
    return isInvoiceOverdue(dueDate.value, status.value)
  })
  
  const daysOverdue = computed(() => {
    if (!isOverdue.value) return 0
    
    const due = new Date(dueDate.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    
    const diffInMs = today.getTime() - due.getTime()
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  })
  
  return {
    isOverdue,
    daysOverdue
  }
}

/**
 * Composable for calculating due date
 */
export function useDueDateCalculation(invoiceDate: Ref<Date | string>, paymentDays: Ref<number>) {
  const dueDate = computed(() => {
    if (!invoiceDate.value) return new Date()
    
    const date = typeof invoiceDate.value === 'string' 
      ? new Date(invoiceDate.value) 
      : invoiceDate.value
    
    const due = new Date(date)
    due.setDate(due.getDate() + paymentDays.value)
    return due
  })
  
  return {
    dueDate
  }
}
