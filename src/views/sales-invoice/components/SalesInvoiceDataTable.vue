<template>
  <div class="sales-invoice-data-table">
    <FcxDataTable
      :value="filteredInvoices"
      :columns="tableColumns"
      :loading="isLoading"
      :loadingMessage="loadingMessage"
      :showSkeleton="true"
      :skeletonRows="5"
      :skeletonAnimation="'wave'"
      :totalRecords="totalRecords"
      :rows="pageSize"
      :first="currentPage * pageSize"
      :paginator="true"
      :alwaysShowPaginator="true"
      :rowsPerPageOptions="[5, 10, 20, 50, 100]"
      :paginatorPosition="'bottom'"
      :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
      :currentPageReportTemplate="'Showing {first} to {last} of {totalRecords} entries'"
      :showHeader="true"
      :showGlobalFilter="true"
      :globalFilterPlaceholder="'Search invoices...'"
      :showExport="true"
      :exportStatus="0"
      :bulkimport="false"
      :clearShow="true"
      :rowHover="true"
      :stripedRows="true"
      :showGridlines="true"
      :size="'medium'"
      :theme="'default'"
      :emptyMessage="'No invoices found'"
      :emptyIcon="'pi pi-file'"
      :emptyDescription="'Create your first sales invoice to get started'"
      :showAddButton="true"
      :addButtonLabel="'Create Invoice'"
      :addButtonIcon="'pi pi-plus'"
      :addButtonSeverity="'primary'"
      :showRefreshButton="true"
      :refreshButtonLabel="'Refresh'"
      :actionButtons="actionButtons"
      :errorState="errorStateConfig"
      :showActionsColumn="true"
      @row-click="handleRowClick"
      @add-click="handleAddInvoice"
      @refresh-click="handleRefresh"
      @button-click="handleActionButtonClick"
      @error-retry="handleErrorRetry"
      @pagination-change="handlePaginationChange"
      class="sales-invoice-data-table__table"
    >
      <!-- Invoice Number Column -->
      <template #body-invoiceNumber="{ data }">
        <div class="sales-invoice-data-table__invoice-number">
          <span class="sales-invoice-data-table__invoice-number-text">{{ data.invoiceNumber }}</span>
        </div>
      </template>

      <!-- Customer Name Column -->
      <template #body-customerName="{ data }">
        <div class="sales-invoice-data-table__customer">
          <span class="sales-invoice-data-table__customer-name">{{ data.customerName }}</span>
          <small v-if="data.customerGSTIN" class="sales-invoice-data-table__customer-gstin">
            {{ data.customerGSTIN }}
          </small>
        </div>
      </template>

      <!-- Invoice Date Column -->
      <template #body-invoiceDate="{ data }">
        <div class="sales-invoice-data-table__date">
          <span>{{ formatDate(data.invoiceDate) }}</span>
        </div>
      </template>

      <!-- Due Date Column -->
      <template #body-dueDate="{ data }">
        <div class="sales-invoice-data-table__due-date">
          <span :class="getDueDateClass(data)">{{ formatDate(data.dueDate) }}</span>
          <small class="sales-invoice-data-table__days-remaining">
            {{ getDaysRemaining(data.dueDate, data.status) }}
          </small>
        </div>
      </template>

      <!-- Total Amount Column -->
      <template #body-totalAmount="{ data }">
        <div class="sales-invoice-data-table__amount">
          <span class="sales-invoice-data-table__amount-value">{{ formatCurrency(data.totalAmount) }}</span>
        </div>
      </template>

      <!-- Status Column -->
      <template #body-status="{ data }">
        <div class="sales-invoice-data-table__status">
          <Tag 
            :value="formatStatus(data.status)" 
            :severity="getStatusSeverity(data.status)"
            :icon="getStatusIcon(data.status)"
          />
        </div>
      </template>

      <!-- Actions Column -->
      <template #body-actions="{ data }">
        <div class="sales-invoice-data-table__actions">
          <FcxButton
            icon="pi pi-ellipsis-v"
            severity="secondary"
            text
            size="small"
            @click="toggleActionMenu($event, data)"
            class="sales-invoice-data-table__actions-button"
          />
          
          <Menu
            ref="actionMenu"
            :model="getActionMenuItems(data)"
            :popup="true"
            class="sales-invoice-data-table__action-menu"
          />
        </div>
      </template>
    </FcxDataTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FcxDataTable } from '@/components/datacomponents'
