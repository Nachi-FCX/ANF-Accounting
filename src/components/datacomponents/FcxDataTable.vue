<template>
  <div class="fcx-datatable" :class="tableWrapperClasses">
    <!-- Enhanced Table Header -->
    <div class="fcx-datatable__header" v-if="showHeader">
      <div class="fcx-datatable__header-content">
        <!-- Left side actions -->
        <div class="fcx-datatable__header-left">
          <FcxButton 
            v-if="clearShow" 
            label="Clear Filters" 
            icon="pi pi-filter-slash" 
            severity="secondary"
            size="small"
            @click="clearFilter"
            class="fcx-datatable__clear-btn"
          />
          
          <!-- Custom Action Buttons - Left -->
          <!-- <template v-for="button in leftActionButtons" :key="button.action">
            <FcxButton 
              :label="button.label"
              :icon="button.icon"
              :severity="button.severity || 'secondary'"
              :size="button.size || 'small'"
              :disabled="button.disabled"
              :loading="button.loading"
              :class="button.class"
              @click="handleButtonClick(button.action, button)"
              class="fcx-datatable__action-btn"
            />
          </template> -->
          
          <slot name="table-actions-left"></slot>
        </div>

        <!-- Right side actions -->
        <div class="fcx-datatable__header-right">
          <!-- Add Button -->
          <FcxButton 
            v-if="showAddButton" 
            :label="addButtonLabel" 
            :icon="addButtonIcon" 
            :severity="addButtonSeverity"
            size="small"
            @click="handleAddClick"
            class="fcx-datatable__add-btn"
          />
          
          <!-- Refresh Button -->
          <FcxButton 
            v-if="showRefreshButton" 
            :label="refreshButtonLabel" 
            icon="pi pi-refresh" 
            severity="secondary"
            size="small"
            @click="handleRefreshClick"
            class="fcx-datatable__refresh-btn"
          />
          
          <!-- Custom Action Buttons - Right -->
          <template v-for="button in rightActionButtons" :key="button.action">
            <FcxButton 
              :label="button.label"
              :icon="button.icon"
              :severity="button.severity || 'secondary'"
              :size="button.size || 'small'"
              :disabled="button.disabled"
              :loading="button.loading"
              :class="button.class"
              @click="handleButtonClick(button.action, button)"
              class="fcx-datatable__action-btn"
            />
          </template>
          
          <FcxButton 
            v-if="bulkimport" 
            label="Bulk Import" 
            icon="pi pi-upload" 
            severity="info"
            size="small"
            @click="triggerFileInput"
            class="fcx-datatable__import-btn"
          />

          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileUpload" 
            accept=".xlsx, .xls" 
            style="display: none" 
          />

          <slot name="table-actions1"></slot>
          
          <!-- Enhanced Search Input -->
          <div class="fcx-datatable__search-wrapper" v-if="showGlobalFilter">
            <FcxInputtext
              name="globalSearch"
              v-model="globalFilterValue"
              :placeholder="globalFilterPlaceholder"
              prefixIcon="pi pi-search"
              size="small"
              @input="onGlobalFilterEnhanced"
              class="fcx-datatable__search-input"
            />
          </div>

          <slot name="table-actions"></slot>

          <!-- Enhanced Export Button -->
          <div class="fcx-datatable__export-wrapper" v-if="exportStatus==0 && showExport">
            <FcxButton 
              icon="pi pi-download" 
              severity="secondary" 
              size="small"
              @click="toggle"
              class="fcx-datatable__export-btn"
              :class="{ 'fcx-datatable__export-btn--active': showExportMenu }"
            />
            
            <!-- Enhanced Export Menu -->
            <Transition name="export-menu">
              <div v-if="showExportMenu" class="fcx-datatable__export-overlay" @click="hideExportMenu">
                <div class="fcx-datatable__export-menu" @click.stop>
                  <div class="fcx-datatable__export-menu-header">
                    <span>Export Options</span>
                  </div>
                  <div class="fcx-datatable__export-menu-item" @click="exportToPDF">
                    <i class="pi pi-file-pdf"></i>
                    <div class="fcx-datatable__export-menu-item-content">
                      <span class="fcx-datatable__export-menu-item-title">Export as PDF</span>
                      <span class="fcx-datatable__export-menu-item-desc">Download table data as PDF</span>
                    </div>
                  </div>
                  <div class="fcx-datatable__export-menu-item" @click="exportToExcel">
                    <i class="pi pi-file-excel"></i>
                    <div class="fcx-datatable__export-menu-item-content">
                      <span class="fcx-datatable__export-menu-item-title">Export as Excel</span>
                      <span class="fcx-datatable__export-menu-item-desc">Download table data as XLSX</span>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Loading Overlay -->
    <div v-if="loading && showLoadingOverlay" class="fcx-datatable-loading-overlay" :style="{ opacity: loadingOverlayOpacity }">
      <div class="fcx-datatable-loading-content">
        <div class="fcx-datatable-loading-spinner"></div>
        <div class="fcx-datatable-loading-message">{{ loadingMessage }}</div>
      </div>
    </div>

    <DataTable
      ref="dataTableRef"
      v-bind="$attrs"
      :value="props.loading && props.showSkeleton ? skeletonData : props.value"
      :dataKey="props.dataKey"
      :rows="shouldShowPagination ? props.rows : totalDataCount"
      :totalRecords="props.totalRecords"
      :paginator="shouldShowPagination"
      :paginatorPosition="props.paginatorPosition"
      :paginatorTemplate="paginatorTemplate"
      :currentPageReportTemplate="currentPageReportTemplate"
      :rowsPerPageOptions="props.pageSizeOptions"
      :selectionMode="props.selectionMode"
      :selection="props.selection"
      :sortable="props.sortable"
      :sortField="props.sortField"
      :sortOrder="props.sortOrder"
      :multiSort="props.multiSort"
      v-model:filters="filters"
      :globalFilterFields="props.globalFilterFields"
      :loading="props.loading && !props.showSkeleton"
      :rowHover="props.rowHover"
      :showGridlines="props.showGridlines"
      :stripedRows="props.stripedRows"
      :scrollable="props.scrollable"
      :resizable="props.resizable"
      :resizableColumns="!!props.resizableColumns"
      :class="tableClasses"
      filterDisplay="menu"
      @selection-change="onSelectionChange"
      @page="onPageEnhanced"
      @sort="onSort"
      @filter="onFilter"
      @row-click="onRowClick"
      @row-dblclick="onRowDblClick"
    >
      <!-- Dynamic Columns -->
      <Column v-for="col in props.columns"
             :key="col.field"
             :field="col.field"
             :header="col.header"
             :sortable="col.sortable"
             :filterable="col.filterable"
             :frozen="col.frozen"
             :bodyClass="col.bodyClass"
             :headerClass="col.headerClass"
             :style="col.width ? { width: col.width } : undefined"
             :hidden="col.hidden">
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            class="p-column-filter-element"
            :placeholder="`Search by ${col.header.toLowerCase()}`"
            @input="applyColumnFilter(col.field)"
          />
        </template>

        <template #body="slotProps">
          <div v-if="props.loading && props.showSkeleton" 
               :class="['fcx-datatable__skeleton-item', `fcx-datatable__skeleton-item--${props.skeletonAnimation}`]">
            <div class="fcx-datatable__skeleton-bar"></div>
          </div>
          <slot v-else :name="'body-' + col.field" v-bind="slotProps">
            {{ slotProps.data[col.field] }}
          </slot>
        </template>
      </Column>

      <!-- Actions Column -->
      <Column v-if="props.showActionsColumn"
             field="actions"
             header="Actions"
             :sortable="false"
             :filterable="false"
             :frozen="false"
             :style="{ width: '120px' }"
             :hidden="false">
        <template #body="slotProps">
          <slot name="body-actions" v-bind="slotProps">
            <div class="fcx-datatable__actions-placeholder">
              <i class="pi pi-ellipsis-v"></i>
            </div>
          </slot>
        </template>
      </Column>

      <!-- Enhanced Empty State -->
      <template #empty>
        <div class="fcx-datatable-empty-state">
          <div class="fcx-datatable-empty-icon">
            <i :class="emptyIcon || 'pi pi-inbox'"></i>
          </div>
          <div class="fcx-datatable-empty-message">
            {{ emptyMessage || 'No records found' }}
          </div>
          <div class="fcx-datatable-empty-description" v-if="emptyDescription">
            {{ emptyDescription }}
          </div>
        </div>
      </template>

      <!-- Enhanced Loading Template -->
      <template #loading v-if="!showLoadingOverlay">
        <div class="fcx-datatable-loading-inline">
          <div class="fcx-datatable-loading-spinner"></div>
          <span>{{ loadingMessage }}</span>
        </div>
      </template>
    </DataTable>

    <!-- Error State -->
    <div v-if="errorState?.show" class="fcx-datatable__error-state">
      <div class="fcx-datatable__error-content">
        <i :class="errorState.icon" class="fcx-datatable__error-icon"></i>
        <h3 class="fcx-datatable__error-title">{{ errorState.title }}</h3>
        <p class="fcx-datatable__error-message">{{ errorState.message }}</p>
        <div class="fcx-datatable__error-actions">
          <FcxButton
            v-if="errorState.showRetry"
            :label="errorState.retryLabel"
            icon="pi pi-refresh"
            severity="primary"
            size="small"
            @click="handleErrorRetry"
            class="fcx-datatable__error-retry"
          />
          <FcxButton
            v-if="errorState.showSupport"
            :label="errorState.supportLabel"
            icon="pi pi-question-circle"
            severity="secondary"
            outlined
            size="small"
            @click="handleErrorSupport"
            class="fcx-datatable__error-support"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import type { DataTableFilterMeta, DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import type { 
  FcxDataTableProps, 
  FcxDataTableFilterEvent,
  DataTableActionButton,
  DataTableErrorState,
  DataTableCompleteState
} from './types/datatable-types'

defineOptions({
  name: 'fcxDataTable',
  inheritAttrs: false
})

const props = withDefaults(defineProps<FcxDataTableProps>(), {
  rows: 10,
  first: 0,
  totalRecords: 0,
  transactionStatus: 0,
  clearShow: true,
  paginator: false,
  paginatorPosition: 'bottom',
  paginatorTemplate: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
  currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries',
  pageSizeOptions: () => [10, 20, 30, 50],
  selectionMode: undefined,
  selection: undefined,
  sortable: false,
  sortField: undefined,
  sortOrder: undefined,
  multiSort: false,
  filterable: false,
  alignFrozen: '',
  frozen: false,
  bodyClass: '',
  loading: false,
  loadingMessage: 'Loading data...',
  showLoadingOverlay: true,
  loadingOverlayOpacity: 0.8,
  rowHover: true,
  showGridlines: false,
  stripedRows: false,
  size: 'medium',
  theme: 'default',
  rounded: false,
  raised: false,
  scrollable: false,
  resizable: false,
  resizableColumns: undefined,
  rtl: false,
  responsive: false,
  ariaLabel: 'Data Table',
  paginatorAriaLabel: 'Pagination',
  filterDisplay: undefined,
  globalFilterFields: () => [],
  globalFilterPlaceholder: 'Search records...',
  showGlobalFilter: true,
  showFilterMatchModes: true,
  filterMenuStyle: undefined,
  importStatus: 0,
  exportStatus: 0,
  importshow: false,
  bulkimport: true,
  showExport: true,
  showHeader: true,
  emptyMessage: 'No records found',
  emptyIcon: 'pi pi-inbox',
  emptyDescription: undefined,
  showSkeleton: false,
  skeletonRows: 5,
  skeletonAnimation: 'wave',
  actionButtons: () => [],
  showAddButton: false,
  addButtonLabel: 'Add',
  addButtonIcon: 'pi pi-plus',
  addButtonSeverity: 'primary',
  showRefreshButton: false,
  refreshButtonLabel: 'Refresh',
  errorState: () => ({
    show: false,
    title: 'Error',
    message: 'An error occurred',
    icon: 'pi pi-exclamation-triangle',
    showRetry: true,
    retryLabel: 'Retry',
    showSupport: false,
    supportLabel: 'Contact Support'
  }),
  showActionsColumn: false
})

const emit = defineEmits([
  'update:selection',
  'selection-change',
  'update:first',
  'page',
  'update:sortField',
  'update:sortOrder',
  'sort',
  'update:filters',
  'filter',
  'row-click',
  'row-dblclick',
  'excel-data-import',
  'importclick',
  // Button action events
  'add-click',
  'refresh-click',
  'button-click',
  // State management events
  'state-change',
  'error-retry',
  'error-support',
  // Selection events
  'select-all',
  'unselect-all',
  'selection-clear',
  // Pagination events
  'page-size-change',
  'pagination-change'
])

const dataTableRef = ref()
const globalFilterValue = ref('')
const showExportMenu = ref(false)

interface FilterMetaData {
  value: any
  matchMode: string
}

interface OperatorFilterMetaData {
  operator: string
  constraints: Array<{
    value: any
    matchMode: string
  }>
}
const fileInput: any = ref(null);

const triggerFileInput = () => {
if(props.importStatus==0){
emit('importclick')
}else{
  if (fileInput.value) {
    fileInput.value.click();
  }
}

};

const filters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS } as FilterMetaData,
  ...props.columns.reduce((acc, col) => ({
    ...acc,
    [col.field]: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    } as OperatorFilterMetaData
  }), {} as DataTableFilterMeta)
})

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS } as FilterMetaData,
    ...props.columns.reduce((acc, col) => ({
      ...acc,
      [col.field]: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
      } as OperatorFilterMetaData
    }), {} as DataTableFilterMeta)
  }
  globalFilterValue.value = ''
  emit('update:filters', filters.value)
}

