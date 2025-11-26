import { ref, computed } from 'vue';
import type { InvoiceTableColumn, InvoiceTableConfig } from '../types/invoice-table.types';

export function useInvoiceTableColumns() {
  const columns = ref<InvoiceTableColumn[]>([]);
  const savedConfigs = ref<InvoiceTableConfig[]>([]);
  
  // Initialize with default columns (matching PDF invoice structure)
  const initializeDefaultColumns = () => {
    columns.value = [
      {
        id: 'lineNumber',
        fieldName: 'lineNumber',
        header: 'Sr No.',
        fieldType: 'number',
        width: '80px',
        order: 1,
        visible: true,
        editable: true,
        required: false,
        mappable: false,
        align: 'center'
      },
      {
        id: 'productCode',
        fieldName: 'productCode',
        header: 'Product Code',
        fieldType: 'text',
        width: '150px',
        order: 2,
        visible: true,
        editable: true,
        required: false,
        mappable: true,
        align: 'left',
        fcxProps: {
          maxlength: 50
        }
      },
      {
        id: 'description',
        fieldName: 'description',
        header: 'Description of Goods',
        fieldType: 'textarea',
        width: '250px',
        minWidth: '200px',
        order: 3,
        visible: true,
        editable: true,
        required: true,
        mappable: true,
        align: 'left',
        fcxProps: {
          rows: 2,
          autoResize: true
        }
      },
      {
        id: 'quantity',
        fieldName: 'quantity',
        header: 'Quantity',
        fieldType: 'number',
        width: '100px',
        order: 4,
        visible: true,
        editable: true,
        required: true,
        mappable: true,
        align: 'right',
        fcxProps: {
          min: 0,
          minFractionDigits: 0,
          maxFractionDigits: 2
        }
      },
      {
        id: 'unit',
        fieldName: 'unit',
        header: 'Per',
        fieldType: 'dropdown',
        width: '100px',
        order: 5,
        visible: true,
        editable: true,
        required: false,
        mappable: true,
        align: 'center',
        options: [
          { label: 'Units', value: 'Units' },
          { label: 'PCS', value: 'PCS' },
          { label: 'KG', value: 'KG' },
          { label: 'MTR', value: 'MTR' },
          { label: 'LTR', value: 'LTR' },
          { label: 'BOX', value: 'BOX' },
          { label: 'SET', value: 'SET' }
        ],
        fcxProps: {
          showClear: true
        }
      },
      {
        id: 'rate',
        fieldName: 'rate',
        header: 'Rate',
        fieldType: 'number',
        width: '120px',
        order: 6,
        visible: true,
        editable: true,
        required: true,
        mappable: true,
        align: 'right',
        fcxProps: {
          min: 0,
          minFractionDigits: 2,
          maxFractionDigits: 2
        }
      },
      {
        id: 'amountExclVat',
        fieldName: 'amountExclVat',
        header: 'Amount Excl. VAT',
        fieldType: 'number',
        width: '140px',
        order: 7,
        visible: true,
        editable: true,
        required: false,
        mappable: true,
        align: 'right',
        formula: 'quantity * rate',
        dependencies: ['quantity', 'rate'],
        fcxProps: {
          min: 0,
          minFractionDigits: 2,
          maxFractionDigits: 2
        }
      },
      {
        id: 'taxRate',
        fieldName: 'taxRate',
        header: 'VAT %',
        fieldType: 'dropdown',
        width: '100px',
        order: 8,
        visible: true,
        editable: true,
        required: false,
        mappable: true,
        align: 'center',
        options: [
          { label: '0%', value: 0 },
          { label: '5%', value: 5 },
          { label: '12%', value: 12 },
          { label: '18%', value: 18 },
          { label: '28%', value: 28 }
        ]
      },
      {
        id: 'vatAmount',
        fieldName: 'vatAmount',
        header: 'VAT Amount',
        fieldType: 'number',
        width: '120px',
        order: 9,
        visible: true,
        editable: true,
        required: false,
        mappable: true,
        align: 'right',
        formula: '(quantity * rate) * ((taxRate || 0) / 100)',
        dependencies: ['quantity', 'rate', 'taxRate'],
        fcxProps: {
          min: 0,
          minFractionDigits: 2,
          maxFractionDigits: 2
        }
      },
      {
        id: 'amount',
        fieldName: 'amount',
        header: 'Amount Incl. VAT',
        fieldType: 'number',
        width: '140px',
        order: 10,
        visible: true,
        editable: true,
        required: false,
        mappable: true,
        align: 'right',
        formula: '(quantity * rate) * (1 + (taxRate || 0) / 100)',
        dependencies: ['quantity', 'rate', 'taxRate'],
        fcxProps: {
          min: 0,
          minFractionDigits: 2,
          maxFractionDigits: 2
        }
      }
    ];
  };
  
  // Generate unique ID
  const generateId = () => {
    return `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Add new column
  const addColumn = (column: Omit<InvoiceTableColumn, 'id' | 'order'>) => {
    const newColumn: InvoiceTableColumn = {
      ...column,
      id: generateId(),
      order: columns.value.length + 1
    };
    columns.value.push(newColumn);
    return newColumn;
  };
  
  // Remove column
  const removeColumn = (columnId: string) => {
    const index = columns.value.findIndex(col => col.id === columnId);
    if (index > -1) {
      columns.value.splice(index, 1);
      reorderColumns();
    }
  };
  
  // Reorder columns
  const reorderColumns = () => {
    columns.value.forEach((col, index) => {
      col.order = index + 1;
    });
  };
  
  // Move column
  const moveColumn = (columnId: string, newOrder: number) => {
    const column = columns.value.find(col => col.id === columnId);
    if (!column) return;
    
    const oldOrder = column.order;
    column.order = newOrder;
    
    // Adjust other columns
    columns.value.forEach(col => {
      if (col.id === columnId) return;
      
      if (newOrder < oldOrder) {
        if (col.order >= newOrder && col.order < oldOrder) {
          col.order++;
        }
      } else {
        if (col.order > oldOrder && col.order <= newOrder) {
          col.order--;
        }
      }
    });
    
    sortColumnsByOrder();
  };
  
  // Sort columns by order
  const sortColumnsByOrder = () => {
    columns.value.sort((a, b) => a.order - b.order);
  };
  
  // Toggle column visibility
  const toggleColumnVisibility = (columnId: string) => {
    const column = columns.value.find(col => col.id === columnId);
    if (column) {
      column.visible = !column.visible;
    }
  };
  
  // Update column
  const updateColumn = (columnId: string, updates: Partial<InvoiceTableColumn>) => {
    const column = columns.value.find(col => col.id === columnId);
    if (column) {
      Object.assign(column, updates);
    }
  };
  
  // Visible columns
  const visibleColumns = computed(() => 
    columns.value
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order)
  );
  
  // Mappable columns
  const mappableColumns = computed(() =>
    columns.value.filter(col => col.mappable)
  );
  
  // Save configuration
  const saveConfig = (name: string, description?: string) => {
    const config: InvoiceTableConfig = {
      id: generateId(),
      name,
      description,
      columns: JSON.parse(JSON.stringify(columns.value)),
      defaultColumns: visibleColumns.value.map(col => col.id),
      createdDate: new Date(),
      updatedDate: new Date()
    };
    
    savedConfigs.value.push(config);
    // Persist to localStorage
    localStorage.setItem('invoiceTableConfigs', JSON.stringify(savedConfigs.value));
    return config;
  };
  
  // Load configuration
  const loadConfig = (configId: string) => {
    const config = savedConfigs.value.find(c => c.id === configId);
    if (config) {
      columns.value = JSON.parse(JSON.stringify(config.columns));
      sortColumnsByOrder();
    }
  };
  
  // Load saved configs from storage
  const loadSavedConfigs = () => {
    const saved = localStorage.getItem('invoiceTableConfigs');
    if (saved) {
      try {
        savedConfigs.value = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved configs:', e);
      }
    }
  };
  
  return {
    columns,
    visibleColumns,
    mappableColumns,
    savedConfigs,
    initializeDefaultColumns,
    addColumn,
    removeColumn,
    moveColumn,
    toggleColumnVisibility,
    updateColumn,
    saveConfig,
    loadConfig,
    loadSavedConfigs
  };
}
