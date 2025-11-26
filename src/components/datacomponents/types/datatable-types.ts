import type { Component } from 'vue'
import type { DataTableProps as PrimeDataTableProps, DataTableFilterMeta } from 'primevue/datatable'

// Base data table props extending PrimeVue DataTable
export interface DataTableProps extends Omit<PrimeDataTableProps, 'class' | 'style' | 'loadingIcon'> {
  /** Custom CSS classes */
  class?: string
  /** Custom inline styles */
  style?: string | Record<string, any>
  /** Component size variant */
  size?: 'small' | 'medium' | 'large'
  /** Whether table has striped rows */
  stripedRows?: boolean
  /** Whether to show grid lines */
  showGridlines?: boolean
  /** Whether table has hover effect on rows */
  hoverable?: boolean
  /** Whether table has rounded corners */
  rounded?: boolean
  /** Whether table has shadow */
  raised?: boolean
  /** Custom loading icon */
  loadingIcon?: Component | string
  /** Custom loading message */
  loadingMessage?: string
  /** Custom empty state message */
  emptyMessage?: string
  /** Custom empty state icon */
  emptyIcon?: Component | string
  /** Whether to show loading overlay */
  showLoadingOverlay?: boolean
  /** Loading overlay opacity */
  loadingOverlayOpacity?: number
  /** Custom table theme */
  theme?: 'default' | 'minimal' | 'bordered' | 'compact'
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** ARIA description for accessibility */
  ariaDescription?: string
}

// Column configuration interface
export interface DataTableColumn {
  /** Column field name */
  field: string
  /** Column header text */
  header: string
  /** Column data type */
  dataType?: 'text' | 'numeric' | 'boolean' | 'date'
  /** Whether column is sortable */
  sortable?: boolean
  /** Whether column is filterable */
  filterable?: boolean
  /** Column width */
  width?: string
  /** Column minimum width */
  minWidth?: string
  /** Column maximum width */
  maxWidth?: string
  /** Column alignment */
  align?: 'left' | 'center' | 'right'
  /** Whether column is frozen */
  frozen?: boolean
  /** Frozen position */
  frozenPosition?: 'left' | 'right'
  /** Custom column class */
  columnClass?: string
  /** Custom header class */
  headerClass?: string
  /** Custom body class */
  bodyClass?: string
  /** Custom footer class */
  footerClass?: string
  /** Column visibility */
  hidden?: boolean
  /** Column export configuration */
  exportable?: boolean
  /** Custom format function */
  format?: (value: any, rowData: any) => string
  /** Custom filter match mode */
  filterMatchMode?: string
  /** Custom filter function */
  filterFunction?: (value: any, filter: any) => boolean
}

// Selection configuration
export interface DataTableSelection {
  /** Selection mode */
  mode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton'
  /** Whether to use meta key for selection */
  metaKeySelection?: boolean
  /** Selection comparison field */
  compareSelectionBy?: 'equals' | 'deepEquals'
  /** Whether selection is disabled */
  disabled?: boolean
  /** Custom selection validator */
  validator?: (rowData: any) => boolean
}

// Pagination configuration
export interface DataTablePagination {
  /** Whether pagination is enabled */
  enabled?: boolean
  /** Number of rows per page */
  rows?: number
  /** Current page (0-based) */
  first?: number
  /** Total number of records */
  totalRecords?: number
  /** Rows per page options */
  rowsPerPageOptions?: number[]
  /** Pagination position */
  position?: 'top' | 'bottom' | 'both'
  /** Custom pagination template */
  template?: string
  /** Whether to show current page report */
  showCurrentPageReport?: boolean
  /** Current page report template */
  currentPageReportTemplate?: string
  /** Whether to show jump to page dropdown */
  showJumpToPageDropdown?: boolean
  /** Whether to show jump to page input */
  showJumpToPageInput?: boolean
  /** Whether to show page links */
  showPageLinks?: boolean
  /** Number of page links to show */
  pageLinkSize?: number
}

// Filtering configuration
export interface DataTableFiltering {
  /** Filter display mode */
  display?: 'menu' | 'row'
  /** Global filter fields */
  globalFilterFields?: string[]
  /** Filter locale */
  locale?: string
  /** Filter delay in milliseconds */
  filterDelay?: number
  /** Whether filters are case sensitive */
  caseSensitive?: boolean
  /** Custom filter constraints */
  constraints?: Record<string, any>
}

// Sorting configuration
export interface DataTableSorting {
  /** Sort mode */
  mode?: 'single' | 'multiple'
  /** Whether sort is removable */
  removableSort?: boolean
  /** Default sort field */
  defaultSortField?: string
  /** Default sort order */
  defaultSortOrder?: 1 | -1
  /** Custom sort function */
  customSort?: (event: any) => void
}

