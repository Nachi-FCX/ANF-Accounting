# FcxDataTable Component

A comprehensive, reusable DataTable component built on top of PrimeVue's DataTable with enhanced features and consistent theming.

## Features

- **Full PrimeVue DataTable Integration**: All PrimeVue DataTable props and events are supported
- **Custom Theming**: Multiple theme variants (default, minimal, bordered, compact)
- **Size Variants**: Small, medium, and large sizing options
- **Enhanced Styling**: Striped rows, gridlines, hover effects, rounded corners, and raised shadows
- **Loading States**: Custom loading overlay with spinner and message
- **Empty States**: Customizable empty state with icon and message
- **TypeScript Support**: Comprehensive type definitions for all props and events
- **Responsive Design**: Mobile-friendly with responsive breakpoints
- **Accessibility**: ARIA labels and keyboard navigation support
- **Theme Integration**: Seamless integration with your existing SCSS theme system

## Basic Usage

```vue
<template>
  <FcxDataTable :value="data">
    <Column field="id" header="ID" sortable />
    <Column field="name" header="Name" sortable />
    <Column field="email" header="Email" sortable />
  </FcxDataTable>
</template>

<script setup>
import { FcxDataTable } from '@/components/datacomponents'
import Column from 'primevue/column'

const data = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
])
</script>
```

## Props

### Custom Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Table size variant |
| `theme` | `'default' \| 'minimal' \| 'bordered' \| 'compact'` | `'default'` | Table theme variant |
| `stripedRows` | `boolean` | `false` | Enable striped row styling |
| `showGridlines` | `boolean` | `false` | Show table gridlines |
| `hoverable` | `boolean` | `true` | Enable row hover effects |
| `rounded` | `boolean` | `false` | Apply rounded corners |
| `raised` | `boolean` | `false` | Apply raised shadow |
| `loadingMessage` | `string` | `'Loading...'` | Custom loading message |
| `emptyMessage` | `string` | `'No data available'` | Custom empty state message |
| `emptyIcon` | `Component \| string` | - | Custom empty state icon |
| `showLoadingOverlay` | `boolean` | `true` | Show loading overlay |
| `loadingOverlayOpacity` | `number` | `0.8` | Loading overlay opacity |
| `ariaLabel` | `string` | - | ARIA label for accessibility |
| `ariaDescription` | `string` | - | ARIA description for accessibility |

### PrimeVue DataTable Props

All PrimeVue DataTable props are supported. See [PrimeVue DataTable documentation](https://primevue.org/datatable/) for complete list.

## Size Variants

```vue
<!-- Small table -->
<FcxDataTable :value="data" size="small">
  <!-- columns -->
</FcxDataTable>

<!-- Medium table (default) -->
<FcxDataTable :value="data" size="medium">
  <!-- columns -->
</FcxDataTable>

<!-- Large table -->
<FcxDataTable :value="data" size="large">
  <!-- columns -->
</FcxDataTable>
```

## Theme Variants

```vue
<!-- Default theme -->
<FcxDataTable :value="data" theme="default">
  <!-- columns -->
</FcxDataTable>

<!-- Minimal theme (no borders, clean look) -->
<FcxDataTable :value="data" theme="minimal">
  <!-- columns -->
</FcxDataTable>

<!-- Bordered theme (all cells bordered) -->
<FcxDataTable :value="data" theme="bordered">
  <!-- columns -->
</FcxDataTable>

<!-- Compact theme (reduced padding) -->
<FcxDataTable :value="data" theme="compact">
  <!-- columns -->
</FcxDataTable>
```

## Style Options

```vue
<!-- Striped rows -->
<FcxDataTable :value="data" :striped-rows="true">
  <!-- columns -->
</FcxDataTable>

<!-- Show gridlines -->
<FcxDataTable :value="data" :show-gridlines="true">
  <!-- columns -->
</FcxDataTable>

<!-- Rounded corners and raised shadow -->
<FcxDataTable :value="data" :rounded="true" :raised="true">
  <!-- columns -->
</FcxDataTable>
```

## Selection

```vue
<!-- Single selection -->
<FcxDataTable 
  :value="data" 
  v-model:selection="selectedRow"
  selection-mode="single"
  data-key="id"
>
  <!-- columns -->
</FcxDataTable>

<!-- Multiple selection -->
<FcxDataTable 
  :value="data" 
  v-model:selection="selectedRows"
  selection-mode="multiple"
  data-key="id"
>
  <Column selection-mode="multiple" header-style="width: 3rem" />
  <!-- other columns -->
</FcxDataTable>
```

## Pagination

```vue
<FcxDataTable 
  :value="data" 
  :paginator="true"
  :rows="10"
  :rows-per-page-options="[5, 10, 20, 50]"
  paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
>
  <!-- columns -->
</FcxDataTable>
```

## Filtering

```vue
<template>
  <div>
    <input 
      v-model="globalFilter" 
      type="text" 
      placeholder="Search..."
    />
    <FcxDataTable 
      :value="data" 
      :global-filter-fields="['name', 'email', 'role']"
      :filters="{ global: { value: globalFilter, matchMode: 'contains' } }"
    >
      <!-- columns -->
    </FcxDataTable>
  </div>
</template>

<script setup>
const globalFilter = ref('')
</script>
```

## Loading State

```vue
<FcxDataTable 
  :value="data" 
  :loading="isLoading"
  loading-message="Loading data..."
>
  <!-- columns -->
</FcxDataTable>
```

## Empty State

```vue
<FcxDataTable 
  :value="[]" 
  empty-message="No records found"
  empty-icon="fas fa-inbox"
>
  <!-- columns -->
</FcxDataTable>
```

## Events

All PrimeVue DataTable events are supported:

```vue
<FcxDataTable 
  :value="data"
  @row-select="onRowSelect"
  @row-unselect="onRowUnselect"
  @selection-change="onSelectionChange"
  @row-click="onRowClick"
  @page="onPage"
  @sort="onSort"
  @filter="onFilter"
>
  <!-- columns -->
</FcxDataTable>
```

## Exposed Methods

```vue
<template>
  <FcxDataTable ref="dataTableRef" :value="data">
    <!-- columns -->
  </FcxDataTable>
</template>

<script setup>
const dataTableRef = ref()

// Export to CSV
const exportData = () => {
  dataTableRef.value.exportCSV()
}

// Clear selection
const clearSelection = () => {
  dataTableRef.value.clearSelection()
}

// Reset table state
const resetTable = () => {
  dataTableRef.value.reset()
}
</script>
```

## Slots

All PrimeVue DataTable slots are supported and forwarded:

```vue
<FcxDataTable :value="data">
  <Column field="name" header="Name" />
  <Column field="status" header="Status">
    <template #body="{ data }">
      <span :class="getStatusClass(data.status)">
        {{ data.status }}
      </span>
    </template>
  </Column>
  
  <!-- Custom empty state -->
  <template #empty>
    <div class="custom-empty-state">
      <i class="fas fa-search"></i>
      <p>No matching records found</p>
    </div>
  </template>
</FcxDataTable>
```

## Styling

The component uses CSS custom properties for theming and automatically adapts to light/dark themes:

```scss
// Custom styling
.my-datatable {
  --fcx-datatable-header-background: #f8f9fa;
  --fcx-datatable-row-hover-background: #e3f2fd;
}
```

## TypeScript Support

Import types for better TypeScript support:

```typescript
import type { 
  DataTableProps, 
  DataTableEvents,
  DataTableExpose 
} from '@/components/datacomponents'
```

## Demo

Visit `/datatable-demo` in your application to see all features in action.
