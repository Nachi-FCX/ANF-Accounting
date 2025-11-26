export interface InvoicePdfState {
  currentPage: number;
  totalPages: number;
  zoom: number;
  rotation: number;
  scale: number;
}

export interface InvoicePdfViewport {
  width: number;
  height: number;
  scale: number;
}

export interface InvoicePdfAnnotation {
  id: string;
  type: 'highlight' | 'rectangle' | 'text';
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  page: number;
  color?: string;
  label?: string;
  fieldName?: string;
}

export interface PdfDocument {
  id: string;
  name: string;
  file: File;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  uploadedAt: string;
  pages: number;
  currentPage: number;
  ocrData?: any;
  error?: string;
}
