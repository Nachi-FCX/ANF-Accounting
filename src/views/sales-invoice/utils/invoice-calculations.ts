/**
 * Invoice Calculation Utilities
 * Handles all financial calculations for invoices
 */

import type {
  InvoiceLineItem,
  TaxCalculation,
  LineItemCalculation
} from '../types/sales-invoice-types'
import { CGST_SGST_SPLIT } from '../constants/sales-invoice-constants'

/**
 * Calculate line item totals
 */
export function calculateLineItem(item: InvoiceLineItem): LineItemCalculation {
  const baseAmount = item.quantity * item.unitPrice
  
  // Calculate discount
  let discountAmount = 0
  if (item.discountType === 'percentage') {
    discountAmount = (baseAmount * item.discount) / 100
  } else {
    discountAmount = item.discount
  }
  
  const taxableAmount = baseAmount - discountAmount
  const taxAmount = (taxableAmount * item.taxRate) / 100
  const totalAmount = taxableAmount + taxAmount
  
  return {
    amount: baseAmount,
    discountAmount,
    taxableAmount,
    taxAmount,
    totalAmount
  }
}

/**
 * Calculate invoice totals from line items
 */
export function calculateInvoiceTotals(
  lineItems: InvoiceLineItem[],
  isInterState: boolean = false
): TaxCalculation {
  let subtotal = 0
  let totalDiscount = 0
  let taxableAmount = 0
  let totalTax = 0
  
  // Calculate totals for each line item
  lineItems.forEach(item => {
    const itemCalc = calculateLineItem(item)
    subtotal += itemCalc.amount
    totalDiscount += itemCalc.discountAmount
    taxableAmount += itemCalc.taxableAmount
    totalTax += itemCalc.taxAmount
  })
  
  // Distribute tax based on transaction type
  let cgst = 0
  let sgst = 0
  let igst = 0
  
  if (isInterState) {
    // Inter-state: IGST only
    igst = totalTax
  } else {
    // Intra-state: CGST + SGST (equal split)
    cgst = totalTax * CGST_SGST_SPLIT
    sgst = totalTax * CGST_SGST_SPLIT
  }
  
  const totalAmount = taxableAmount + totalTax
  const roundOff = Math.round(totalAmount) - totalAmount
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    totalDiscount: parseFloat(totalDiscount.toFixed(2)),
    taxableAmount: parseFloat(taxableAmount.toFixed(2)),
    cgst: parseFloat(cgst.toFixed(2)),
    sgst: parseFloat(sgst.toFixed(2)),
    igst: parseFloat(igst.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    roundOff: parseFloat(roundOff.toFixed(2))
  }
}

/**
 * Update line item amount
 */
export function updateLineItemAmount(item: InvoiceLineItem): InvoiceLineItem {
  const calc = calculateLineItem(item)
  return {
    ...item,
    amount: parseFloat(calc.totalAmount.toFixed(2))
  }
}

/**
 * Calculate GST breakdown for a specific amount
 */
export function calculateGstBreakdown(
  amount: number,
  taxRate: number,
  isInterState: boolean = false
): { cgst: number; sgst: number; igst: number; totalTax: number } {
  const taxAmount = (amount * taxRate) / 100
  
  if (isInterState) {
    return {
      cgst: 0,
      sgst: 0,
      igst: parseFloat(taxAmount.toFixed(2)),
      totalTax: parseFloat(taxAmount.toFixed(2))
    }
  } else {
    const cgst = taxAmount * CGST_SGST_SPLIT
    const sgst = taxAmount * CGST_SGST_SPLIT
    return {
      cgst: parseFloat(cgst.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      igst: 0,
      totalTax: parseFloat(taxAmount.toFixed(2))
    }
  }
}

/**
 * Calculate due date based on payment terms
 */
export function calculateDueDate(invoiceDate: Date, paymentDays: number): Date {
  const dueDate = new Date(invoiceDate)
  dueDate.setDate(dueDate.getDate() + paymentDays)
  return dueDate
}

/**
 * Check if invoice is overdue
 */
export function isInvoiceOverdue(dueDate: string, status: string): boolean {
  if (status === 'paid' || status === 'cancelled') {
    return false
  }
  
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  
  return due < today
}

/**
 * Calculate percentage of total
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return parseFloat(((value / total) * 100).toFixed(2))
}

/**
 * Round to 2 decimal places
 */
export function roundToTwo(value: number): number {
  return parseFloat(value.toFixed(2))
}

/**
 * Calculate discount amount from percentage or flat amount
 */
export function calculateDiscount(
  baseAmount: number,
  discount: number,
  discountType: 'percentage' | 'amount'
): number {
  if (discountType === 'percentage') {
    return (baseAmount * discount) / 100
  }
  return discount
}