const onGlobalFilter = () => {
  const globalFilter = filters.value.global as FilterMetaData
  globalFilter.value = globalFilterValue.value
  emit('update:filters', filters.value)
}

const clearColumnFilter = (field: string) => {
  if (filters.value[field]) {
    filters.value[field] = {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    } as OperatorFilterMetaData
    emit('update:filters', filters.value)
  }
}

const applyColumnFilter = (field: string) => {
  emit('update:filters', filters.value)
  emit('filter', {
    filters: filters.value,
    field
  })
}

const onSelectionChange = (event: { value: any }) => {
  emit('update:selection', event.value)
  emit('selection-change', event.value)
}

const onPage = (event: DataTablePageEvent) => {
  emit('update:first', event.first)
  emit('page', {
    page: Math.floor(event.first / props.rows!),
    first: event.first,
    rows: event.rows,
    pageCount: Math.ceil(props.totalRecords! / event.rows)
  })
}

const onSort = (event: DataTableSortEvent) => {
  const { sortField, sortOrder } = event
  emit('update:sortField', sortField)
  emit('update:sortOrder', sortOrder)
  emit('sort', { sortField, sortOrder })
}

const onFilter = (event: FcxDataTableFilterEvent) => {
  emit('update:filters', event.filters)
  emit('filter', event)
}

