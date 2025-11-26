<template>
  <div class="invoice-section-card p-6">
    <div class="flex justify-between items-center mb-5">
      <h3 class="invoice-section-title mb-0">Item Details</h3>
      <FcxButton label="Scan Item" icon="pi pi-qrcode" class="p-button-text p-button-sm" type="button" />
    </div>

    <FcxDataTable
      :value="items"
      :columns="tableColumns"
      dataKey="id"
      :showHeader="false"
      :paginator="false"
      :showActionsColumn="true"
      :showAddButton="false"
      :showExport="false"
      :showSearch="false"
      class="invoice-data-table"
    >
      <!-- Product Code Column -->
      <template #body-productCode="{ data, index }">
        <FcxInputtext
          :name="`items[${index}].productCode`"
          v-model="data.productCode"
          placeholder="Code"
          class="invoice-input-sm w-full"
          @input="updateAmount(index)"
        />
      </template>

      <!-- Description Column -->
      <template #body-description="{ data, index }">
        <FcxInputtext
          :name="`items[${index}].description`"
          v-model="data.description"
          placeholder="Description"
          class="invoice-input-sm w-full"
          @input="updateAmount(index)"
        />
      </template>

      <!-- Quantity Column -->
      <template #body-quantity="{ data, index }">
        <FcxInputNumber
          :name="`items[${index}].quantity`"
          v-model="data.quantity"
          :min="1"
          class="invoice-input-sm w-full text-right"
          @input="updateAmount(index)"
        />
      </template>

      <!-- Rate Column -->
      <template #body-rate="{ data, index }">
        <FcxInputNumber
          :name="`items[${index}].rate`"
          v-model="data.rate"
          :min="0"
          :fractionDigits="2"
          class="invoice-input-sm w-full text-right"
          @input="updateAmount(index)"
        />
      </template>

      <!-- Amount Column -->
      <template #body-amount="{ data }">
        <div class="text-right font-semibold text-gray-900">
          ₹{{ formatCurrency(data.amount) }}
        </div>
      </template>

      <!-- VAT Rate Column -->
      <template #body-vatRate="{ data, index }">
        <FcxInputNumber
          :name="`items[${index}].vatRate`"
          v-model="data.vatRate"
          :min="0"
          :max="100"
          :fractionDigits="2"
          class="invoice-input-sm w-full text-right"
          @input="updateAmount(index)"
        />
      </template>

      <!-- VAT Amount Column -->
      <template #body-vatAmount="{ data }">
        <div class="text-right text-gray-700">
          ₹{{ formatCurrency(data.vatAmount) }}
        </div>
      </template>

      <!-- Total Amount Column -->
      <template #body-totalAmount="{ data }">
        <div class="text-right font-bold text-gray-900">
          ₹{{ formatCurrency(data.totalAmount) }}
        </div>
      </template>

      <!-- Actions Column -->
      <template #actions="{ index }">
        <button 
          @click="removeItem(index)" 
          class="invoice-delete-btn"
          title="Remove Item"
          type="button"
        >
          <i class="pi pi-trash text-sm"></i>
        </button>
      </template>
    </FcxDataTable>

    <!-- Totals Row -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-12 gap-4 text-sm font-semibold">
        <div class="col-span-4 text-right">Total:</div>
        <div class="col-span-1 text-right">₹{{ formatCurrency(totalAmount) }}</div>
        <div class="col-span-1"></div>
        <div class="col-span-1 text-right">₹{{ formatCurrency(totalVat) }}</div>
        <div class="col-span-2 text-right text-lg font-bold">₹{{ formatCurrency(grandTotal) }}</div>
        <div class="col-span-1"></div>
      </div>
    </div>

    <div class="flex gap-3 mt-5 pt-4 border-t border-gray-100">
      <FcxButton 
        label="Add Line Item" 
        icon="pi pi-plus" 
        class="invoice-btn-secondary" 
        @click="addItem"
        type="button"
      />
      <FcxButton 
        label="Bulk Add" 
        icon="pi pi-list" 
        class="p-button-text p-button-sm" 
        type="button"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import FcxInputtext from '@/components/formcomponents/FcxInputtext.vue';
import FcxInputNumber from '@/components/formcomponents/FcxInputNumber.vue';
import FcxButton from '@/components/buttoncomponents/FcxButton.vue';
import FcxDataTable from '@/components/datacomponents/FcxDataTable.vue';
import type { InvoiceItem } from '../types/invoice-types';
import { DEFAULT_INVOICE_ITEM } from '../types/invoice-types';

const props = defineProps<{
  items: InvoiceItem[];
}>();

const emit = defineEmits<{
  (e: 'update:items', value: InvoiceItem[]): void;
}>();

const tableColumns = [
  { field: 'productCode', header: 'Product Code', sortable: false, style: { width: '120px' } },
  { field: 'description', header: 'Description', sortable: false, style: { width: '280px' } },
  { field: 'quantity', header: 'Qty', sortable: false, style: { width: '100px' } },
  { field: 'rate', header: 'Rate', sortable: false, style: { width: '120px' } },
  { field: 'amount', header: 'Amount', sortable: false, style: { width: '120px' } },
  { field: 'vatRate', header: 'VAT %', sortable: false, style: { width: '90px' } },
  { field: 'vatAmount', header: 'VAT Amt', sortable: false, style: { width: '120px' } },
  { field: 'totalAmount', header: 'Total', sortable: false, style: { width: '140px' } },
];

const addItem = () => {
  const newItem = { ...DEFAULT_INVOICE_ITEM, id: Date.now().toString() };
  emit('update:items', [...props.items, newItem]);
};

const removeItem = (index: number) => {
  const newItems = [...props.items];
  newItems.splice(index, 1);
  emit('update:items', newItems);
};

const updateAmount = (index: number) => {
  const item = props.items[index];
  item.amount = item.quantity * item.rate;
  item.vatAmount = (item.amount * item.vatRate) / 100;
  item.totalAmount = item.amount + item.vatAmount;
  emit('update:items', [...props.items]);
};

const formatCurrency = (value: number) => {
  return value.toFixed(2);
};

// Computed totals
const totalAmount = computed(() => props.items.reduce((sum, item) => sum + item.amount, 0));
const totalVat = computed(() => props.items.reduce((sum, item) => sum + item.vatAmount, 0));
const grandTotal = computed(() => props.items.reduce((sum, item) => sum + item.totalAmount, 0));
</script>

<style scoped>
/* Custom styles for invoice data table */
:deep(.invoice-data-table .p-datatable-table) {
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.invoice-data-table .p-datatable-thead > tr > th) {
  background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 0.875rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e5e7eb;
}

:deep(.invoice-data-table .p-datatable-tbody > tr) {
  transition: background-color 0.15s ease;
}

:deep(.invoice-data-table .p-datatable-tbody > tr:hover) {
  background-color: #f9fafb;
}

:deep(.invoice-data-table .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}
</style>