// Export configuration
export interface DataTableExport {
  /** Export filename */
  filename?: string
  /** Export function */
  exportFunction?: (options: any) => void
  /** Export selection only */
  selectionOnly?: boolean
  /** Export visible columns only */
  visibleColumnsOnly?: boolean
}

// Virtual scrolling configuration
export interface DataTableVirtualScroll {
  /** Whether virtual scrolling is enabled */
  enabled?: boolean
  /** Item size for virtual scrolling */
  itemSize?: number
  /** Scroll height */
  scrollHeight?: string
  /** Scroll direction */
  scrollDirection?: 'vertical' | 'horizontal' | 'both'
  /** Buffer size */
  buffer?: number
  /** Delay for scroll events */
  delay?: number
  /** Whether to show spacer */
  showSpacer?: boolean
  /** Loading template */
  loadingTemplate?: string
}

// Row expansion configuration
export interface DataTableRowExpansion {
  /** Expanded rows */
  expandedRows?: any[]
  /** Row expansion mode */
  mode?: 'single' | 'multiple'
  /** Custom expansion validator */
  validator?: (rowData: any) => boolean
  /** Expansion icon */
  expandIcon?: Component | string
  /** Collapse icon */
  collapseIcon?: Component | string
}

// Row grouping configuration
export interface DataTableRowGrouping {
  /** Row group mode */
  mode?: 'subheader' | 'rowspan'
  /** Group rows by field */
  groupRowsBy?: string
  /** Sort grouped header */
  sortableGroupHeaderColumns?: boolean
  /** Expandable row groups */
  expandableRowGroups?: boolean
  /** Expanded row groups */
  expandedRowGroups?: any[]
  /** Group header template */
  groupHeaderTemplate?: string
  /** Group footer template */
  groupFooterTemplate?: string
}

// Loading state configuration
export interface DataTableLoading {
  /** Whether table is loading */
  loading?: boolean
  /** Loading icon */
  loadingIcon?: Component | string
  /** Loading message */
  loadingMessage?: string
  /** Loading template */
  loadingTemplate?: string
  /** Show loading overlay */
  showOverlay?: boolean
  /** Overlay opacity */
  overlayOpacity?: number
  /** Overlay background color */
  overlayBackground?: string
}

// Data table events
export interface DataTableEvents {
  /** Row select event */
  'row-select': [event: { originalEvent: Event; data: any; index: number; type: string }]
  /** Row unselect event */
  'row-unselect': [event: { originalEvent: Event; data: any; index: number; type: string }]
  /** Selection change event */
  'selection-change': [event: { originalEvent: Event; value: any }]
  /** Row click event */
  'row-click': [event: { originalEvent: Event; data: any; index: number }]
  /** Row double click event */
  'row-dblclick': [event: { originalEvent: Event; data: any; index: number }]
  /** Row context menu event */
  'row-contextmenu': [event: { originalEvent: Event; data: any; index: number }]
  /** Row expand event */
  'row-expand': [event: { originalEvent: Event; data: any }]
  /** Row collapse event */
  'row-collapse': [event: { originalEvent: Event; data: any }]
  /** Page change event */
  'page': [event: { originalEvent: Event; first: number; rows: number; page: number; pageCount: number }]
  /** Sort change event */
  'sort': [event: { originalEvent: Event; sortField: string; sortOrder: number; multiSortMeta: any[] }]
  /** Filter change event */
  'filter': [event: { originalEvent: Event; filters: any }]
  /** Column resize end event */
  'column-resize-end': [event: { originalEvent: Event; element: HTMLElement; delta: number }]
  /** Column reorder event */
  'column-reorder': [event: { originalEvent: Event; dragIndex: number; dropIndex: number }]
  /** Row reorder event */
  'row-reorder': [event: { originalEvent: Event; dragIndex: number; dropIndex: number; value: any[] }]
  /** Cell edit init event */
  'cell-edit-init': [event: { originalEvent: Event; data: any; field: string; index: number }]
  /** Cell edit complete event */
  'cell-edit-complete': [event: { originalEvent: Event; data: any; newData: any; field: string; index: number }]
  /** Cell edit cancel event */
  'cell-edit-cancel': [event: { originalEvent: Event; data: any; field: string; index: number }]
  /** Row edit init event */
  'row-edit-init': [event: { originalEvent: Event; data: any; newData: any; field: string; index: number }]
  /** Row edit save event */
  'row-edit-save': [event: { originalEvent: Event; data: any; newData: any; field: string; index: number }]
  /** Row edit cancel event */
  'row-edit-cancel': [event: { originalEvent: Event; data: any; field: string; index: number }]
  /** State save event */
  'state-save': [event: { originalEvent: Event; state: any }]
  /** State restore event */
  'state-restore': [event: { originalEvent: Event; state: any }]
}

