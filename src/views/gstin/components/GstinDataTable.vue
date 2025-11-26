<template>
  <!-- GSTIN Creation Dialog - At top level for proper z-index -->
  <GstinCreation
    v-model:visible="showGstinCreationDialog"
    @gstin-added="handleGstinAdded"
    @close="handleGstinCreationClose"
  />
  
  <div class="gstin-data-table">
    <!-- Data Table -->
    <FcxDataTable
      :value="filteredAccounts"
      :columns="tableColumns"
      :loading="isLoading"
      :loadingMessage="loadingMessage"
      :showSkeleton="true"
      :skeletonRows="3"
      :skeletonAnimation="'wave'"
      :totalRecords="filteredAccounts.length"
      :rows="pageSize"
      :first="currentPage * pageSize"
      :paginator="true"
      :alwaysShowPaginator="true"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :paginatorPosition="'bottom'"
      :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
      :currentPageReportTemplate="'Showing {first} to {last} of {totalRecords} entries'"
      :showHeader="true"
      :showGlobalFilter="true"
      :globalFilterPlaceholder="'Search GSTINs...'"
      :showExport="true"
      :exportStatus="0"
      :bulkimport="false"
      :clearShow="true"
      :rowHover="true"
      :stripedRows="true"
      :showGridlines="true"
      :size="'medium'"
      :theme="'default'"
      :emptyMessage="'No GSTIN accounts found'"
      :emptyIcon="'pi pi-building'"
      :emptyDescription="'Add your first GSTIN to get started'"
      :showAddButton="true"
      :addButtonLabel="'Add GSTIN'"
      :addButtonIcon="'pi pi-plus'"
      :addButtonSeverity="'success'"
      :showRefreshButton="true"
      :refreshButtonLabel="'Refresh'"
      :actionButtons="statsActionButtons"
      :errorState="errorStateConfig"
      :showActionsColumn="true"
     
      @row-click="handleRowClick"
      @add-click="handleAddGstin"
      @refresh-click="handleRefresh"
      @button-click="handleStatsButtonClick"
      @error-retry="handleErrorRetry"
      @error-support="handleErrorSupport"
      @state-change="handleStateChange"
      @pagination-change="handlePaginationChange"
      class="gstin-data-table__table"
    >
      <!-- Company Name Column -->
      <template #body-companyName="{ data }">
        <div class="gstin-data-table__company-name">
          <span class="gstin-data-table__company-name-text">{{ data.companyName }}</span>
          <small class="gstin-data-table__username">{{ data.username }}</small>
        </div>
      </template>

      <!-- GSTIN Column -->
      <template #body-gstin="{ data }">
        <div class="gstin-data-table__gstin">
          <span class="gstin-data-table__gstin-text">{{ data.gstin.toUpperCase() }}</span>
        </div>
      </template>

      <!-- State Code Column -->
      <template #body-stateCode="{ data }">
        <div class="gstin-data-table__state-code">
          <span class="gstin-data-table__state-code-badge">{{ data.stateCode }}</span>
        </div>
      </template>

      <!-- Last Reconciled Column -->
      <template #body-lastReconciled="{ data }">
        <div class="gstin-data-table__reconciliation">
          <span 
            :class="getReconciliationStatusClass(data)"
            class="gstin-data-table__reconciliation-status"
          >
            {{ formatDate(data.lastReconciled) }}
          </span>
          <div class="gstin-data-table__reconciliation-details" v-if="data.lastReconciled">
            <small class="gstin-data-table__reconciliation-time">
              {{ getRelativeTime(data.lastReconciled) }}
            </small>
          </div>
        </div>
      </template>

      <!-- Actions Column -->
      <template #body-actions="{ data }">
        <div class="gstin-data-table__actions">
          <FcxButton
            icon="pi pi-ellipsis-v"
            severity="secondary"
            text
            size="small"
            @click="toggleActionMenu($event, data)"
            class="gstin-data-table__actions-button"
          />
          
          <!-- Action Menu -->
          <Menu
            ref="actionMenu"
            :model="getActionMenuItems(data)"
            :popup="true"
            class="gstin-data-table__action-menu"
          />
        </div>
      </template>
    </FcxDataTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FcxDataTable } from '@/components/datacomponents'
