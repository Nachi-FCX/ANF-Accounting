<template>
  <div class="sales-invoice-page">
    <!-- Simplified Header -->
    <div class="invoice-page-header sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">New Invoice</h1>
          <span class="invoice-status-badge">DRAFT</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <form @submit.prevent="saveInvoice" class="space-y-6">
        <InvoiceHeader v-model="invoice" />
        
        <InvoiceItemTable :items="invoice.items" @update:items="updateItems" />
        
        <InvoiceFooter v-model="invoice" />
        
        <InvoiceActions 
          @save="saveInvoice"
          @cancel="cancel"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import InvoiceHeader from '../components/InvoiceHeader.vue';
import InvoiceItemTable from '../components/InvoiceItemTable.vue';
import InvoiceFooter from '../components/InvoiceFooter.vue';
import InvoiceActions from '../components/InvoiceActions.vue';
import type { Invoice, InvoiceItem } from '../types/invoice-types';
import { DEFAULT_INVOICE_ITEM } from '../types/invoice-types';
import { calculateSubTotal } from '../utils/invoice-calculations';

const invoice = reactive<Invoice>({
  customerName: '',
  invoiceNumber: '', // Manual input now
  orderNumber: '',
  invoiceDate: new Date(),
  terms: '',
  dueDate: new Date(),
  salesperson: '',
  subject: '',
  items: [{ ...DEFAULT_INVOICE_ITEM, id: '1' }],
  subTotal: 0,
  discountType: 'amount',
  discountValue: 0,
  customerNotes: '',
});

const updateItems = (newItems: InvoiceItem[]) => {
  invoice.items = newItems;
  invoice.subTotal = calculateSubTotal(newItems);
};

const saveInvoice = () => {
  console.log('Saving invoice:', invoice);
  // Implement save logic here
};

const cancel = () => {
  console.log('Cancelled');
  // Implement navigation back or clear form
};

// Watch for changes in items to recalculate subtotal automatically if needed
watch(() => invoice.items, (newItems) => {
  invoice.subTotal = calculateSubTotal(newItems);
}, { deep: true });

</script>

<style>
@import '../styles/invoice.css';
</style>
