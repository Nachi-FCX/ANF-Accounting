<template>
  <div class="line-items-section">
    <div class="line-items-section__header">
      <h3 class="line-items-section__title">
        <i class="pi pi-list mr-2"></i>
        Line Items
      </h3>
    </div>

    <div class="line-items-section__content">
      <div v-if="lineItems.length === 0" class="line-items-section__empty">
        <div class="empty-icon">
          <i class="pi pi-inbox"></i>
        </div>
        <div class="empty-text">No items added yet</div>
        <div class="empty-subtext">Click "Add Item" to get started</div>
      </div>

      <div v-else class="line-items-section__table-wrapper">
        <table>
          <thead>
            <tr>
              <th style="width: 3%; text-align: center;">#</th>
              <th style="width: 10%; text-align: left;">Product Code</th>
              <th style="width: 25%; text-align: left;">Description of Goods</th>
              <th style="width: 7%; text-align: right;">Quantity</th>
              <th style="width: 8%; text-align: center;">Per</th>
              <th style="width: 10%; text-align: right;">Rate</th>
              <th style="width: 10%; text-align: right;">Amount Excl. VAT</th>
              <th style="width: 7%; text-align: right;">VAT %</th>
              <th style="width: 10%; text-align: right;">VAT Amount</th>
              <th style="width: 10%; text-align: right;">Amt incl. VAT</th>
              <th style="width: 3%; text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lineItems" :key="item.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td>
                <FcxInputtext 
                  v-model="item.hsnCode"
                  placeholder="Product Code"
                  size="sm"
                  class="w-full"
                />
              </td>
              <td>
                <FcxInputtext 
                  v-model="item.productName"
                  placeholder="Description of goods"
                  size="sm"
                  class="w-full"
                />
              </td>
              <td class="text-right">
                <FcxInputNumber
                  v-model="item.quantity"
                  :min="0"
                  :max-fraction-digits="3"
                  size="sm"
                  class="w-full text-right"
                  @input="updateLineItem(index)"
                />
              </td>
              <td class="text-center">
                <FcxDropdown
                  v-model="item.unit"
                  :options="unitOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Per"
                  size="sm"
                  class="w-full"
                />
              </td>
              <td class="text-right">
                <FcxInputNumber
                  v-model="item.unitPrice"
                  :min="0"
                  :max-fraction-digits="2"
                  size="sm"
                  class="w-full text-right"
                  @input="updateLineItem(index)"
                />
              </td>
              <td class="text-right line-items-section__amount">
                {{ formatCurrency(calculateAmountExclVAT(item)) }}
              </td>
              <td class="text-right">
                <div class="line-items-section__tax">
                  <FcxInputNumber
                    v-model="item.taxRate"
                    suffix="%"
                    :min="0"
                    :max="100"
                    :max-fraction-digits="2"
                    size="sm"
                    class="w-full text-right"
                    @input="updateLineItem(index)"
                  />
                </div>
              </td>
              <td class="text-right line-items-section__amount">
                {{ formatCurrency(calculateVATAmount(item)) }}
              </td>
              <td class="text-right line-items-section__amount">
                {{ formatCurrency(calculateItemAmount(item)) }}
              </td>
              <td class="text-center">
                <FcxButton
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  size="sm"
                  @click="removeLineItem(index)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="line-items-section__actions">
      <FcxButton
        label="Add Another Item"
        icon="pi pi-plus"
        severity="secondary"
        outlined
        size="sm"
        @click="addLineItem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceLineItem } from '../types/sales-invoice-types'
import FcxButton from '@/components/buttoncomponents/FcxButton.vue'
import FcxInputtext from '@/components/formcomponents/FcxInputtext.vue'
import FcxInputNumber from '@/components/formcomponents/FcxInputNumber.vue'
import FcxDropdown from '@/components/formcomponents/FcxDropdown.vue'

// Props
interface Props {
  modelValue: InvoiceLineItem[]
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (event: 'update:modelValue', value: InvoiceLineItem[]): void
}

const emit = defineEmits<Emits>()