import Menu from 'primevue/menu'
import GstinCreation from '../views/GstinCreation.vue'
import type { 
  GstinAccount, 
  GstinAccountTableColumn 
} from '../types/gstin-accounts-types'
import type { 
  DataTableActionButton, 
  DataTableErrorState, 
  DataTableSuccessState 
} from '@/components/datacomponents/types/datatable-types'

// Props interface kept for future extensibility but currently unused

// Static data - 3 unique accounts
const staticAccounts = ref<GstinAccount[]>([
  {
    id: 1,
    companyName: 'Tech Solutions Pvt Ltd',
    username: 'admin@techsolutions.com',
    gstin: '27AABCS1234E1ZM',
    stateCode: '27',
    txn: 'TXN001',
    userId: 1,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-15T10:00:00Z',
    lastUserInvoiceUpload: '2024-01-15T09:30:00Z',
    lastReconciled: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    isActive: true
  },
  {
    id: 2,
    companyName: 'Digital Innovation Corp',
    username: 'finance@digitalinno.com',
    gstin: '19AABCS5678F2ZN',
    stateCode: '19',
    txn: 'TXN002',
    userId: 2,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-10T14:00:00Z',
    lastUserInvoiceUpload: '2024-01-10T13:30:00Z',
    lastReconciled: '2024-01-10T14:20:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    isActive: false
  },
  {
    id: 3,
    companyName: 'Global Enterprises Ltd',
    username: 'accounts@globalent.com',
    gstin: '06AABCS9012G3ZO',
    stateCode: '06',
    txn: 'TXN003',
    userId: 3,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: null,
    lastUserInvoiceUpload: null,
    lastReconciled: null,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    isActive: true
  },
  {
    id: 1,
    companyName: 'Tech Solutions Pvt Ltd',
    username: 'admin@techsolutions.com',
    gstin: '27AABCS1234E1ZM',
    stateCode: '27',
    txn: 'TXN001',
    userId: 1,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-15T10:00:00Z',
    lastUserInvoiceUpload: '2024-01-15T09:30:00Z',
    lastReconciled: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    companyName: 'Digital Innovation Corp',
    username: 'finance@digitalinno.com',
    gstin: '19AABCS5678F2ZN',
    stateCode: '19',
    txn: 'TXN002',
    userId: 2,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-10T14:00:00Z',
    lastUserInvoiceUpload: '2024-01-10T13:30:00Z',
    lastReconciled: '2024-01-10T14:20:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 3,
    companyName: 'Global Enterprises Ltd',
    username: 'accounts@globalent.com',
    gstin: '06AABCS9012G3ZO',
    stateCode: '06',
    txn: 'TXN003',
    userId: 3,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: null,
    lastUserInvoiceUpload: null,
    lastReconciled: null,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 1,
    companyName: 'Tech Solutions Pvt Ltd',
    username: 'admin@techsolutions.com',
    gstin: '27AABCS1234E1ZM',
    stateCode: '27',
    txn: 'TXN001',
    userId: 1,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-15T10:00:00Z',
    lastUserInvoiceUpload: '2024-01-15T09:30:00Z',
    lastReconciled: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    companyName: 'Digital Innovation Corp',
    username: 'finance@digitalinno.com',
    gstin: '19AABCS5678F2ZN',
    stateCode: '19',
    txn: 'TXN002',
    userId: 2,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-10T14:00:00Z',
    lastUserInvoiceUpload: '2024-01-10T13:30:00Z',
    lastReconciled: '2024-01-10T14:20:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 3,
    companyName: 'Global Enterprises Ltd',
    username: 'accounts@globalent.com',
    gstin: '06AABCS9012G3ZO',
    stateCode: '06',
    txn: 'TXN003',
    userId: 3,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: null,
    lastUserInvoiceUpload: null,
    lastReconciled: null,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 1,
    companyName: 'Tech Solutions Pvt Ltd',
    username: 'admin@techsolutions.com',
    gstin: '27AABCS1234E1ZM',
    stateCode: '27',
    txn: 'TXN001',
    userId: 1,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-15T10:00:00Z',
    lastUserInvoiceUpload: '2024-01-15T09:30:00Z',
    lastReconciled: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    companyName: 'Digital Innovation Corp',
    username: 'finance@digitalinno.com',
    gstin: '19AABCS5678F2ZN',
    stateCode: '19',
    txn: 'TXN002',
    userId: 2,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-10T14:00:00Z',
    lastUserInvoiceUpload: '2024-01-10T13:30:00Z',
    lastReconciled: '2024-01-10T14:20:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 3,
    companyName: 'Global Enterprises Ltd',
    username: 'accounts@globalent.com',
    gstin: '06AABCS9012G3ZO',
    stateCode: '06',
    txn: 'TXN003',
    userId: 3,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: null,
    lastUserInvoiceUpload: null,
    lastReconciled: null,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 1,
    companyName: 'Tech Solutions Pvt Ltd',
    username: 'admin@techsolutions.com',
    gstin: '27AABCS1234E1ZM',
    stateCode: '27',
    txn: 'TXN001',
    userId: 1,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-15T10:00:00Z',
    lastUserInvoiceUpload: '2024-01-15T09:30:00Z',
    lastReconciled: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    companyName: 'Digital Innovation Corp',
    username: 'finance@digitalinno.com',
    gstin: '19AABCS5678F2ZN',
    stateCode: '19',
    txn: 'TXN002',
    userId: 2,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-10T14:00:00Z',
    lastUserInvoiceUpload: '2024-01-10T13:30:00Z',
    lastReconciled: '2024-01-10T14:20:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 3,
    companyName: 'Global Enterprises Ltd',
    username: 'accounts@globalent.com',
    gstin: '06AABCS9012G3ZO',
    stateCode: '06',
    txn: 'TXN003',
    userId: 3,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: null,
    lastUserInvoiceUpload: null,
    lastReconciled: null,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 1,
    companyName: 'Tech Solutions Pvt Ltd',
    username: 'admin@techsolutions.com',
    gstin: '27AABCS1234E1ZM',
    stateCode: '27',
    txn: 'TXN001',
    userId: 1,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-15T10:00:00Z',
    lastUserInvoiceUpload: '2024-01-15T09:30:00Z',
    lastReconciled: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    companyName: 'Digital Innovation Corp',
    username: 'finance@digitalinno.com',
    gstin: '19AABCS5678F2ZN',
    stateCode: '19',
    txn: 'TXN002',
    userId: 2,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: '2024-01-10T14:00:00Z',
    lastUserInvoiceUpload: '2024-01-10T13:30:00Z',
    lastReconciled: '2024-01-10T14:20:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 3,
    companyName: 'Global Enterprises Ltd',
    username: 'accounts@globalent.com',
    gstin: '06AABCS9012G3ZO',
    stateCode: '06',
    txn: 'TXN003',
    userId: 3,
    expiryTime: '2024-12-31T23:59:59Z',
    lastImsInvoiceSync: null,
    lastUserInvoiceUpload: null,
    lastReconciled: null,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
])

// State management
const isLoading = ref(false)
const error = ref<string | null>(null)
const loadingMessage = ref('Loading GSTIN accounts...')
const currentPage = ref(0)
const pageSize = ref(10)
const globalFilter = ref('')

// Action menu ref
const actionMenu = ref()

// Simplified table state
const tableState = ref({
  pagination: {
    currentPage: 0,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0
  }
})

// Computed properties
const filteredAccounts = computed(() => {
  if (!globalFilter.value) return staticAccounts.value
  
  const searchTerm = globalFilter.value.toLowerCase()
  return staticAccounts.value.filter(account =>
    account.companyName.toLowerCase().includes(searchTerm) ||
    account.gstin.toLowerCase().includes(searchTerm) ||
    account.username.toLowerCase().includes(searchTerm) ||
    account.stateCode.toLowerCase().includes(searchTerm)
  )
})

// Computed properties for state
const accountsCount = computed(() => staticAccounts.value.length)

const getUnreconciledCount = computed(() => {
  return staticAccounts.value.filter(account => !account.lastReconciled).length
})

const getReconciledCount = computed(() => {
  return staticAccounts.value.filter(account => account.lastReconciled).length
})

// Stats action buttons configuration
const statsActionButtons = computed<DataTableActionButton[]>(() => [
  {
    label: `Total: ${accountsCount.value}`,
    icon: 'pi pi-list',
    severity: 'secondary',
    size: 'small',
    position: 'left',
    action: 'show-total',
    disabled: false
  },
  {
    label: `Reconciled: ${getReconciledCount.value}`,
    icon: 'pi pi-check',
    severity: 'success',
    size: 'small', 
    position: 'left',
    action: 'filter-reconciled',
    disabled: false
  },
  {
    label: `Pending: ${getUnreconciledCount.value}`,
    icon: 'pi pi-clock',
    severity: 'warning',
    size: 'small',
    position: 'left',
    action: 'filter-pending',
    disabled: false
  }
])

// Error state configuration
const errorStateConfig = computed<DataTableErrorState>(() => ({
  show: error.value !== null && staticAccounts.value.length === 0,
  title: 'Failed to load GSTIN accounts',
  message: error.value || 'An unexpected error occurred while loading GSTIN data.',
  icon: 'pi pi-exclamation-triangle',
  showRetry: true,
  retryLabel: 'Retry Loading',
  showSupport: true,
  supportLabel: 'Contact Support'
}))



// Enhanced Actions with state management
const refreshAccounts = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
  } catch (err) {
    error.value = 'Failed to refresh GSTIN accounts. Please try again.'
  } finally {
    isLoading.value = false
  }
}