const onRowClick = (event: { originalEvent: Event; data: Record<string, unknown>; index: number }) => {
  emit('row-click', event)
}

const onRowDblClick = (event: { originalEvent: Event; data: Record<string, unknown>; index: number }) => {
  emit('row-dblclick', event)
}

// Button click handlers
const handleAddClick = () => {
  emit('add-click')
}

const handleRefreshClick = () => {
  tableState.value.ui.refreshing = true
  emit('refresh-click')
  // Reset refreshing state after a short delay
  setTimeout(() => {
    tableState.value.ui.refreshing = false
  }, 1000)
}

const handleButtonClick = (action: string, button: any) => {
  emit('button-click', { action, button })
}

// Error state handlers
const handleErrorRetry = () => {
  emit('error-retry')
}

const handleErrorSupport = () => {
  emit('error-support')
}


// Enhanced pagination handlers
const onPageEnhanced = (event: any) => {
  const newPage = Math.floor(event.first / event.rows)
  tableState.value.pagination.currentPage = newPage
  tableState.value.pagination.pageSize = event.rows
  
  emit('update:first', event.first)
  emit('page', {
    page: newPage,
    first: event.first,
    rows: event.rows,
    pageCount: Math.ceil(props.totalRecords! / event.rows)
  })
  emit('pagination-change', tableState.value.pagination)
  updateTableState()
}

