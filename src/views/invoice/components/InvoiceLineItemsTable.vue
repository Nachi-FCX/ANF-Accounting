<template>
  <div class="invoice-line-items-table">
    <!-- Empty State - Show when no data -->
    <div v-if="rows.length === 0" class="empty-state-container">
      <div class="empty-state">
        <i class="pi pi-inbox empty-icon"></i>
        <h3>No Line Items</h3>
        <p>No line items data available. Upload and process a document to extract line items.</p>
      </div>
    </div>

    <!-- Table with Data -->
    <template v-else>
      <!-- Toolbar -->
      

    <!-- Table Container -->
    <div class="table-container">
      <FcxDataTable
        v-model:selection="selectedRows"
        :value="rows"
        :columns="dataTableColumns"
        dataKey="id"
        :showHeader="true"
        :showAddButton="false"
        :showRefreshButton="false"
        :showGlobalFilter="false"
        :paginator="false"
        :rows="100"
        stripedRows
        :resizableColumns="true"
        columnResizeMode="expand"
        class="fcx-invoice-datatable"
      >
        <!-- Custom Empty State -->
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-inbox empty-icon"></i>
            <p class="empty-text">No line items added yet</p>
            <FcxButton
              label="Add First Row"
              icon="pi pi-plus"
              @click="handleAddRow"
              size="small"
            />
          </div>
        </template>

        <!-- Dynamic Columns -->
        <Column
          v-for="column in visibleColumns"
          :key="column.id"
          :field="column.fieldName"
          :header="column.header"
          :style="{ width: column.width || 'auto', minWidth: column.minWidth || '100px' }"
          :sortable="true"
        >
          <template #body="slotProps">
            <div
              class="editable-cell"
              @click="handleCellClick(slotProps.data.id, column.id)"
              :class="{ 'is-editing': editingCell?.rowId === slotProps.data.id && editingCell?.columnId === column.id }"
            >
              <!-- Edit Mode -->
              <component
                v-if="editingCell?.rowId === slotProps.data.id && editingCell?.columnId === column.id"
                :is="getCellComponent(column)"
                v-model="slotProps.data[column.fieldName]"
                :name="`${column.fieldName}-${slotProps.data.id}`"
                v-bind="column.fcxProps"
                @blur="handleCellBlur"
                @keydown.enter="handleCellBlur"
                @keydown.escape="handleCellEscape"
                class="cell-input"
              />
              
              <!-- View Mode -->
              <span v-else class="cell-value">
                {{ formatCellValue(slotProps.data[column.fieldName], column) }}
              </span>
            </div>
          </template>
        </Column>

        <!-- Actions Column -->
        <Column
          :exportable="false"
          style="width: 100px; min-width: 100px"
          frozen
          alignFrozen="right"
        >
          <template #header>
            <span>Actions</span>
          </template>
          <template #body="{ data }">
            <div class="action-buttons">
              <FcxIconButton
                icon="pi pi-copy"
                severity="secondary"
                size="small"
                @click="handleDuplicateRow(data.id)"
                v-tooltip.top="'Duplicate'"
              />
              <FcxIconButton
                icon="pi pi-trash"
                severity="danger"
                size="small"
                @click="handleDeleteRow(data.id)"
                v-tooltip.top="'Delete'"
              />
            </div>
          </template>
        </Column>

        <!-- Footer Summary -->
        <template #footer v-if="rows.length > 0">
          <div class="table-summary">
            <div class="summary-label">Total Rows: {{ rows.length }}</div>
            <div class="summary-values">
              <div class="summary-item">
                <span class="summary-label">Subtotal:</span>
                <span class="summary-value">{{ formatCurrency(summary.subtotal) }}</span>
              </div>
              <div class="summary-item" v-if="summary.totalCGST || summary.totalSGST">
                <span class="summary-label">CGST+SGST:</span>
                <span class="summary-value">{{ formatCurrency((summary.totalCGST || 0) + (summary.totalSGST || 0)) }}</span>
              </div>
              <div class="summary-item" v-if="summary.totalIGST">
                <span class="summary-label">IGST:</span>
                <span class="summary-value">{{ formatCurrency(summary.totalIGST) }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Grand Total:</span>
                <span class="summary-value font-bold">{{ formatCurrency(summary.grandTotal) }}</span>
              </div>
            </div>
          </div>
        </template>
      </FcxDataTable>
    </div>
    
  
  
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { FcxButton, FcxIconButton } from '@/components/buttoncomponents';
import { FcxDataTable } from '@/components/datacomponents';
import { FcxInputtext, FcxInputNumber, FcxDropdown } from '@/components/formcomponents';
import Column from 'primevue/column';
import { useInvoiceTableColumns } from '../composables/useInvoiceTableColumns';
import { useInvoiceLineItems } from '../composables/useInvoiceLineItems';
import type { InvoiceLineItem } from '../types/invoice-table.types';
import type { InvoiceTableColumn } from '../types/invoice-table.types';

// Props
interface Props {
  lineItems: InvoiceLineItem[]
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

// Emits
const emit = defineEmits<{
  'update:lineItems': [value: InvoiceLineItem[]]
}>()

const {
  columns,
  visibleColumns,
  initializeDefaultColumns,
  toggleColumnVisibility
} = useInvoiceTableColumns();

const {
  rows,
  summary,
  addRow,
  addRows,
  updateRow,
  deleteRow,
  deleteRows,
  duplicateRow,
  clearAllRows,
  validateRows,
  populateFromOcr
} = useInvoiceLineItems();

// Sync rows with parent lineItems
watch(() => props.lineItems, (newLineItems) => {
  if (newLineItems && newLineItems.length > 0) {
    populateFromOcr(newLineItems);
  } else if (newLineItems?.length === 0 && rows.value.length > 0) {
    clearAllRows();
  }
}, { immediate: true, deep: true });

// Emit changes to parent
watch(rows, (newRows) => {
  emit('update:lineItems', newRows);
}, { deep: true });

const editingCell = ref<{ rowId: string; columnId: string } | null>(null);
const selectedRows = ref<string[]>([]);
const showColumnManager = ref(false);
const showAddMultipleDialog = ref(false);
const showDetailedSummary = ref(false);
const rowCountToAdd = ref(5);
const validationErrors = ref<Array<{ rowId: string; field: string; message: string }>>([]);

// Map invoice columns to DataTable columns format
const dataTableColumns = computed(() => {
  return visibleColumns.value.map(col => ({
    field: col.fieldName,
    header: col.header,
    dataType: col.fieldType === 'number' ? 'numeric' as const : 'text' as const,
    sortable: true,
    width: col.width,
    minWidth: col.minWidth
  }));
});

// Initialize
onMounted(() => {
  initializeDefaultColumns();
});

const handleAddRow = () => {
  addRow();
};

const handleAddMultipleRows = () => {
  addRows(rowCountToAdd.value);
  showAddMultipleDialog.value = false;
};

const handleCellClick = (rowId: string, columnId: string) => {
  editingCell.value = { rowId, columnId };
};

const handleCellUpdate = (rowId: string, field: string, value: any) => {
  updateRow(rowId, { [field]: value });
};

const handleCellBlur = () => {
  editingCell.value = null;
  // Validate after editing
  validationErrors.value = validateRows();
};

const handleCellEscape = () => {
  editingCell.value = null;
};

const handleDuplicateRow = (rowId: string) => {
  duplicateRow(rowId);
};

const handleDeleteRow = (rowId: string) => {
  deleteRow(rowId);
};

const handleDeleteSelected = () => {
  if (confirm(`Delete ${selectedRows.value.length} selected rows?`)) {
    deleteRows(selectedRows.value);
    selectedRows.value = [];
  }
};

const handleClearAll = () => {
  if (confirm('Clear all line items? This action cannot be undone.')) {
    clearAllRows();
    validationErrors.value = [];
  }
};

// Helper functions
const getCellComponent = (column: InvoiceTableColumn) => {
  switch (column.fieldType) {
    case 'number':
      return FcxInputNumber;
    case 'dropdown':
      return FcxDropdown;
    case 'text':
    default:
      return FcxInputtext;
  }
};

const formatCellValue = (value: any, column: InvoiceTableColumn) => {
  if (value === null || value === undefined || value === '') return '-';
  
  // Check if field is amount/rate/price (currency formatting)
  const currencyFields = ['amount', 'rate', 'price', 'total', 'subtotal'];
  const isCurrencyField = currencyFields.some(field => column.fieldName.toLowerCase().includes(field));
  
  if (column.fieldType === 'number' && isCurrencyField) {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2 
    }).format(value);
  }
  
  if (column.fieldType === 'number') {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  
  return value;
};

const formatCurrency = (value: number | undefined) => {
  if (!value) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(value);
};

// Expose methods for parent components
defineExpose({
  addRow,
  clearAllRows,
  validateRows,
  rows,
  summary
});
</script>

<style scoped lang="scss">
.invoice-line-items-table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--surface-card);
  border-radius: 8px;
  padding: 1rem;
  height: 100%;
}