// Reactive data
const lineItems = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const unitOptions = [
  { label: 'Units', value: 'Units' },
  { label: 'PCS', value: 'PCS' },
  { label: 'KG', value: 'KG' },
  { label: 'MTR', value: 'MTR' },
  { label: 'LTR', value: 'LTR' },
  { label: 'BOX', value: 'BOX' },
  { label: 'SET', value: 'SET' },
  { label: 'NOS', value: 'NOS' }
]

// Generate unique ID for new line items
let nextId = 1

// Methods
const addLineItem = () => {
  const newItem: InvoiceLineItem = {
    id: nextId++,
    productName: '',
    description: '',
    hsnCode: '',
    quantity: 1,
    unit: 'Units',
    unitPrice: 0,
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'amount',
    taxRate: 18,
    amount: 0
  }
  
  lineItems.value = [...lineItems.value, newItem]
}

const removeLineItem = (index: number) => {
  lineItems.value = lineItems.value.filter((_, i) => i !== index)
}

const updateLineItem = (index: number) => {
  const item = lineItems.value[index]
  item.amount = calculateItemAmount(item)
  
  // Trigger reactivity
  lineItems.value = [...lineItems.value]
}

const calculateAmountExclVAT = (item: InvoiceLineItem): number => {
  const subtotal = item.quantity * item.unitPrice
  const discountAmount = item.discountType === 'percentage' 
    ? (subtotal * item.discount) / 100 
    : item.discount
  return subtotal - discountAmount
}

const calculateVATAmount = (item: InvoiceLineItem): number => {
  const amountExclVAT = calculateAmountExclVAT(item)
  return (amountExclVAT * item.taxRate) / 100
}

const calculateItemAmount = (item: InvoiceLineItem): number => {
  const amountExclVAT = calculateAmountExclVAT(item)
  const vatAmount = calculateVATAmount(item)
  return amountExclVAT + vatAmount
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
</script>

<style scoped lang="scss">
.line-items-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  margin-top: 0.75rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }

  &__title {
    margin: 0;
    color: #1e293b;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    
    i {
      color: #3b82f6;
      margin-right: 0.5rem;
      font-size: 0.875rem;
    }
  }

  &__add-btn {
    background: #3b82f6;
    border: none;
    transition: all 0.15s ease;

    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
  }

  &__content {
    min-height: 150px;
  }

  &__empty {
    text-align: center;
    padding: 2rem 1rem;
    color: #6b7280;
    background: #f9fafb;
    border-radius: 8px;
    border: 2px dashed #d1d5db;
    
    .empty-icon {
      font-size: 2rem;
      color: #d1d5db;
      margin-bottom: 0.75rem;
    }
    
    .empty-text {
      font-size: 1rem;
      margin-bottom: 0.375rem;
      color: #6b7280;
      font-weight: 500;
    }
    
    .empty-subtext {
      font-size: 0.875rem;
      color: #9ca3af;
    }
  }

  &__table-wrapper {
    background: white;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #e2e8f0;

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;

      th {
        background: #f8fafc;
        padding: 0.5rem 0.375rem;
        text-align: left;
        font-weight: 500;
        color: #475569;
        border-bottom: 1px solid #e2e8f0;
        font-size: 0.75rem;
        white-space: nowrap;
      }

      td {
        padding: 0.375rem;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;

        &.text-right {
          text-align: right;
        }

        &.text-center {
          text-align: center;
        }
      }

      tbody tr {
        transition: background-color 0.15s ease;
        
        &:hover {
          background: #f9fafb;
        }

        &:last-child td {
          border-bottom: none;
        }
      }
    }
  }

  &__tax {
    display: flex;
    justify-content: flex-end;
  }

  &__amount {
    font-weight: 500;
    color: #1e293b;
    text-align: right;
    padding-right: 0.5rem;
    font-family: monospace;
  }

  &__actions {
    margin-top: 1rem;
    text-align: center;

    button {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border-radius: 6px;
      transition: all 0.15s ease;

      &:hover {
        transform: translateY(-1px);
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .line-items-section {
    padding: 0.75rem;
    margin-top: 0.5rem;

    &__table-wrapper {
      overflow-x: auto;
    }
  }
}
</style>