// Data table size configuration
export interface DataTableSizeConfig {
  fontSize: string
  padding: string
  headerPadding: string
  rowHeight: string
  headerHeight: string
  borderRadius: string
}

// Data table theme configuration
export interface DataTableThemeConfig {
  background: string
  headerBackground: string
  headerColor: string
  headerBorder: string
  rowBackground: string
  rowAlternateBackground: string
  rowHoverBackground: string
  rowSelectedBackground: string
  rowColor: string
  rowSelectedColor: string
  border: string
  borderRadius: string
  shadow: string
}

// Data table state
export interface DataTableState {
  /** Current selection */
  selection: any
  /** Current filters */
  filters: any
  /** Current sort field */
  sortField: string
  /** Current sort order */
  sortOrder: number
  /** Current multi sort meta */
  multiSortMeta: any[]
  /** Current first row */
  first: number
  /** Current rows per page */
  rows: number
  /** Expanded rows */
  expandedRows: any[]
  /** Expanded row groups */
  expandedRowGroups: any[]
  /** Column widths */
  columnWidths: Record<string, string>
  /** Column order */
  columnOrder: string[]
}

// Utility types
export type DataTableSize = 'small' | 'medium' | 'large'
export type DataTableElement = HTMLDivElement
export type DataTableRef = DataTableElement | null

// Component exposure interface
export interface DataTableExpose {
  /** Export CSV */
  exportCSV: (options?: any) => void
  /** Reset table state */
  reset: () => void
  /** Clear selection */
  clearSelection: () => void
  /** Clear filters */
  clearFilters: () => void
  /** Clear sort */
  clearSort: () => void
  /** Get table element */
  getElement: () => DataTableElement | null
  /** Get current state */
  getState: () => DataTableState
  /** Restore state */
  restoreState: (state: DataTableState) => void
}

// FcxDataTable specific props interface
export interface FcxDataTableProps {
  /** Table data */
  value?: any[]
  /** Data key field */
  dataKey?: string
  /** Number of rows per page */
  rows?: number
  /** First row index */
  first?: number
  /** Total number of records */
  totalRecords?: number
  /** Transaction status */
  transactionStatus?: number
  /** Show clear filter button */
  clearShow?: boolean
  /** Enable pagination */
  paginator?: boolean
  /** Paginator position */
  paginatorPosition?: 'top' | 'bottom' | 'both'
  /** Paginator template */
  paginatorTemplate?: string
  /** Current page report template */
  currentPageReportTemplate?: string
  /** Page size options */
  pageSizeOptions?: number[]
  /** Selection mode */
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton'
  /** Selected items */
  selection?: any
  /** Enable sorting */
  sortable?: boolean
  /** Sort field */
  sortField?: string
  /** Sort order */
  sortOrder?: number
  /** Enable multi-sort */
  multiSort?: boolean
  /** Enable filtering */
  filterable?: boolean
  /** Align frozen columns */
  alignFrozen?: string
  /** Frozen columns */
  frozen?: boolean
  /** Body class */
  bodyClass?: string
  /** Loading state */
  loading?: boolean
  /** Loading message */
  loadingMessage?: string
  /** Show loading overlay */
  showLoadingOverlay?: boolean
  /** Loading overlay opacity */
  loadingOverlayOpacity?: number
  /** Row hover effect */
  rowHover?: boolean
  /** Show grid lines */
  showGridlines?: boolean
  /** Striped rows */
  stripedRows?: boolean
  /** Table size */
  size?: 'small' | 'normal' | 'medium' | 'large'
  /** Table theme */
  theme?: 'default' | 'minimal' | 'bordered' | 'compact'
  /** Rounded corners */
  rounded?: boolean
  /** Raised shadow */
  raised?: boolean
  /** Scrollable table */
  scrollable?: boolean
  /** Resizable table */
  resizable?: boolean
  /** Resizable columns */
  resizableColumns?: boolean | 'fit'
  /** RTL support */
  rtl?: boolean
  /** Responsive table */
  responsive?: boolean
  /** ARIA label */
  ariaLabel?: string
  /** Paginator ARIA label */
  paginatorAriaLabel?: string
  /** Filter display mode */
  filterDisplay?: 'menu' | 'row'
  /** Global filter fields */
  globalFilterFields?: string[]
  /** Global filter placeholder */
  globalFilterPlaceholder?: string
  /** Show global filter */
  showGlobalFilter?: boolean
  /** Show filter match modes */
  showFilterMatchModes?: boolean
  /** Filter menu style */
  filterMenuStyle?: any
  /** Import status */
  importStatus?: number
  /** Export status */
  exportStatus?: number
  /** Show import button */
  importshow?: boolean
  /** Show bulk import button */
  bulkimport?: boolean
  /** Show export button */
  showExport?: boolean
  /** Show header */
  showHeader?: boolean
  /** Empty message */
  emptyMessage?: string
  /** Empty icon */
  emptyIcon?: string
  /** Empty description */
  emptyDescription?: string
  /** Show skeleton loading instead of regular loading */
  showSkeleton?: boolean
  /** Number of skeleton rows to show */
  skeletonRows?: number
  /** Skeleton animation type */
  skeletonAnimation?: 'wave' | 'pulse' | 'none'
  /** Custom action buttons configuration */
  actionButtons?: DataTableActionButton[]
  /** Show add button */
  showAddButton?: boolean
  /** Add button label */
  addButtonLabel?: string
  /** Add button icon */
  addButtonIcon?: string
  /** Add button severity */
  addButtonSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger'
  /** Show refresh button */
  showRefreshButton?: boolean
  /** Refresh button label */
  refreshButtonLabel?: string
  /** Error state configuration */
  errorState?: DataTableErrorState
  /** Table columns */
  columns: DataTableColumn[]
  /** Export columns */
  exportcolumns?: DataTableColumn[]
  /** Show actions column */
  showActionsColumn?: boolean
}