// Enhanced selection management
const handleSelectAll = () => {
  tableState.value.selection.isAllSelected = true
  tableState.value.selection.isSomeSelected = false
  emit('select-all')
  updateTableState()
}

const handleUnselectAll = () => {
  tableState.value.selection.isAllSelected = false
  tableState.value.selection.isSomeSelected = false
  emit('unselect-all')
  updateTableState()
}

const handleSelectionClear = () => {
  tableState.value.selection.selected = []
  tableState.value.selection.isAllSelected = false
  tableState.value.selection.isSomeSelected = false
  emit('selection-clear')
  updateTableState()
}

// Enhanced filter management
const onGlobalFilterEnhanced = () => {
  const globalFilter = filters.value.global as any
  globalFilter.value = globalFilterValue.value
  tableState.value.filter.globalFilter = globalFilterValue.value
  
  // Count active filters
  let activeCount = globalFilterValue.value ? 1 : 0
  Object.keys(filters.value).forEach(key => {
    if (key !== 'global') {
      const filterValue = filters.value[key]
      // Check if it's an operator filter with constraints
      if (filterValue && typeof filterValue === 'object' && 'constraints' in filterValue) {
        const operatorFilter = filterValue as any
        if (operatorFilter.constraints?.[0]?.value) {
          activeCount++
        }
      }
      // Check if it's a simple filter with value
      else if (filterValue && typeof filterValue === 'object' && 'value' in filterValue) {
        const simpleFilter = filterValue as any
        if (simpleFilter.value) {
          activeCount++
        }
      }
    }
  })
  tableState.value.filter.activeFiltersCount = activeCount
  
  emit('update:filters', filters.value)
  updateTableState()
}
const handleFileUpload = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files ? input.files[0] : null;
      if (file) {
        try {
          // Read the Excel file
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const data = e.target?.result;
              // Import exceljs dynamically
              const ExcelJS = await import('exceljs');

              // Parse the Excel data
              const workbook = new ExcelJS.Workbook();
              await workbook.xlsx.load(data);
              const worksheet = workbook.getWorksheet(1);

              // Convert to JSON
              const jsonData: any[] = [];
              worksheet?.eachRow((row: any, rowNumber: number) => {
                if (rowNumber === 1) return; // Skip header row
                const rowData: any = {};
                row.eachCell((cell: any, colNumber: number) => {
                  const headerCell = worksheet.getCell(1, colNumber);
                  const headerValue = headerCell.value?.toString() || `Column${colNumber}`;
                  rowData[headerValue] = cell.value;
                });
                jsonData.push(rowData);
              });

              console.log("Excel data parsed successfully", jsonData);

              // Emit the parsed data to the parent component
              emit("excel-data-import", jsonData);

              // Reset the file input
              if (fileInput.value) {
                fileInput.value.value = '';
              }
            } catch (error) {
              console.error("Error parsing Excel file", error);
            }
          };
          reader.readAsArrayBuffer(file);
        } catch (error) {
          console.error("Error uploading file", error);
        }
      }
    };