const updateTableState = () => {
  tableState.value.pagination = {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    totalRecords: filteredAccounts.value.length,
    totalPages: Math.ceil(filteredAccounts.value.length / pageSize.value)
  }
}


const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

// Table configuration
const tableColumns = ref<GstinAccountTableColumn[]>([
  {
    field: 'companyName',
    header: 'Name',
    sortable: true,
    filterable: true,
    width: '30%'
  },
  {
    field: 'gstin',
    header: 'GSTIN',
    sortable: true,
    filterable: true,
    width: '25%'
  },
  {
    field: 'stateCode',
    header: 'State Code',
    sortable: true,
    filterable: true,
    width: '15%'
  },
  {
    field: 'lastReconciled',
    header: 'Last Reconciled',
    sortable: true,
    width: '30%'
  }
])


// Watcher for state synchronization
watch(filteredAccounts, () => {
  updateTableState()
}, { immediate: true })





const handleRowClick = (event: any) => {
  const account = event.data as GstinAccount
  // Navigate to account details or show details modal
}

// New FcxDataTable event handlers
const showGstinCreationDialog = ref(false)

const handleAddGstin = () => {
  showGstinCreationDialog.value = true
}

const handleGstinAdded = (newGstin: any) => {
  // Add the new GSTIN to the static accounts array
  staticAccounts.value.push(newGstin)
  showGstinCreationDialog.value = false
  
  // Optional: Show success message or update UI
  console.log('New GSTIN added:', newGstin)
}