import { FcxButton } from '@/components/buttoncomponents'
import Tag from 'primevue/tag'
import Menu from 'primevue/menu'
import type { InvoiceTableColumn, SalesInvoice, InvoiceStatus, PaymentTerms } from '../types/sales-invoice-types'
import type { DataTableActionButton, DataTableErrorState } from '@/components/datacomponents/types/datatable-types'
import { useSalesInvoices } from '../composables/useSalesInvoices'
import { 
  formatCurrency, 
  formatDate, 
  formatStatus,
  formatDaysRemaining,
  getStatusSeverity,
  getStatusIcon
} from '../utils/invoice-formatters'
import { isInvoiceOverdue } from '../utils/invoice-calculations'

// Router
const router = useRouter()

// Composables
const {
  invoices,
  isLoading,
  error,
  totalCount,
  fetchInvoices,
  deleteInvoice,
  sendInvoice,
  refreshInvoices
} = useSalesInvoices()

// Static sample data
const staticInvoices = ref<SalesInvoice[]>([
  {
    id: 1,
    invoiceNumber: 'INV-2025-0001',
    invoiceDate: '2025-11-01',
    dueDate: '2025-12-01',
    customerId: 1,
    customerName: 'Tech Solutions Pvt Ltd',
    customerEmail: 'finance@techsolutions.com',
    customerPhone: '9876543210',
    customerGSTIN: '27AABCT1234E1ZM',
    customerAddress: 'Mumbai, Maharashtra',
    status: 'paid' as InvoiceStatus,
    paymentTerms: 'net_30' as PaymentTerms,
    placeOfSupply: 'Maharashtra',
    lineItems: [
      {
        id: 1,
        productName: 'Software License',
        description: 'Annual subscription',
        hsnCode: '998314',
        quantity: 1,
        unitPrice: 50000,
        discount: 0,
        discountType: 'percentage',
        taxRate: 18,
        amount: 59000
      }
    ],
    subtotal: 50000,
    totalDiscount: 0,
    taxableAmount: 50000,
    cgst: 4500,
    sgst: 4500,
    igst: 0,
    totalTax: 9000,
    totalAmount: 59000,
    roundOff: 0,
    notes: 'Thank you for your business',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-15T14:30:00Z'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2025-0002',
    invoiceDate: '2025-11-15',
    dueDate: '2025-12-15',
    customerId: 2,
    customerName: 'Digital Innovation Corp',
    customerEmail: 'accounts@digitalinno.com',
    customerPhone: '9876543211',
    customerGSTIN: '19AABCD5678F2ZN',
    customerAddress: 'Kolkata, West Bengal',
    status: 'sent' as InvoiceStatus,
    paymentTerms: 'net_30' as PaymentTerms,
    placeOfSupply: 'West Bengal',
    lineItems: [
      {
        id: 1,
        productName: 'Web Development Service',
        description: 'Custom website development',
        hsnCode: '998313',
        quantity: 1,
        unitPrice: 125000,
        discount: 5,
        discountType: 'percentage',
        taxRate: 18,
        amount: 140125
      }
    ],
    subtotal: 125000,
    totalDiscount: 6250,
    taxableAmount: 118750,
    cgst: 10687.5,
    sgst: 10687.5,
    igst: 0,
    totalTax: 21375,
    totalAmount: 140125,
    roundOff: 0,
    notes: 'Payment due within 30 days',
    createdAt: '2025-11-15T09:30:00Z',
    updatedAt: '2025-11-15T09:30:00Z'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2025-0003',
    invoiceDate: '2025-11-20',
    dueDate: '2025-11-27',
    customerId: 3,
    customerName: 'Global Enterprises Ltd',
    customerEmail: 'billing@globalent.com',
    customerPhone: '9876543212',
    customerGSTIN: '06AABCG9012G3ZO',
    customerAddress: 'Chandigarh',
    status: 'overdue' as InvoiceStatus,
    paymentTerms: 'net_15' as PaymentTerms,
    placeOfSupply: 'Chandigarh',
    lineItems: [
      {
        id: 1,
        productName: 'Consulting Services',
        description: 'Business consulting',
        hsnCode: '998311',
        quantity: 10,
        unitPrice: 5000,
        discount: 2500,
        discountType: 'amount',
        taxRate: 18,
        amount: 56100
      }
    ],
    subtotal: 50000,
    totalDiscount: 2500,
    taxableAmount: 47500,
    cgst: 4275,
    sgst: 4275,
    igst: 0,
    totalTax: 8550,
    totalAmount: 56100,
    roundOff: 50,
    notes: 'Urgent payment required',
    createdAt: '2025-11-20T11:00:00Z',
    updatedAt: '2025-11-20T11:00:00Z'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2025-0004',
    invoiceDate: '2025-11-25',
    dueDate: '2025-11-25',
    customerId: 4,
    customerName: 'Startup Innovations Pvt Ltd',
    customerEmail: 'finance@startupinno.com',
    customerPhone: '9876543213',
    customerGSTIN: '29AABCS1234H1ZP',
    customerAddress: 'Bangalore, Karnataka',
    status: 'draft' as InvoiceStatus,
    paymentTerms: 'due_on_receipt' as PaymentTerms,
    placeOfSupply: 'Karnataka',
    lineItems: [
      {
        id: 1,
        productName: 'Cloud Hosting',
        description: 'Monthly cloud server hosting',
        hsnCode: '998316',
        quantity: 3,
        unitPrice: 15000,
        discount: 10,
        discountType: 'percentage',
        taxRate: 18,
        amount: 47790
      }
    ],
    subtotal: 45000,
    totalDiscount: 4500,
    taxableAmount: 40500,
    cgst: 3645,
    sgst: 3645,
    igst: 0,
    totalTax: 7290,
    totalAmount: 47790,
    roundOff: 0,
    notes: 'Draft invoice - pending review',
    createdAt: '2025-11-25T15:45:00Z',
    updatedAt: '2025-11-25T15:45:00Z'
  }
])

