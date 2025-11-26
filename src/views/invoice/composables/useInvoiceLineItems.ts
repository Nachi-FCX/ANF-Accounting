import { ref, computed } from 'vue';
import type { InvoiceLineItem, InvoiceTableSummary } from '../types/invoice-table.types';

export function useInvoiceLineItems() {
  const rows = ref<InvoiceLineItem[]>([]);
  const isInterState = ref(false);
  
  // Generate unique ID
  const generateId = () => {
    return `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Add new row
  const addRow = () => {
    const newRow: InvoiceLineItem = {
      id: generateId(),
      lineNumber: rows.value.length + 1,
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      taxRate: 18,
      _meta: {
        isNew: true,
        isEdited: false,
        isMapped: false
      }
    };
    rows.value.push(newRow);
    return newRow;
  };
  
  // Add multiple rows
  const addRows = (count: number) => {
    for (let i = 0; i < count; i++) {
      addRow();
    }
  };
  
  // Update row
  const updateRow = (rowId: string, updates: Partial<InvoiceLineItem>) => {
    const row = rows.value.find(r => r.id === rowId);
    if (row) {
      Object.assign(row, updates);
      
      // Mark as edited
      if (row._meta) {
        row._meta.isEdited = true;
      }
      
      // Recalculate if necessary fields changed
      if (updates.quantity !== undefined || 
          updates.rate !== undefined || 
          updates.discount !== undefined || 
          updates.taxRate !== undefined) {
        calculateRowAmount(row);
      }
    }
  };
  
  // Delete row
  const deleteRow = (rowId: string) => {
    const index = rows.value.findIndex(r => r.id === rowId);
    if (index > -1) {
      rows.value.splice(index, 1);
      reorderLineNumbers();
    }
  };
  
  // Delete multiple rows
  const deleteRows = (rowIds: string[]) => {
    rows.value = rows.value.filter(r => !rowIds.includes(r.id));
    reorderLineNumbers();
  };
  
  // Duplicate row
  const duplicateRow = (rowId: string) => {
    const row = rows.value.find(r => r.id === rowId);
    if (row) {
      const newRow: InvoiceLineItem = {
        ...JSON.parse(JSON.stringify(row)),
        id: generateId(),
        lineNumber: rows.value.length + 1,
        _meta: {
          isNew: true,
          isEdited: false,
          isMapped: false
        }
      };
      rows.value.push(newRow);
      return newRow;
    }
  };
  
  // Reorder line numbers
  const reorderLineNumbers = () => {
    rows.value.forEach((row, index) => {
      row.lineNumber = index + 1;
    });
  };
  
  // Calculate amount for a single row
  const calculateRowAmount = (row: InvoiceLineItem) => {
    const quantity = row.quantity || 0;
    const rate = row.rate || 0;
    const discount = row.discount || 0;
    const taxRate = row.taxRate || 0;
    
    // Base amount
    const baseAmount = quantity * rate;
    
    // After discount
    const discountedAmount = baseAmount - discount;
    
    // Calculate tax
    const taxAmount = (discountedAmount * taxRate) / 100;
    
    // Split tax based on inter-state or intra-state
    if (isInterState.value) {
      row.igst = taxAmount;
      row.cgst = 0;
      row.sgst = 0;
    } else {
      row.cgst = taxAmount / 2;
      row.sgst = taxAmount / 2;
      row.igst = 0;
    }
    
    // Total amount
    row.amount = discountedAmount + taxAmount;
    
    return row.amount;
  };
  
  // Recalculate all rows
  const recalculateAll = () => {
    rows.value.forEach(row => calculateRowAmount(row));
  };
  
  // Calculate summary totals
  const summary = computed<InvoiceTableSummary>(() => {
    const subtotal = rows.value.reduce((sum, row) => {
      const quantity = row.quantity || 0;
      const rate = row.rate || 0;
      return sum + (quantity * rate);
    }, 0);
    
    const totalDiscount = rows.value.reduce((sum, row) => sum + (row.discount || 0), 0);
    const totalCGST = rows.value.reduce((sum, row) => sum + (row.cgst || 0), 0);
    const totalSGST = rows.value.reduce((sum, row) => sum + (row.sgst || 0), 0);
    const totalIGST = rows.value.reduce((sum, row) => sum + (row.igst || 0), 0);
    const totalCess = rows.value.reduce((sum, row) => sum + (row.cess || 0), 0);
    const grandTotal = rows.value.reduce((sum, row) => sum + (row.amount || 0), 0);
    
    return {
      subtotal,
      totalDiscount,
      totalCGST,
      totalSGST,
      totalIGST,
      totalCess,
      grandTotal
    };
  });
  
  // Populate from OCR results
  const populateFromOcr = (ocrLineItems: Partial<InvoiceLineItem>[]) => {
    rows.value = ocrLineItems.map((item, index) => ({
      id: generateId(),
      lineNumber: index + 1,
      productCode: item.productCode || '',
      description: item.description || '',
      hsnCode: item.hsnCode,
      quantity: item.quantity || 1,
      unit: item.unit || 'Units',
      rate: item.rate || 0,
      discount: item.discount,
      taxRate: item.taxRate || 0,
      amountExclVat: (item.quantity || 1) * (item.rate || 0),
      vatAmount: ((item.quantity || 1) * (item.rate || 0)) * ((item.taxRate || 0) / 100),
      amount: ((item.quantity || 1) * (item.rate || 0)) * (1 + (item.taxRate || 0) / 100),
      _meta: {
        isMapped: true,
        confidence: item._meta?.confidence,
        bbox: item._meta?.bbox,
        isEdited: false,
        isNew: false
      }
    }));
    recalculateAll();
  };
  
  // Clear all rows
  const clearAllRows = () => {
    rows.value = [];
  };
  
  // Set inter-state flag
  const setInterState = (value: boolean) => {
    isInterState.value = value;
    recalculateAll();
  };
  
  // Get row by ID
  const getRow = (rowId: string) => {
    return rows.value.find(r => r.id === rowId);
  };
  
  // Validate all rows
  const validateRows = () => {
    const errors: { rowId: string; field: string; message: string }[] = [];
    
    rows.value.forEach(row => {
      if (!row.description || row.description.trim() === '') {
        errors.push({
          rowId: row.id,
          field: 'description',
          message: 'Description is required'
        });
      }
      
      if (!row.quantity || row.quantity <= 0) {
        errors.push({
          rowId: row.id,
          field: 'quantity',
          message: 'Quantity must be greater than 0'
        });
      }
      
      if (!row.rate || row.rate <= 0) {
        errors.push({
          rowId: row.id,
          field: 'rate',
          message: 'Rate must be greater than 0'
        });
      }
    });
    
    return errors;
  };
  
  return {
    rows,
    isInterState,
    summary,
    addRow,
    addRows,
    updateRow,
    deleteRow,
    deleteRows,
    duplicateRow,
    calculateRowAmount,
    recalculateAll,
    populateFromOcr,
    clearAllRows,
    setInterState,
    getRow,
    validateRows,
    reorderLineNumbers
  };
}