// Computed property to determine if pagination should be shown
const shouldShowPagination = computed(() => {
  if (!props.paginator) return false
  const dataLength = props.value?.length || 0
  return dataLength > (props.rows || 10)
})

// Computed property to get total data count for non-paginated view
const totalDataCount = computed(() => {
  return props.value?.length || 0
})

// Computed property for skeleton data
const skeletonData = computed(() => {
  if (!props.loading || !props.showSkeleton) return []
  
  return Array.from({ length: props.skeletonRows || 5 }, (_, index) => {
    const skeletonRow: Record<string, any> = { id: `skeleton-${index}` }
    props.columns.forEach(col => {
      skeletonRow[col.field] = ''
    })
    return skeletonRow
  })
})

// Computed properties for action buttons
const leftActionButtons = computed(() => {
  return props.actionButtons?.filter(button => button.position === 'left') || []
})

const rightActionButtons = computed(() => {
  return props.actionButtons?.filter(button => button.position === 'right') || []
})

// Comprehensive state management
const tableState = ref({
  pagination: {
    currentPage: Math.floor(props.first / (props.rows || 10)),
    pageSize: props.rows || 10,
    totalRecords: props.totalRecords || 0,
    totalPages: Math.ceil((props.totalRecords || 0) / (props.rows || 10)),
    pageSizeOptions: props.pageSizeOptions || [10, 20, 30, 50],
    enabled: props.paginator || false,
    position: props.paginatorPosition || 'bottom'
  },
  selection: {
    selected: props.selection || [],
    mode: props.selectionMode || null,
    isAllSelected: false,
    isSomeSelected: false
  },
  filter: {
    globalFilter: globalFilterValue.value,
    columnFilters: {},
    activeFiltersCount: 0,
    debounceDelay: 300
  },
  sort: {
    field: props.sortField || null,
    order: props.sortOrder === 1 ? 'asc' : props.sortOrder === -1 ? 'desc' : null,
    multiSort: [],
    multiSortEnabled: props.multiSort || false
  },
  ui: {
    skeleton: props.showSkeleton || false,
    overlay: props.showLoadingOverlay || false,
    refreshing: false
  }
})

