import type { InvoiceItem } from '../types/invoice-types';

export const calculateSubTotal = (items: InvoiceItem[]): number => {
    return items.reduce((sum, item) => sum + item.amount, 0);
};

export const calculateTotalVat = (items: InvoiceItem[]): number => {
    return items.reduce((sum, item) => sum + item.vatAmount, 0);
};

export const calculateTotal = (
    subTotal: number,
    totalVat: number,
    discountType: 'amount' | 'percentage',
    discountValue: number
): number => {
    let total = subTotal + totalVat;

    // Apply Discount
    let discountAmount = 0;
    if (discountType === 'amount') {
        discountAmount = discountValue;
    } else {
        discountAmount = (subTotal * discountValue) / 100; // Discount usually on subtotal (pre-tax) or total?
        // If VAT is added, discount might be on gross.
        // Let's assume discount is on subtotal for percentage calculation.
    }
    total -= discountAmount;

    return Math.max(0, total);
};
