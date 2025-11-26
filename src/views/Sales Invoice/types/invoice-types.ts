export interface InvoiceItem {
  id: string;
  productCode: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface Invoice {
  customerName: string;
  invoiceNumber: string;
  orderNumber: string;
  invoiceDate: Date;
  terms: string;
  dueDate: Date;
  salesperson: string;
  subject: string;
  items: InvoiceItem[];
  subTotal: number;
  discountType: 'amount' | 'percentage';
  discountValue: number;
  customerNotes: string;
}

export const DEFAULT_INVOICE_ITEM: InvoiceItem = {
  id: '',
  productCode: '',
  description: '',
  quantity: 1,
  rate: 0,
  amount: 0,
  vatRate: 0,
  vatAmount: 0,
  totalAmount: 0,
};
