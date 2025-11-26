<template>
  <div class="enhanced-datatable-demo">
    <div class="demo-header">
      <h1>Enhanced Fcx DataTable Demo</h1>
      <p>All features consolidated into a single comprehensive component</p>
    </div>

    <!-- Controls -->
    <div class="demo-controls">
      <div class="control-group">
        <label>Size:</label>
        <select v-model="selectedSize">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div class="control-group">
        <label>Theme:</label>
        <select v-model="selectedTheme">
          <option value="default">Default</option>
          <option value="minimal">Minimal</option>
          <option value="bordered">Bordered</option>
          <option value="compact">Compact</option>
        </select>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="stripedRows" />
          Striped Rows
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showGridlines" />
          Show Gridlines
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="rounded" />
          Rounded
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="raised" />
          Raised
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="loading" />
          Loading
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="paginator" />
          Pagination
        </label>
      </div>
    </div>

    <!-- Enhanced DataTable -->
    <FcxDataTable
      :value="tableData"
      :columns="columns"
      :size="selectedSize"
      :theme="selectedTheme"
      :striped-rows="stripedRows"
      :show-gridlines="showGridlines"
      :rounded="rounded"
      :raised="raised"
      :loading="loading"
      :paginator="paginator"
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
      selection-mode="multiple"
      v-model:selection="selectedRows"
      data-key="id"
      :row-hover="true"
      :show-header="true"
      :show-global-filter="true"
      :show-export="true"
      :bulk-import="true"
      :clear-show="true"
      loading-message="Loading enhanced data..."
      empty-message="No data available"
      empty-icon="pi pi-database"
      empty-description="Try adding some data or adjusting your filters"
      global-filter-placeholder="Search all fields..."
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
      class="demo-table"
    >
      <!-- Custom status column -->
      <template #body-status="{ data }">
        <span :class="getStatusClass(data.status)">
          {{ data.status }}
        </span>
      </template>

      <!-- Custom actions column -->
      <template #body-actions="{ data, index }">
        <button @click="editRow(data)" class="action-btn edit">
          <i class="pi pi-pencil"></i>
        </button>
        <button @click="deleteRow(index)" class="action-btn delete">
          <i class="pi pi-trash"></i>
        </button>
      </template>
    </FcxDataTable>

    <!-- Selection Info -->
    <div v-if="selectedRows && selectedRows.length" class="selection-info">
      <p>Selected {{ selectedRows.length }} row(s):</p>
      <ul>
        <li v-for="row in selectedRows" :key="row.id">
          {{ row.name }} ({{ row.email }})
        </li>
      </ul>
    </div>

    <!-- Action Buttons -->
    <div class="demo-actions">
      <button @click="addRandomRow" class="demo-btn primary">Add Random Row</button>
      <button @click="clearData" class="demo-btn secondary">Clear Data</button>
      <button @click="resetData" class="demo-btn secondary">Reset Data</button>
      <button @click="toggleEmpty" class="demo-btn secondary">Toggle Empty State</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import FcxDataTable from '@/components/datacomponents/FcxDataTable.vue'

// Reactive state
const selectedSize = ref<'small' | 'medium' | 'large'>('medium')
const selectedTheme = ref<'default' | 'minimal' | 'bordered' | 'compact'>('default')
const stripedRows = ref(false)
const showGridlines = ref(false)
const rounded = ref(false)
const raised = ref(false)
const loading = ref(false)
const paginator = ref(true)
const selectedRows = ref<any[]>([])

// Column definitions
const columns = ref([
  { field: 'id', header: 'ID', sortable: true, width: '80px' },
  { field: 'name', header: 'Name', sortable: true, filterable: true },
  { field: 'email', header: 'Email', sortable: true, filterable: true },
  { field: 'role', header: 'Role', sortable: true, filterable: true },
  { field: 'department', header: 'Department', sortable: true, filterable: true },
  { field: 'status', header: 'Status', sortable: true, filterable: true },
  { field: 'actions', header: 'Actions', bodyClass: 'text-center', width: '120px' }
])

// Sample data
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', department: 'IT', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', department: 'HR', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', department: 'Finance', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', department: 'Marketing', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', department: 'IT', status: 'Pending' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Manager', department: 'Legal', status: 'Active' },
  { id: 7, name: 'Edward Norton', email: 'edward@example.com', role: 'User', department: 'Operations', status: 'Active' },
  { id: 8, name: 'Fiona Green', email: 'fiona@example.com', role: 'User', department: 'Sales', status: 'Inactive' },
  { id: 9, name: 'George Miller', email: 'george@example.com', role: 'Admin', department: 'IT', status: 'Active' },
  { id: 10, name: 'Helen Davis', email: 'helen@example.com', role: 'Manager', department: 'HR', status: 'Pending' }
]