// State
const currentPage = ref(0)
const pageSize = ref(10)
const globalFilter = ref('')
const actionMenu = ref()
const selectedInvoice = ref<SalesInvoice | null>(null)
const loadingMessage = ref('Loading invoices...')

// Table columns
const tableColumns = ref<InvoiceTableColumn[]>([
  { field: 'invoiceNumber', header: 'Invoice #', sortable: true, width: '12%' },
  { field: 'customerName', header: 'Customer', sortable: true, width: '20%' },
  { field: 'invoiceDate', header: 'Invoice Date', sortable: true, width: '12%' },
  { field: 'dueDate', header: 'Due Date', sortable: true, width: '12%' },
  { field: 'totalAmount', header: 'Amount', sortable: true, width: '12%' },
  { field: 'status', header: 'Status', sortable: true, width: '12%' },
  { field: 'actions', header: 'Actions', width: '10%' }
])

// Action buttons
const actionButtons = ref<DataTableActionButton[]>([
  {
    label: 'Draft',
    icon: 'pi pi-file-edit',
    severity: 'secondary',
    size: 'small',
    position: 'left',
    action: 'filter-draft'
  },
  {
    label: 'Sent',
    icon: 'pi pi-send',
    severity: 'info',
    size: 'small',
    position: 'left',
    action: 'filter-sent'
  },
  {
    label: 'Paid',
    icon: 'pi pi-check-circle',
    severity: 'success',
    size: 'small',
    position: 'left',
    action: 'filter-paid'
  },
  {
    label: 'Overdue',
    icon: 'pi pi-exclamation-triangle',
    severity: 'warning',
    size: 'small',
    position: 'left',
    action: 'filter-overdue'
  }
])

// Error state
const errorStateConfig = computed<DataTableErrorState | undefined>(() => {
  if (!error.value) return undefined
  
  return {
    show: true,
    errorType: 'custom',
    title: 'Failed to Load Invoices',
    message: error.value,
    showRetry: true,
    showSupport: false
  }
})

