import axios from 'axios';
import type { AxiosProgressEvent } from 'axios';
import type { 
  InvoiceDocument, 
  InvoiceOcrResult, 
  InvoiceData 
} from '@/views/invoice/types/invoice-ocr.types';

const OCR_API_BASE_URL = import.meta.env.VITE_OCR_API_URL || 
'https://fcx-ocr-python-backend.onrender.com/api/ocr';
// 'http://localhost:8000/api/ocr';



export interface OcrUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface OcrApiResponse {
  success: boolean;
  message: string;
  ocr_results: Array<{
    text: string;
    confidence: number;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    page: number;
  }>;
  extracted_data: {
    invoice_number?: string;
    invoice_date?: string;
    vendor_name?: string;
    vendor_gstin?: string;
    total_amount?: number;
    total_cgst?: number;
    total_sgst?: number;
    total_igst?: number;
    subtotal?: number;
    line_items?: Array<any>;
  };
  processing_time: number;
  total_pages: number;
  confidence_score: number;
}

/**
 * Upload and process invoice file
 */
export async function processInvoiceFile(
  file: File,
  onProgress?: (progress: OcrUploadProgress) => void
): Promise<OcrApiResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<OcrApiResponse>(
      `${OCR_API_BASE_URL}/extract`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage
            });
          }
        },
        timeout: 120000 // 2 minutes timeout
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('OCR processing error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to process invoice'
    );
  }
}

/**
 * Extract only invoice data (simplified response)
 */
export async function extractInvoiceData(
  file: File,
  onProgress?: (progress: OcrUploadProgress) => void
): Promise<InvoiceData> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<any>(
      `${OCR_API_BASE_URL}/extract-invoice`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage
            });
          }
        },
        timeout: 120000
      }
    );

    // Convert snake_case response from backend to camelCase for frontend
    const backendData = response.data;
    const convertedData: InvoiceData = {
      // Header Information
      invoiceNumber: backendData.invoice_number || '',
      invoiceDate: backendData.invoice_date || new Date(),
      dueDate: backendData.due_date,
      poNumber: backendData.po_number || '',
      
      // Vendor Information
      vendorName: backendData.vendor_name || '',
      vendorGSTIN: backendData.vendor_gstin || '',
      vendorAddress: backendData.vendor_address,
      vendorPAN: backendData.vendor_pan,
      vendorState: backendData.vendor_state,
      
      // Buyer Information
      buyerName: backendData.buyer_name || '',
      buyerGSTIN: backendData.buyer_gstin,
      buyerAddress: backendData.buyer_address,
      buyerState: backendData.buyer_state,
      
      // Line Items (convert each item's snake_case to camelCase)
      lineItems: (backendData.line_items || []).map((item: any) => ({
        lineNumber: item.line_number,
        productCode: item.product_code,
        description: item.description,
        hsnCode: item.hsn_code,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        discount: item.discount,
        taxRate: item.tax_rate,
        cgst: item.cgst,
        sgst: item.sgst,
        igst: item.igst,
        amount: item.amount,
        confidence: item.confidence,
        bbox: item.bbox
      })),
      
      // Financial Summary
      subtotal: backendData.subtotal || 0,
      totalCGST: backendData.total_cgst || 0,
      totalSGST: backendData.total_sgst || 0,
      totalIGST: backendData.total_igst || 0,
      totalCess: backendData.total_cess || 0,
      totalDiscount: backendData.total_discount || 0,
      totalAmount: backendData.total_amount || 0,
      
      // Additional
      currency: backendData.currency || 'INR',
      paymentTerms: backendData.payment_terms,
      notes: backendData.notes,
      isInterState: backendData.is_inter_state
    };

    return convertedData;
  } catch (error: any) {
    console.error('Invoice extraction error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to extract invoice data'
    );
  }
}

/**
 * Get OCR service configuration
 */
export async function getOcrConfig() {
  try {
    const response = await axios.get(`${OCR_API_BASE_URL}/config`);
    return response.data;
  } catch (error) {
    console.error('Failed to get OCR config:', error);
    throw error;
  }
}

/**
 * Check OCR service health
 */
export async function checkOcrHealth() {
  try {
    const response = await axios.get('http://localhost:8000/health');
    return response.data;
  } catch (error) {
    console.error('OCR service health check failed:', error);
    return { status: 'unhealthy' };
  }
}

/**
 * Convert API response to frontend format
 */
export function convertApiResponseToInvoiceDocument(
  response: OcrApiResponse,
  file: File
): InvoiceDocument {
  const ocrResults: InvoiceOcrResult[] = response.ocr_results.map(result => ({
    text: result.text,
    confidence: result.confidence,
    bbox: {
      x: result.bbox.x,
      y: result.bbox.y,
      width: result.bbox.width,
      height: result.bbox.height
    },
    page: result.page
  }));

  const extractedData: InvoiceData = {
    invoiceNumber: response.extracted_data.invoice_number || '',
    invoiceDate: response.extracted_data.invoice_date || new Date(),
    vendorName: response.extracted_data.vendor_name || '',
    vendorGSTIN: response.extracted_data.vendor_gstin || '',
    totalAmount: response.extracted_data.total_amount || 0,
    totalCGST: response.extracted_data.total_cgst || 0,
    totalSGST: response.extracted_data.total_sgst || 0,
    totalIGST: response.extracted_data.total_igst || 0,
    subtotal: response.extracted_data.subtotal || 0,
    totalDiscount: 0,
    totalCess: 0,
    lineItems: (response.extracted_data.line_items || []).map(item => ({
      ...item,
      productCode: item.product_code,
      hsnCode: item.hsn_code,
      taxRate: item.tax_rate,
      lineNumber: item.line_number
    }))
  };

  return {
    id: `doc_${Date.now()}`,
    fileName: file.name,
    fileUrl: URL.createObjectURL(file),
    uploadDate: new Date(),
    status: 'completed',
    ocrResults,
    extractedData,
    processingTime: response.processing_time,
    confidence: response.confidence_score
  };
}

/**
 * Validate file before upload
 */
export function validateInvoiceFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 10MB'
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only PDF, PNG, and JPEG files are allowed'
    };
  }

  return { valid: true };
}

// Export as default service object
export const invoiceOcrService = {
  processInvoiceFile,
  extractInvoiceData,
  extractInvoice: extractInvoiceData, // Alias for convenience
  getOcrConfig,
  checkOcrHealth,
  convertApiResponseToInvoiceDocument,
  validateInvoiceFile
};

export default invoiceOcrService;