const handleGstinCreationClose = () => {
  showGstinCreationDialog.value = false
}

const handleRefresh = async () => {
  await refreshAccounts()
}

const handleStatsButtonClick = (event: { action: string, button: DataTableActionButton }) => {
  switch (event.action) {
    case 'show-total':
      // Show total accounts
      break
    case 'filter-reconciled':
      // Implement filter for reconciled accounts
      break
    case 'filter-pending':
      // Implement filter for pending accounts
      break
  }
}

const handleErrorRetry = () => {
  refreshAccounts()
}

const handleErrorSupport = () => {
  // Support contact dialog would open here
}

const handleSuccessClose = () => {
  // Success message closed
}

const handleStateChange = (state: any) => {
  // Update local state based on table state changes
  tableState.value = { ...tableState.value, ...state }
}

const handlePaginationChange = (pagination: any) => {
  currentPage.value = pagination.currentPage
  pageSize.value = pagination.pageSize
  updateTableState()
}

// Utility functions
const getReconciliationStatusClass = (account: GstinAccount) => {
  if (!account.lastReconciled) {
    return { 'gstin-data-table__reconciliation-status--pending': true }
  }
  
  const lastReconciled = new Date(account.lastReconciled)
  const now = new Date()
  const diffInDays = (now.getTime() - lastReconciled.getTime()) / (1000 * 60 * 60 * 24)
  
  if (diffInDays <= 30) {
    return { 'gstin-data-table__reconciliation-status--available': true }
  }
  return { 'gstin-data-table__reconciliation-status--unavailable': true }
}

