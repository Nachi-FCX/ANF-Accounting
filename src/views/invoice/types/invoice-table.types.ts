export type InvoiceFieldType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'dropdown' 
  | 'autocomplete'
  | 'textarea'
  | 'checkbox'
  | 'calculated';

export interface InvoiceTableColumn {
  id: string;                          // Unique column ID
  fieldName: string;                   // Field name in data model
  header: string;                      // Display header
  fieldType: InvoiceFieldType;         // FCX component type
  width?: string;                      // Column width (150px, 20%, auto)
  minWidth?: string;                   // Minimum width
  order: number;                       // Display order
  
  // Visibility & Editing
  visible: boolean;                    // Show/hide column
  editable: boolean;                   // Can be edited
  required: boolean;                   // Required field
  
  // OCR Mapping
  mappable: boolean;                   // Can be mapped from PDF
  ocrPattern?: RegExp;                 // Pattern for auto-detection
  
  // Validation
  validator?: (value: any) => boolean;
  validationMessage?: string;
  
  // Dropdown/Autocomplete Options
  options?: Array<{ label: string; value: any }>;
  
  // Calculated Fields
  formula?: string;                    // e.g., "quantity * rate"
  dependencies?: string[];             // Fields this depends on
  
  // Styling
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  
  // FCX Component Props
  fcxProps?: Record<string, any>;      // Pass-through to FCX component
}

export interface InvoiceBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InvoiceLineItem {
  id: string;
  [key: string]: any;                  // Dynamic fields based on columns
  
  // Standard fields (can be in columns or not)
  lineNumber?: number;
  description?: string;
  hsnCode?: string;
  quantity?: number;
  unit?: string;
  rate?: number;
  discount?: number;
  discountPercent?: number;
  taxRate?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  cess?: number;
  amount?: number;
  
  // Metadata
  _meta?: {
    bbox?: InvoiceBoundingBox;
    confidence?: number;
    isMapped?: boolean;
    isEdited?: boolean;
    isNew?: boolean;
  };
}

export interface InvoiceTableConfig {
  id: string;
  name: string;                        // Template name
  description?: string;
  columns: InvoiceTableColumn[];
  defaultColumns: string[];            // Default visible columns
  createdDate: Date;
  updatedDate: Date;
}

export interface InvoiceTableState {
  columns: InvoiceTableColumn[];
  visibleColumns: InvoiceTableColumn[];
  rows: InvoiceLineItem[];
  selectedRows: string[];
  editingCell?: { rowId: string; columnId: string };
  draggedColumn?: string;
  hoveredCell?: { rowId: string; columnId: string };
}

export interface InvoiceTableSummary {
  subtotal: number;
  totalDiscount: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalCess: number;
  grandTotal: number;
}