// Filtered invoices (for search)
const filteredInvoices = computed(() => {
  // Use static data instead of store data for now
  const data = staticInvoices.value
  
  if (!globalFilter.value) return data
  
  const query = globalFilter.value.toLowerCase()
  return data.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(query) ||
    invoice.customerName.toLowerCase().includes(query) ||
    invoice.customerGSTIN?.toLowerCase().includes(query) ||
    invoice.status.toLowerCase().includes(query)
  )
})

const totalRecords = computed(() => filteredInvoices.value.length)

// Methods
const handleAddInvoice = () => {
  router.push({ name: 'sales-invoice-create' })
}

const handleRefresh = async () => {
  loadingMessage.value = 'Refreshing invoices...'
  await refreshInvoices()
}

const handleRowClick = (event: any) => {
  const invoice = event.data as SalesInvoice
  router.push({ name: 'sales-invoice-edit', params: { id: invoice.id } })
}

const handlePaginationChange = (event: any) => {
  currentPage.value = event.page
  pageSize.value = event.rows
}

const handleActionButtonClick = async (event: any) => {
  const action = event.action
  
  // Filter static data based on status
  switch (action) {
    case 'filter-draft':
      // Filter local static data
      console.log('Filter by draft')
      break
    case 'filter-sent':
      console.log('Filter by sent')
      break
    case 'filter-paid':
      console.log('Filter by paid')
      break
    case 'filter-overdue':
      console.log('Filter by overdue')
      break
  }
}

const handleErrorRetry = async () => {
  // Placeholder for API retry
  console.log('Retry loading invoices')
}

const toggleActionMenu = (event: Event, invoice: SalesInvoice) => {
  selectedInvoice.value = invoice
  actionMenu.value?.toggle(event)
}

const getActionMenuItems = (invoice: SalesInvoice) => {
  const items = [
    {
      label: 'View Details',
      icon: 'pi pi-eye',
      command: () => {
        router.push({ name: 'sales-invoice-edit', params: { id: invoice.id } })
      }
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        router.push({ name: 'sales-invoice-edit', params: { id: invoice.id } })
      },
      disabled: invoice.status === 'paid' || invoice.status === 'cancelled'
    },
    {
      separator: true
    }
  ]
  
  if (invoice.status === 'draft') {
    items.push({
      label: 'Send Invoice',
      icon: 'pi pi-send',
      command: async () => {
        try {
          await sendInvoice(invoice.id, invoice.customerEmail)
          console.log('Invoice sent successfully')
        } catch (err) {
          console.error('Failed to send invoice:', err)
        }
      }
    })
  }
  
  items.push(
    {
      label: 'Download PDF',
      icon: 'pi pi-download',
      command: () => {
        console.log('Download PDF for invoice:', invoice.id)
      }
    },
    {
      separator: true
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: async () => {
        if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
          try {
            // Remove from static data
            const index = staticInvoices.value.findIndex(inv => inv.id === invoice.id)
            if (index > -1) {
              staticInvoices.value.splice(index, 1)
            }
            console.log('Invoice deleted successfully')
          } catch (err) {
            console.error('Failed to delete invoice:', err)
          }
        }
      },
      disabled: invoice.status === 'paid'
    }
  )
  
  return items
}

const getDueDateClass = (invoice: SalesInvoice) => {
  if (isInvoiceOverdue(invoice.dueDate, invoice.status)) {
    return 'sales-invoice-data-table__due-date--overdue'
  }
  return ''
}

const getDaysRemaining = (dueDate: string, status: string) => {
  return formatDaysRemaining(dueDate)
}

// Lifecycle - No API call for static data
// onMounted(async () => {
//   await fetchInvoices()
// })
</script>

<style scoped lang="scss">
.sales-invoice-data-table {
  width: 100%;
  height: 100%;

  &__invoice-number {
    font-weight: 600;
    color: var(--primary-color);
  }

  &__customer {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &-name {
      font-weight: 500;
    }

    &-gstin {
      color: var(--text-color-secondary);
      font-size: 0.875rem;
    }
  }

  &__date {
    font-size: 0.9375rem;
  }

  &__due-date {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &--overdue {
      color: var(--red-500);
      font-weight: 600;
    }

    &__days-remaining {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
    }
  }

  &__amount {
    font-weight: 600;
    font-size: 1rem;

    &-value {
      color: var(--text-color);
    }
  }

  &__status {
    display: flex;
    align-items: center;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