const getRelativeTime = (dateString: string | null): string => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      return 'Today'
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    } else {
      const months = Math.floor(diffInDays / 30)
      return `${months} month${months > 1 ? 's' : ''} ago`
    }
  } catch (error) {
    return ''
  }
}

// Action menu functions
const toggleActionMenu = (event: Event, data: GstinAccount) => {
  actionMenu.value.toggle(event)
}

const getActionMenuItems = (data: GstinAccount) => [
  {
    label: data.isActive !== false ? 'Mark as Inactive' : 'Mark as Active',
    icon: data.isActive !== false ? 'pi pi-ban' : 'pi pi-check-circle',
    command: () => handleToggleStatus(data),
    class: 'status-action'
  },
  {
    separator: true
  },
  {
    label: 'Remove GSTIN',
    icon: 'pi pi-trash',
    command: () => handleRemoveGstin(data),
    class: 'danger-action'
  }
]

const handleRemoveGstin = (account: GstinAccount) => {
  // Confirm before removing
  if (confirm(`Are you sure you want to remove GSTIN ${account.gstin}?`)) {
    // Find and remove the account from static data
    const index = staticAccounts.value.findIndex(acc => acc.id === account.id && acc.gstin === account.gstin)
    if (index > -1) {
      staticAccounts.value.splice(index, 1)
      console.log('GSTIN removed:', account.gstin)
    }
  }
}

const handleToggleStatus = (account: GstinAccount) => {
  // Find the account in static data and toggle status
  const accountIndex = staticAccounts.value.findIndex(acc => acc.id === account.id && acc.gstin === account.gstin)
  if (accountIndex > -1) {
    // Set default active status if not set
    if (staticAccounts.value[accountIndex].isActive === undefined) {
      staticAccounts.value[accountIndex].isActive = true
    }
    
    // Toggle status
    staticAccounts.value[accountIndex].isActive = !staticAccounts.value[accountIndex].isActive
    
    const newStatus = staticAccounts.value[accountIndex].isActive ? 'Active' : 'Inactive'
    console.log(`GSTIN ${account.gstin} status changed to: ${newStatus}`)
  }
}

// Expose methods for parent components
defineExpose({
  refreshAccounts,
  accounts: staticAccounts,
  isLoading,
  error
})
</script>

<style lang="scss" scoped>
.gstin-data-table {
  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__actions-button {
    .p-button {
      padding: 0.5rem;
      min-width: auto;
      border-radius: 6px;
      color: var(--text-color-secondary);
      transition: all 0.2s ease;
      
      &:hover {
        background-color: var(--surface-100);
        color: var(--text-color);
        transform: scale(1.05);
      }
      
      &:focus {
        box-shadow: 0 0 0 2px var(--focus-ring);
      }
    }
  }
}

// Global styles for all PrimeVue menus used in this component
:global(.p-menu) {
  min-width: 200px !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid #e5e7eb !important;
  
  .p-menu-list {
    padding: 8px 0 !important;
    
    .p-menu-item {
      margin: 0 4px !important;
      
      .p-menu-item-link {
        padding: 12px 16px !important;
        border-radius: 6px !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        
        .p-menu-item-icon {
          margin-right: 12px !important;
          font-size: 16px !important;
          width: 16px !important;
        }
        
        .p-menu-item-text {
          font-weight: 500 !important;
          font-size: 14px !important;
        }
        
        &:hover {
          background-color: #f3f4f6 !important;
          transform: translateX(2px) !important;
        }
      }
      
      // Danger action styling
      &.danger-action .p-menu-item-link {
        color: #dc2626 !important;
        
        &:hover {
          background-color: #fef2f2 !important;
          color: #b91c1c !important;
        }
        
        .p-menu-item-icon {
          color: #ef4444 !important;
        }
      }
      
      // Status action styling
      &.status-action .p-menu-item-link {
        color: #2563eb !important;
        
        &:hover {
          background-color: #eff6ff !important;
          color: #1d4ed8 !important;
        }
        
        .p-menu-item-icon {
          color: #3b82f6 !important;
        }
      }
    }
    
    // Separator styling
    .p-menu-separator {
      margin: 8px 0 !important;
      border-top: 1px solid #e5e7eb !important;
    }
  }
}

// Actions placeholder styles in FcxDataTable
:global(fcx-datatable__actions-placeholder) {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  font-size: 1.2rem;
}
</style>