.empty-state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 400px;
  background: var(--surface-ground);
  border-radius: 8px;
  border: 2px dashed var(--surface-border);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  
  .empty-icon {
    font-size: 4rem;
    color: var(--text-color-secondary);
    opacity: 0.5;
    margin-bottom: 1rem;
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
  }
  
  p {
    margin: 0;
    color: var(--text-color-secondary);
    font-size: 0.9375rem;
    max-width: 400px;
  }
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.table-container {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 600px;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
}

.fcx-invoice-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.fcx-invoice-datatable {
  :deep(.p-datatable-wrapper) {
    max-height: 600px;
    overflow-y: auto;
  }
  
  :deep(.p-datatable-thead) {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--surface-card);
  }
}

.editable-cell {
  cursor: pointer;
  padding: 0.5rem;
  min-height: 36px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  
  &:hover {
    background: var(--surface-hover);
  }
  
  &.is-editing {
    padding: 0.25rem;
  }
  
  .cell-input {
    width: 100%;
  }
  
  .cell-value {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
}

.table-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface-ground);
  border-top: 2px solid var(--surface-border);
  font-size: 0.875rem;
  
  .summary-values {
    display: flex;
    gap: 2rem;
  }
  
  .summary-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    
    .summary-label {
      font-weight: 600;
      color: var(--text-color-secondary);
    }
    
    .summary-value {
      font-weight: 700;
      color: var(--text-color);
      
      &.font-bold {
        font-size: 1.125rem;
        color: var(--primary-color);
      }
    }
  }
}

.empty-row {
  .empty-cell {
    padding: 3rem;
    text-align: center;
    border: 1px solid var(--surface-border);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-color-secondary);
}

.empty-icon {
  font-size: 3rem;
  color: var(--text-color-secondary);
  opacity: 0.5;
}

.empty-text {
  margin: 0;
  font-size: 1rem;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid var(--surface-border);
}

.row-count {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  font-weight: 500;
}

.add-multiple-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.column-manager {
  padding: 1rem 0;
}

.manager-hint {
  margin-bottom: 1rem;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.column-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.column-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  transition: background 0.2s;
  
  &:hover {
    background: var(--surface-hover);
  }
}

.column-name {
  flex: 1;
  font-weight: 500;
}

.column-badge {
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: var(--gray-100);
  color: var(--gray-700);
  font-weight: 600;
  
  &.mappable {
    background: var(--blue-100);
    color: var(--blue-700);
  }
}

// Responsive
@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .table-container {
    max-height: 400px;
  }
}
</style>