// Watch for prop changes and update state
const updateTableState = () => {
  tableState.value.pagination = {
    ...tableState.value.pagination,
    currentPage: Math.floor(props.first / (props.rows || 10)),
    pageSize: props.rows || 10,
    totalRecords: props.totalRecords || 0,
    totalPages: Math.ceil((props.totalRecords || 0) / (props.rows || 10))
  }
  
  emit('state-change', tableState.value)
}

const tableWrapperClasses = computed(() => [
  'fcx-datatable',
  {
    // Size variants
    'fcx-datatable--small': props.size === 'small',
    'fcx-datatable--medium': props.size === 'medium',
    'fcx-datatable--large': props.size === 'large',
    
    // Theme variants
    'fcx-datatable--default': props.theme === 'default',
    'fcx-datatable--minimal': props.theme === 'minimal',
    'fcx-datatable--bordered': props.theme === 'bordered',
    'fcx-datatable--compact': props.theme === 'compact',
    
    // Style options
    'fcx-datatable--rounded': props.rounded,
    'fcx-datatable--raised': props.raised,
    'fcx-datatable--striped': props.stripedRows,
    'fcx-datatable--gridlines': props.showGridlines,
    'fcx-datatable--hoverable': props.rowHover,
    
    // State classes
    'fcx-datatable--loading': props.loading,
    'fcx-datatable--responsive': props.responsive
  }
])

const tableClasses = computed(() => [
  'p-datatable p-component',
  {
    'p-datatable-hoverable-rows': props.rowHover,
    'p-datatable-auto-layout': !props.scrollable,
    'p-datatable-resizable': props.resizable,
    'p-datatable-resizable-fit': props.resizableColumns === 'fit',
    'p-datatable-striped': props.stripedRows,
    'p-datatable-gridlines': props.showGridlines,
    'p-datatable-rtl': props.rtl,
    'p-datatable-responsive': props.responsive,
    [`p-datatable-${props.size}`]: props.size !== 'normal'
  }
])

const menu = ref()
const items = ref([
  {
    label: 'Export',
    items: [
      {
        label: 'PDF',
        icon: 'pi pi-file-pdf',
        command: () => exportToPDF()
      },
      {
        label: 'Excel',
        icon: 'pi pi-file-excel',
        command: () => exportToExcel()
      },
      // {
      //   label: 'CSV',
      //   icon: 'pi pi-download',
      //   command: () => exportToCSV()
      // }
    ]
  }
])
const toggle = (event: Event) => {
  showExportMenu.value = !showExportMenu.value
}