// Filter event interface
export interface FcxDataTableFilterEvent {
  /** Original event */
  originalEvent?: Event
  /** Filter values */
  filters: DataTableFilterMeta
  /** Filter field */
  field?: string
}

// Action Button Configuration
export interface DataTableActionButton {
  /** Button label */
  label: string
  /** Button icon */
  icon?: string
  /** Button severity/color */
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger'
  /** Button size */
  size?: 'small' | 'medium' | 'large'
  /** Button position */
  position?: 'left' | 'right'
  /** Button click handler key */
  action: string
  /** Whether button is disabled */
  disabled?: boolean
  /** Whether button is loading */
  loading?: boolean
  /** Button tooltip */
  tooltip?: string
  /** Custom CSS classes */
  class?: string
}

// Error State Configuration
export interface DataTableErrorState {
  /** Whether to show error state */
  show?: boolean
  /** Error title */
  title?: string
  /** Error message */
  message?: string
  /** Error icon */
  icon?: string
  /** Show retry button */
  showRetry?: boolean
  /** Retry button label */
  retryLabel?: string
  /** Show support button */
  showSupport?: boolean
  /** Support button label */
  supportLabel?: string
}

// Success State Configuration
export interface DataTableSuccessState {
  /** Whether to show success state */
  show?: boolean
  /** Success title */
  title?: string
  /** Success message */
  message?: string
  /** Success icon */
  icon?: string
  /** Auto hide duration (ms) */
  autoHide?: number
}

// Comprehensive Pagination State
export interface DataTablePaginationState {
  /** Current page (0-based) */
  currentPage: number
  /** Page size */
  pageSize: number
  /** Total records */
  totalRecords: number
  /** Total pages */
  totalPages: number
  /** Available page size options */
  pageSizeOptions: number[]
  /** Whether pagination is enabled */
  enabled: boolean
  /** Pagination position */
  position: 'top' | 'bottom' | 'both'
}

// Selection State
export interface DataTableSelectionState {
  /** Selected items */
  selected: any[]
  /** Selection mode */
  mode: 'single' | 'multiple' | 'checkbox' | 'radiobutton' | null
  /** Whether all items are selected */
  isAllSelected: boolean
  /** Whether some items are selected */
  isSomeSelected: boolean
}

// Filter State
export interface DataTableFilterState {
  /** Global filter value */
  globalFilter: string
  /** Column filters */
  columnFilters: Record<string, any>
  /** Active filters count */
  activeFiltersCount: number
  /** Filter debounce delay */
  debounceDelay: number
}

// Sort State
export interface DataTableSortState {
  /** Sort field */
  field: string | null
  /** Sort order */
  order: 'asc' | 'desc' | null
  /** Multi-sort metadata */
  multiSort: Array<{ field: string; order: 'asc' | 'desc' }>
  /** Whether multi-sort is enabled */
  multiSortEnabled: boolean
}

// Complete Data Table State
export interface DataTableCompleteState {
  /** Data state */
  data: any[]
  /** Loading state */
  loading: boolean
  /** Error state */
  error: DataTableErrorState | null
  /** Pagination state */
  pagination: DataTablePaginationState
  /** Selection state */
  selection: DataTableSelectionState
  /** Filter state */
  filter: DataTableFilterState
  /** Sort state */
  sort: DataTableSortState
  /** UI state */
  ui: {
    skeleton: boolean
    overlay: boolean
    refreshing: boolean
  }
}

// Legacy aliases for backward compatibility
export type MOPDataTableProps = FcxDataTableProps
export type MOPDataTableFilterEvent = FcxDataTableFilterEvent
