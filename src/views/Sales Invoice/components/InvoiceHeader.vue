<template>
  <div class="invoice-header space-y-6">
    <!-- Section 1: Customer Details -->
    <div class="invoice-section-card p-6">
      <h2 class="invoice-section-title">Customer Details</h2>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 sm:col-span-6 lg:col-span-4">
          <FcxInputtext
            name="customerName"
            label="Customer Name"
            v-model="modelValue.customerName"
            required
            placeholder="Select or add a customer"
          />
        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-4">
          <FcxInputtext
            name="salesperson"
            label="Salesperson"
            v-model="modelValue.salesperson"
            placeholder="Select or Add Salesperson"
          />
        </div>
      </div>
    </div>

    <!-- Section 2: Invoice Details -->
    <div class="invoice-section-card p-6">
      <h2 class="invoice-section-title">Invoice Details</h2>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 sm:col-span-6 lg:col-span-3">
          <FcxInputtext
            name="invoiceNumber"
            label="Invoice#"
            v-model="modelValue.invoiceNumber"
            required
          />
        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-3">
          <FcxInputtext
            name="orderNumber"
            label="Order Number"
            v-model="modelValue.orderNumber"
          />
        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-3">
          <FcxDropdown
            name="terms"
            label="Terms"
            v-model="modelValue.terms"
            :options="paymentTerms"
            optionLabel="label"
            optionValue="value"
            placeholder="Due on Receipt"
          />
        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-3">
          <FcxCalendar
            name="invoiceDate"
            label="Invoice Date"
            v-model="modelValue.invoiceDate"
            required
            dateFormat="dd/mm/yy"
          />
        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-3">
          <FcxCalendar
            name="dueDate"
            label="Due Date"
            v-model="modelValue.dueDate"
            dateFormat="dd/mm/yy"
          />
        </div>
        <div class="col-span-12 lg:col-span-9">
          <FcxTextarea
            name="subject"
            label="Subject"
            v-model="modelValue.subject"
            :rows="2"
            placeholder="Let your customer know what this Invoice is for"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch } from 'vue';
import FcxInputtext from '@/components/formcomponents/FcxInputtext.vue';
import FcxDropdown from '@/components/formcomponents/FcxDropdown.vue';
import FcxCalendar from '@/components/formcomponents/FcxCalendar.vue';
import FcxTextarea from '@/components/formcomponents/FcxTextarea.vue';
import { PAYMENT_TERMS } from '../constants/invoice-constants';
import type { Invoice } from '../types/invoice-types';

const props = defineProps<{
  modelValue: Invoice;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Invoice): void;
}>();

const paymentTerms = PAYMENT_TERMS;

// Auto-calculate Due Date based on Terms and Invoice Date
watch(
  [() => props.modelValue.terms, () => props.modelValue.invoiceDate],
  ([newTerms, newInvoiceDate]) => {
    if (!newTerms || !newInvoiceDate) return;

    const date = new Date(newInvoiceDate);
    let daysToAdd = 0;

    if (newTerms === 'Net 15') daysToAdd = 15;
    else if (newTerms === 'Net 30') daysToAdd = 30;
    else if (newTerms === 'Net 45') daysToAdd = 45;
    else if (newTerms === 'Net 60') daysToAdd = 60;
    // 'Due on Receipt' adds 0 days

    date.setDate(date.getDate() + daysToAdd);
    
    // Update the model value with the new due date
    // We need to emit the update because props are read-only
    const updatedInvoice = { ...props.modelValue, dueDate: date };
    emit('update:modelValue', updatedInvoice);
  }
);
</script>

<style scoped>
/* Scoped styles removed in favor of Tailwind utility classes */
</style>
