import type { InvoiceBoundingBox, InvoiceLineItem } from './invoice-table.types';

export interface InvoiceOcrResult {
  text: string;
  confidence: number;
  bbox: InvoiceBoundingBox;
  page: number;
}

export interface InvoiceDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'error';
  ocrResults?: InvoiceOcrResult[];
  extractedData?: InvoiceData;
  thumbnail?: string;
  processingTime?: number;
  confidence?: number;
  errorMessage?: string;
}

export interface InvoiceFieldMapping {
  fieldName: string;
  bbox: InvoiceBoundingBox;
  page: number;
  templateName?: string;
  confidence?: number;
}

export interface InvoiceData {
  // Header Information
  invoiceNumber: string;
  invoiceDate: Date | string;
  dueDate?: Date | string;
  poNumber?: string;

  // Vendor Information
  vendorName: string;
  vendorGSTIN: string;
  vendorAddress?: string;
  vendorPAN?: string;
  vendorState?: string;
  vendorCity?: string;
  vendorPincode?: string;

  // Buyer Information
  buyerName?: string;
  buyerGSTIN?: string;
  buyerAddress?: string;
  buyerState?: string;
  buyerCity?: string;
  buyerPincode?: string;

  // Line Items
  lineItems: InvoiceLineItem[];

  // Financial Summary (Auto-calculated from line items)
  subtotal: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalVAT?: number;
  totalCess: number;
  totalDiscount: number;
  roundOff?: number;
  totalAmount: number;

  // Additional
  currency?: string;
  paymentTerms?: string;
  notes?: string;
  bankDetails?: string;

  // Metadata
  isInterState?: boolean;              // For IGST vs CGST+SGST
  reverseCharge?: boolean;
  placeOfSupply?: string;
}

export interface InvoiceMappingTemplate {
  id: string;
  name: string;
  description?: string;
  vendorName?: string;
  fieldMappings: InvoiceFieldMapping[];
  createdDate: Date;
  lastUsed?: Date;
  usageCount?: number;
}

export interface InvoiceOcrState {
  documents: InvoiceDocument[];
  selectedDocument: InvoiceDocument | null;
  currentInvoiceData: InvoiceData | null;
  fieldMappings: InvoiceFieldMapping[];
  mappingTemplates: InvoiceMappingTemplate[];
  isProcessing: boolean;
  error: string | null;
}

export interface InvoiceOcrConfig {
  autoSave: boolean;
  autoMap: boolean;
  confidenceThreshold: number;
  defaultCurrency: string;
  defaultTaxRate: number;
}