const tableData = ref([...sampleData])

// Methods
const getStatusClass = (status: string) => {
  return {
    'status-active': status === 'Active',
    'status-inactive': status === 'Inactive',
    'status-pending': status === 'Pending'
  }
}

const editRow = (data: any) => {
  console.log('Edit row:', data)
  alert(`Editing ${data.name}`)
}

const deleteRow = (index: number) => {
  if (confirm('Are you sure you want to delete this row?')) {
    tableData.value.splice(index, 1)
  }
}

let nextId = 100
const addRandomRow = () => {
  const names = ['Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Avery']
  const roles = ['User', 'Admin', 'Manager', 'Analyst']
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Legal', 'Operations', 'Sales']
  const statuses = ['Active', 'Inactive', 'Pending']
  
  const randomName = names[Math.floor(Math.random() * names.length)]
  const randomRole = roles[Math.floor(Math.random() * roles.length)]
  const randomDepartment = departments[Math.floor(Math.random() * departments.length)]
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
  
  tableData.value.push({
    id: nextId++,
    name: `${randomName} ${Math.floor(Math.random() * 1000)}`,
    email: `${randomName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
    role: randomRole,
    department: randomDepartment,
    status: randomStatus
  })
}

const clearData = () => {
  tableData.value = []
  selectedRows.value = []
}

const resetData = () => {
  tableData.value = [...sampleData]
  selectedRows.value = []
}

const toggleEmpty = () => {
  if (tableData.value.length === 0) {
    resetData()
  } else {
    clearData()
  }
}
</script>

<style lang="scss" scoped>
.enhanced-datatable-demo {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--text-primary, #111827);
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1.125rem;
    color: var(--text-secondary, #6b7280);
  }
}

.demo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--surface, #f8fafc);
  border-radius: 8px;
  border: 1px solid var(--border-normal, #e5e7eb);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  label {
    font-weight: 500;
    color: var(--text-primary, #111827);
    white-space: nowrap;
  }
  
  select {
    padding: 0.5rem;
    border: 1px solid var(--border-normal, #e5e7eb);
    border-radius: 4px;
    background: var(--background, #ffffff);
    color: var(--text-primary, #111827);
    
    &:focus {
      outline: none;
      border-color: var(--primary-500, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
  
  input[type="checkbox"] {
    margin-right: 0.25rem;
  }
}

.demo-table {
  margin-bottom: 2rem;
}

.selection-info {
  background: var(--surface, #f8fafc);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-normal, #e5e7eb);
  margin-bottom: 2rem;
  
  p {
    font-weight: 500;
    color: var(--text-primary, #111827);
    margin-bottom: 0.5rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      padding: 0.25rem 0;
      color: var(--text-secondary, #6b7280);
    }
  }
}

.demo-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.demo-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: var(--primary-500, #3b82f6);
    color: white;
    
    &:hover {
      background: var(--primary-600, #2563eb);
    }
  }
  
  &.secondary {
    background: var(--surface, #f8fafc);
    color: var(--text-primary, #111827);
    border: 1px solid var(--border-normal, #e5e7eb);
    
    &:hover {
      background: var(--surface-hover, #f1f5f9);
    }
  }
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
  margin-right: 0.25rem;
  
  &.edit {
    background: var(--primary-500, #3b82f6);
    color: white;
    
    &:hover {
      background: var(--primary-600, #2563eb);
    }
  }
  
  &.delete {
    background: var(--error-500, #ef4444);
    color: white;
    
    &:hover {
      background: var(--error-600, #dc2626);
    }
  }
}

// Status styling
:deep(.status-active) {
  color: var(--success-600, #16a34a);
  font-weight: 500;
}

:deep(.status-inactive) {
  color: var(--error-600, #dc2626);
  font-weight: 500;
}

:deep(.status-pending) {
  color: var(--warning-600, #d97706);
  font-weight: 500;
}

// Responsive design
@media (max-width: 768px) {
  .enhanced-datatable-demo {
    padding: 1rem;
  }
  
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .demo-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-group {
    justify-content: space-between;
  }
}
</style>
