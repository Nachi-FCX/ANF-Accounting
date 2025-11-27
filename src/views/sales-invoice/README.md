# Sales Invoice Module

Complete sales invoice management module for ANF-Accounting application.

## 📁 Module Structure

```
src/views/sales-invoice/
├── components/
│   └── SalesInvoiceDataTable.vue    # Main data table with FcxDataTable
├── composables/
│   ├── useSalesInvoices.ts          # Invoice CRUD operations
│   ├── useInvoiceCalculations.ts    # Tax & total calculations
│   └── useInvoiceValidation.ts      # Form validation logic
├── constants/
│   └── sales-invoice-constants.ts   # Tax rates, payment terms, validation rules
├── services/
│   └── sales-invoice.service.ts     # API service layer
├── stores/
│   └── salesInvoiceStore.ts         # Pinia state management
├── types/
│   └── sales-invoice-types.ts       # TypeScript interfaces & enums
├── utils/
│   ├── invoice-calculations.ts      # Calculation utilities
│   ├── invoice-validation.ts        # Validation functions
│   └── invoice-formatters.ts        # Display formatting
├── views/
│   ├── SalesInvoiceListView.vue     # List view with data table
│   ├── SalesInvoiceCreateView.vue   # Create new invoice
│   └── SalesInvoiceEditView.vue     # Edit existing invoice
└── index.ts                         # Module exports
```

## ✨ Features Implemented

### Core Infrastructure
- ✅ **TypeScript Types**: Complete type definitions for invoices, line items, filters
- ✅ **Constants**: Tax rates, payment terms, status options, validation rules
- ✅ **API Service**: Full CRUD operations following gstin-accounts.service pattern
- ✅ **Pinia Store**: Centralized state management with composition API
- ✅ **Utilities**: Calculations, validation, and formatting functions

### Components
- ✅ **SalesInvoiceDataTable**: Full-featured data table using `FcxDataTable`
  - Column-based display (invoice #, customer, dates, amount, status)
  - Filtering by status (draft, sent, paid, overdue)
  - Pagination and search
  - Row actions menu (view, edit, send, download, delete)
  - Error states and loading indicators

### Views
- ✅ **List View**: Invoice list with search and filters
- ✅ **Create View**: Form placeholder for creating invoices
- ✅ **Edit View**: Form placeholder for editing invoices

### Composables
- ✅ **useSalesInvoices**: Data fetching and CRUD operations
- ✅ **useInvoiceCalculations**: Tax calculations (CGST/SGST/IGST)
- ✅ **useInvoiceValidation**: Form and field validation

### Routing
- ✅ `/sales-invoice` → Redirects to list
- ✅ `/sales-invoice/list` → Invoice list view
- ✅ `/sales-invoice/create` → Create new invoice
- ✅ `/sales-invoice/edit/:id` → Edit invoice by ID

## 🚀 Usage

### Import the module
```typescript
import {
  SalesInvoiceDataTable,
  useSalesInvoices,
  formatCurrency,
  calculateInvoiceTotals
} from '@/views/sales-invoice'
```

### Use in component
```vue
<script setup lang="ts">
import { useSalesInvoices } from '@/views/sales-invoice'

const {
  invoices,
  isLoading,
  fetchInvoices,
  createInvoice
} = useSalesInvoices()

onMounted(async () => {
  await fetchInvoices()
})
</script>
```

## 📋 Next Steps (Form Implementation)

The module is fully functional with the following placeholders ready for implementation:

### 1. **Invoice Form Components** (To be built)
Create these components in `components/`:

- `InvoiceHeaderSection.vue`
  - Customer selection (FcxAutoComplete or FcxDropdown)
  - Invoice number (FcxInputtext)
  - Invoice date (FcxCalendar)
  - Due date (FcxCalendar)
  - Payment terms (FcxDropdown)
  - Place of supply (FcxDropdown)

- `InvoiceLineItemsSection.vue`
  - Editable table for line items
  - Product name (FcxInputtext or FcxAutoComplete)
  - HSN code (FcxInputtext)
  - Quantity (FcxInputNumber)
  - Unit price (FcxInputNumber)
  - Discount (FcxInputNumber)
  - Tax rate (FcxDropdown)
  - Add/Remove row buttons

- `InvoiceTotalsSection.vue`
  - Display calculated totals
  - Subtotal, discounts, taxes
  - CGST/SGST or IGST breakdown
  - Grand total

- `SalesInvoiceForm.vue`
  - Orchestrates all form sections
  - Handles form submission
  - Validation integration
  - Save draft / Create invoice actions

### 2. **Integration Examples**

```vue
<!-- InvoiceHeaderSection.vue -->
<template>
  <div class="invoice-header">
    <FcxInputtext
      name="invoiceNumber"
      label="Invoice Number"
      v-model="formData.invoiceNumber"
      :error="errors.invoiceNumber"
      required
    />
    
    <FcxCalendar
      name="invoiceDate"
      label="Invoice Date"
      v-model="formData.invoiceDate"
      :error="errors.invoiceDate"
      required
    />
    
    <FcxDropdown
      name="paymentTerms"
      label="Payment Terms"
      v-model="formData.paymentTerms"
      :options="PAYMENT_TERMS_OPTIONS"
      optionLabel="label"
      optionValue="value"
      required
    />
  </div>
</template>
```

### 3. **Customer & Product Masters**
If you need customer/product selection:

- Create `CustomerSelector.vue` with `FcxAutoComplete`
- Create `ProductSelector.vue` with `FcxAutoComplete`
- Add API services for fetching customers/products
- Integrate with form sections

## 🔧 Configuration

### Tax Rates
Defined in `constants/sales-invoice-constants.ts`:
```typescript
export const TAX_RATES = {
  GST_0: 0,
  GST_5: 5,
  GST_12: 12,
  GST_18: 18,
  GST_28: 28
}
```

### Payment Terms
```typescript
export const PAYMENT_TERMS_OPTIONS = [
  { label: 'Due on Receipt', value: 'due_on_receipt', days: 0 },
  { label: 'Net 15 Days', value: 'net_15', days: 15 },
  { label: 'Net 30 Days', value: 'net_30', days: 30 },
  { label: 'Net 60 Days', value: 'net_60', days: 60 }
]
```

### Invoice Statuses
```typescript
export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}
```

## 🎨 Styling
All components use CSS variables from the global theme:
- `--primary-color`
- `--text-color`
- `--text-color-secondary`
- `--surface-card`
- `--surface-border`

## 📱 Responsive Design
Components are built mobile-first and responsive across all breakpoints.

## 🧪 Testing
To test the module:
1. Navigate to `/sales-invoice/list`
2. Click "Create Invoice" button
3. Use filter buttons to filter by status
4. Click row to view/edit invoice

## 📝 Notes
- Module follows GSTIN pattern for consistency
- All calculations handle CGST/SGST (intra-state) and IGST (inter-state)
- Validation is comprehensive with field-level and form-level checks
- Error handling is built into all API calls
- Store provides centralized state management

## 🤝 Contributing
When adding form components:
1. Follow the component structure of existing form components
2. Use composition API with `<script setup>`
3. Implement proper validation using `useInvoiceValidation`
4. Handle calculations using `useInvoiceCalculations`
5. Update types if needed
6. Export from `index.ts`