const hideExportMenu = () => {
  showExportMenu.value = false
}
//
// Helper function to get base64 image
const getBase64Image = async (imgPath: string): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onerror = () => {
        console.error('Error loading image:', imgPath);
        resolve('');
      };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          console.error('Could not get canvas context');
          resolve('');
        }
      };
      img.src = imgPath;
    } catch (error) {
      console.error('Error in getBase64Image:', error);
      resolve('');
    }
  });
};

const exportToPDF = async () => {
  try {
    // Dynamically import required libraries
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;

    // Get data from the table
    const rawData = props.value || [];

    if (rawData.length === 0) {
      console.warn('No data to export');
      hideExportMenu();
      return;
    }

    // Get column definitions
    const columns = props.transactionStatus === 0 ? props.columns : props.exportcolumns || [];

    // Filter out Action and Status columns
    const filteredColumns = columns.filter((col: any) => {
      const headerLower = col.header.toLowerCase();
      return !headerLower.includes('action') &&
             !headerLower.includes('status') &&
             !headerLower.includes('active') &&
             !headerLower.includes('inactive');
    });

    // Create PDF document
    const pdf = new jsPDF('l', 'mm', 'a4'); // landscape orientation for better table fit

    // Prepare headers and data for autotable
    const headers = filteredColumns.map((col: any) => col.header);
    const data = rawData.map((row: any) =>
      filteredColumns.map((col: any) => String(row[col.field] || ''))
    );

    // Add title
    const title = 'Data Export';
    const pageWidth = pdf.internal.pageSize.width;
    
    pdf.setFontSize(16);
    pdf.text(title, pageWidth/2, 20, { align: 'center' });

    // Add table to PDF
    autoTable(pdf, {
      head: [headers],
      body: data as any[][],
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202], textColor: 255 },
      margin: { top: 30 },
      styles: { overflow: 'linebreak', cellWidth: 'auto' },
      columnStyles: { text: { cellWidth: 'auto' } },
      didDrawPage: (hookData: any) => {
        // Add page number
        pdf.text(`Page ${hookData.pageNumber} of ${pdf.getNumberOfPages()}`,
                 pageWidth / 2,
                 pdf.internal.pageSize.height - 10,
                 { align: 'center' });
      }
    });

    // Save the PDF
    pdf.save('table-export.pdf');
    hideExportMenu();
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    hideExportMenu();
  }
}

const exportToExcel = async () => {
  try {
    // Get data from the table
    const rawData = props.value || [];

    if (rawData.length === 0) {
      console.warn('No data to export');
      hideExportMenu();
      return;
    }

    // Get column definitions
    const columns = props.transactionStatus === 0 ? props.columns : props.exportcolumns || [];

    // Filter out Action and Status columns
    const filteredColumns = columns.filter((col: any) => {
      const headerLower = col.header.toLowerCase();
      return !headerLower.includes('action') &&
             !headerLower.includes('status') &&
             !headerLower.includes('active') &&
             !headerLower.includes('inactive');
    });

    // Format data to match headers, excluding Action and Status fields
    const formattedData = rawData.map((row: any) => {
      const formattedRow: Record<string, any> = {};
      filteredColumns.forEach((col: any) => {
        // Use header as the key and field value as the value
        formattedRow[col.header] = row[col.field];
      });
      return formattedRow;
    });

    // Dynamically import exceljs
    const ExcelJS = await import('exceljs');
    
    // Create a workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add headers
    if (formattedData.length > 0) {
      const headers = Object.keys(formattedData[0]);
      worksheet.addRow(headers);
      
      // Add data rows
      formattedData.forEach(row => {
        const values = headers.map(header => row[header]);
        worksheet.addRow(values);
      });
    }

    // Generate Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'table-export.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
    hideExportMenu();
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    hideExportMenu();
  }
}

const exportToCSV = () => {

}

</script>

<style lang="scss">
@use './styles/fcx-datatable.scss';
</style>
