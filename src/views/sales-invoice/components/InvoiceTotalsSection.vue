<template>
  <div class="invoice-totals-section">
    <div class="invoice-totals-section__grid">
      <div class="invoice-totals-section__row">
        <span class="invoice-totals-section__label">Total Excl. VAT</span>
        <span class="invoice-totals-section__value">AED {{ formatCurrency(totals.taxableAmount) }}</span>
      </div>

      <div class="invoice-totals-section__row">
        <span class="invoice-totals-section__label">VAT 5%</span>
        <span class="invoice-totals-section__value">AED {{ formatCurrency(totals.totalTax) }}</span>
      </div>

      <div class="invoice-totals-section__row invoice-totals-section__row--grand-total">
        <span class="invoice-totals-section__label">Grand Total</span>
        <span class="invoice-totals-section__value">AED {{ formatCurrency(grandTotal) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TaxCalculation } from '../types/sales-invoice-types'
import { formatCurrency } from '../utils/invoice-formatters'

interface Props {
  totals: TaxCalculation
  isInterState: boolean
}

const props = defineProps<Props>()

const grandTotal = computed(() => {
  return Math.round(props.totals.totalAmount)
})
</script>

<style scoped lang="scss">
.invoice-totals-section {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 450px;
  margin-left: auto;
  margin-top: 1rem;

  &__title {
    margin: 0 0 1.25rem 0;
    color: #1e293b;
    font-size: 1.125rem;
    font-weight: 600;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    
    &::before {
      content: '💰';
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    padding: 0.4rem 0;
    gap: 1rem;

    &--total {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-color);
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 2px solid var(--surface-border);
    }

    &--grand-total {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--primary-color);
      padding: 0.75rem 1rem;
      background: var(--primary-color-text);
      border-radius: 6px;
      margin-top: 0.5rem;
    }
  }

  &__label {
    color: var(--text-color-secondary);
    font-weight: 500;
    font-size: 0.875rem;
    text-align: left;
  }

  &__value {
    font-weight: 600;
    color: var(--text-color);
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    text-align: right;
    white-space: nowrap;

    &--discount {
      color: var(--red-500);
    }
  }

  &__divider {
    height: 1px;
    background: var(--surface-border);
    margin: 0.4rem 0;
  }

  &__tax-group {
    background: var(--surface-ground);
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 1rem;
    padding: 0.5rem 0.75rem;
    background: var(--blue-50);
    border-left: 3px solid var(--blue-500);
    border-radius: 4px;
    font-size: 0.8125rem;
    color: var(--blue-700);

    i {
      color: var(--blue-500);
      font-size: 0.875rem;
    }
  }
}
</style>
