<template>
  <div class="invoice-section-card p-6">
    <div class="grid grid-cols-12 gap-8">
      <!-- Left Side: Customer Notes -->
      <div class="col-span-12 md:col-span-6">
        <h4 class="invoice-section-title">Customer Notes</h4>
        <FcxTextarea
          name="customerNotes"
          v-model="modelValue.customerNotes"
          :rows="5"
          placeholder="Thanks for your business."
          help="Will be displayed on the invoice"
          class="w-full"
        />
      </div>

      <!-- Right Side: Totals -->
      <div class="col-span-12 md:col-span-6">
        <div class="invoice-totals-container">
          <!-- Sub Total -->
          <div class="invoice-total-row">
            <span class="invoice-total-label">Sub Total</span>
            <span class="invoice-total-value">₹{{ formatCurrency(modelValue.subTotal) }}</span>
          </div>

          <!-- VAT Total -->
          <div class="invoice-total-row">
            <span class="invoice-total-label">Total VAT</span>
            <span class="invoice-total-value">₹{{ formatCurrency(totalVat) }}</span>
          </div>

          <!-- Discount -->
          <div class="invoice-total-row">
            <span class="invoice-total-label">Discount</span>
            <div class="flex items-center gap-2">
              <FcxInputNumber
                name="discountValue"
                v-model="modelValue.discountValue"
                class="w-20 text-right invoice-input-sm"
                :min="0"
              />
              <span class="text-sm text-gray-500 font-medium">%</span>
            </div>
            <span class="invoice-discount-value">- ₹{{ formatCurrency(calculateDiscountAmount()) }}</span>
          </div>

          <!-- Total -->
          <div class="invoice-total-row highlight">
            <span>Total (₹)</span>
            <span>₹{{ formatCurrency(total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import FcxTextarea from '@/components/formcomponents/FcxTextarea.vue';
import FcxInputNumber from '@/components/formcomponents/FcxInputNumber.vue';
import type { Invoice } from '../types/invoice-types';
import { calculateTotal, calculateTotalVat } from '../utils/invoice-calculations';

const props = defineProps<{
  modelValue: Invoice;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Invoice): void;
}>();

const calculateDiscountAmount = () => {
  if (props.modelValue.discountType === 'amount') {
    return props.modelValue.discountValue;
  }
  return (props.modelValue.subTotal * props.modelValue.discountValue) / 100;
};

const totalVat = computed(() => {
  return calculateTotalVat(props.modelValue.items);
});

const total = computed(() => {
  return calculateTotal(
    props.modelValue.subTotal,
    totalVat.value,
    props.modelValue.discountType,
    props.modelValue.discountValue
  );
});

const formatCurrency = (value: number) => {
  return value.toFixed(2);
};
</script>
