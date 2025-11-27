<template>
  <div class="invoice-form">
    <!-- Top Section: Customer & Invoice Info -->
    <div class="invoice-top-section">
      <!-- Left: Customer Information -->
      <div class="customer-section">
        <div class="section-header">
          <i class="pi pi-user"></i>
          <span>Contact</span>
        </div>
        
        <div class="customer-selector">
          <FcxDropdown
            name="customerId"
            v-model="localData.customerId"
            :options="customerOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select or search customer"
            :filter="true"
            filterBy="label"
            :error="errors.customerId"
            required
            class="customer-dropdown"
            @change="onCustomerChange"
          >
            <template #option="{ option }">
              <div class="customer-option">
                <div class="customer-name">{{ option.customer.name }}</div>
                <div class="customer-details">
                  <span v-if="option.customer.gstin" class="gstin">GSTIN: {{ option.customer.gstin }}</span>
                  <span v-if="option.customer.trnNumber" class="trn">TRN: {{ option.customer.trnNumber }}</span>
                  <span v-if="option.customer.phone" class="phone">{{ option.customer.phone }}</span>
                </div>
              </div>
            </template>
          </FcxDropdown>
        </div>

        <!-- Customer Details Display -->
        <div v-if="selectedCustomer" class="customer-details-display">
          <div class="detail-row">
            <strong>{{ selectedCustomer.name }}</strong>
          </div>
          <div v-if="selectedCustomer.email" class="detail-row">
            {{ selectedCustomer.email }}
          </div>
          <div v-if="selectedCustomer.phone" class="detail-row">
            {{ selectedCustomer.phone }}
          </div>
          <div v-if="selectedCustomer.gstin" class="detail-row">
            <span class="detail-label">GSTIN:</span> {{ selectedCustomer.gstin }}
          </div>
          <div v-if="selectedCustomer.trnNumber" class="detail-row">
            <span class="detail-label">TRN:</span> {{ selectedCustomer.trnNumber }}
          </div>
          <div v-if="billingAddress" class="detail-row address">
            <span class="detail-label">Billing Address:</span><br>
            {{ billingAddress }}
          </div>
        </div>

        <!-- Address Fields -->
        <div class="address-fields">
          <div class="field-group">
            <label class="field-label">Billing Address</label>
            <FcxTextarea
              name="billingAddress"
              v-model="localData.billingAddress"
              placeholder="Enter billing address"
              :rows="3"
              class="invoice-input"
            />
          </div>

          <div class="field-group">
            <label class="field-label">Shipping Address</label>
            <FcxDropdown
              name="shippingAddress"
              v-model="localData.shippingAddress"
              :options="shippingAddressOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select shipping address"
              :disabled="!selectedCustomer"
              class="invoice-input"
            />
          </div>
        </div>
      </div>

      <!-- Right: Invoice Information -->
      <div class="invoice-info-section">
        <div class="invoice-fields">
          <div class="field-row">
            <div class="field-group">
              <label class="field-label">Invoice Number</label>
              <div class="input-group">
                <FcxInputtext
                  name="invoiceNumber"
                  v-model="localData.invoiceNumber"
                  placeholder="INV-1997"
                  :error="errors.invoiceNumber"
                  :disabled="isGenerating"
                  class="invoice-input"
                />
                <FcxButton
                  v-if="!isGenerating"
                  icon="pi pi-refresh"
                  size="sm"
                  severity="secondary"
                  @click="handleGenerateNumber"
                  class="generate-btn"
                  text
                />
              </div>
            </div>
            
            <div class="field-group">
              <label class="field-label">Reference</label>
              <FcxInputtext
                name="reference"
                v-model="localData.reference"
                placeholder="Optional"
                class="invoice-input"
              />
            </div>
          </div>

          <div class="field-row">
            <div class="field-group">
              <label class="field-label required">Issue Date</label>
              <FcxCalendar
                name="invoiceDate"
                v-model="localData.invoiceDate"
                :error="errors.invoiceDate"
                required
                dateFormat="dd/mm/yy"
                :showIcon="true"
                class="invoice-input"
              />
            </div>
            
            <div class="field-group">
              <label class="field-label required">Due Date</label>
              <FcxCalendar
                name="dueDate"
                v-model="localData.dueDate"
                :error="errors.dueDate"
                required
                dateFormat="dd/mm/yy"
                :showIcon="true"
                class="invoice-input"
              />
            </div>
          </div>

          <div class="field-row">
            <div class="field-group">
              <label class="field-label">Ordered Date</label>
              <FcxCalendar
                name="orderedDate"
                v-model="localData.orderedDate"
                dateFormat="dd/mm/yy"
                :showIcon="true"
                placeholder="Select order date"
                class="invoice-input"
              />
            </div>
            
            <div class="field-group">
              <label class="field-label required">Place of Supply</label>
              <FcxDropdown
                name="placeOfSupply"
                v-model="localData.placeOfSupply"
                :options="INDIAN_STATES"
                optionLabel="label"
                optionValue="value"
                placeholder="Select state"
                :filter="true"
                filterBy="label"
                :error="errors.placeOfSupply"
                required
                class="invoice-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FcxInputtext } from '@/components/formcomponents'
import { FcxCalendar } from '@/components/formcomponents'
import { FcxDropdown } from '@/components/formcomponents'
import { FcxTextarea } from '@/components/formcomponents'
import { FcxButton } from '@/components/buttoncomponents'
import { INDIAN_STATES } from '../constants/sales-invoice-constants'
import type { 
  CreateInvoiceData, 
  InvoiceFormErrors, 
  Customer, 
  CustomerOption
} from '../types/sales-invoice-types'
import { useSalesInvoices } from '../composables/useSalesInvoices'

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Acme Corporation Ltd',
    email: 'info@acme.com',
    phone: '+971-4-123-4567',
    gstin: '29ABCDE1234F1Z5',
    trnNumber: '100123456700003',
    customerType: 'business',
    addresses: [
      {
        id: 1,
        customerId: 1,
        addressType: 'billing',
        addressLine1: 'Sheikh Zayed Road, Trade Center',
        city: 'Dubai',
        state: 'Dubai',
        postalCode: '12345',
        country: 'UAE',
        isDefault: true
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'Global Tech Solutions',
    email: 'contact@globaltech.com',
    phone: '+971-2-987-6543',
    gstin: '07GHIJK5678L2M6',
    trnNumber: '100987654321001',
    customerType: 'business',
    addresses: [
      {
        id: 2,
        customerId: 2,
        addressType: 'billing',
        addressLine1: 'Business Bay, Downtown',
        city: 'Dubai',
        state: 'Dubai',
        postalCode: '54321',
        country: 'UAE',
        isDefault: true
      }
    ],
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  },
  {
    id: 3,
    name: 'Emirates Trading Co',
    email: 'sales@emiratestrading.ae',
    phone: '+971-6-555-0123',
    trnNumber: '100555012300007',
    customerType: 'business',
    addresses: [
      {
        id: 3,
        customerId: 3,
        addressType: 'billing',
        addressLine1: 'Industrial Area 1',
        city: 'Sharjah',
        state: 'Sharjah',
        postalCode: '25689',
        country: 'UAE',
        isDefault: true
      }
    ],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03'
  }
]

interface Props {
  modelValue: Partial<CreateInvoiceData>
  errors?: InvoiceFormErrors
}

interface Emits {
  (e: 'update:modelValue', value: Partial<CreateInvoiceData>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { generateInvoiceNumber } = useSalesInvoices()
const isGenerating = ref(false)

const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const errors = computed(() => props.errors || {})

// Customer options for dropdown
const customerOptions = computed((): CustomerOption[] => {
  return mockCustomers.map(customer => ({
    label: customer.name,
    value: customer.id,
    customer
  }))
})

// Selected customer details
const selectedCustomer = computed(() => {
  if (!localData.value.customerId) return null
  return mockCustomers.find(c => c.id === localData.value.customerId) || null
})

// Billing address for display
const billingAddress = computed(() => {
  if (!selectedCustomer.value) return ''
  const addr = selectedCustomer.value.addresses.find(addr => 
    addr.addressType === 'billing' && addr.isDefault
  )
  if (!addr) return ''
  return `${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`
})

// Shipping address options
const shippingAddressOptions = computed(() => {
  if (!selectedCustomer.value) return []
  return selectedCustomer.value.addresses.map(addr => ({
    label: `${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.postalCode}`,
    value: `${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`
  }))
})

// Handle customer selection
const onCustomerChange = (customerId: number) => {
  const selectedCustomer = mockCustomers.find(c => c.id === customerId)
  if (selectedCustomer) {
    const billingAddress = selectedCustomer.addresses.find(addr => 
      addr.addressType === 'billing' && addr.isDefault
    )
    
    localData.value = {
      ...localData.value,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      customerPhone: selectedCustomer.phone,
      customerGSTIN: selectedCustomer.gstin,
      billingAddress: billingAddress ? 
        `${billingAddress.addressLine1}, ${billingAddress.city}, ${billingAddress.state} ${billingAddress.postalCode}` : 
        undefined
    }
  }
}

const handleGenerateNumber = async () => {
  try {
    isGenerating.value = true
    const invoiceNumber = await generateInvoiceNumber()
    localData.value = {
      ...localData.value,
      invoiceNumber
    }
  } catch (error) {
    console.error('Failed to generate invoice number:', error)
    const timestamp = Date.now().toString().slice(-6)
    localData.value = {
      ...localData.value,
      invoiceNumber: `INV-${timestamp}`
    }
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped lang="scss">
.invoice-form {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

  .invoice-top-section {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 2.5rem;
    padding: 1.5rem;
  }

  .customer-section {
    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
      color: #1f2937;
      
      i {
        color: #3b82f6;
      }
    }
    
    .customer-selector {
      margin-bottom: 1rem;
    }
    
    .customer-details-display {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 1rem;
      
      .detail-row {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        &.address {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }
      }
      
      .detail-label {
        font-weight: 500;
        color: #6b7280;
      }
    }

    .address-fields {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }

  .invoice-info-section {
    .invoice-fields {
      .field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;

    .field-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #374151;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      
      &.required::after {
        content: ' *';
        color: #ef4444;
      }
    }

    .invoice-input,
    .settings-input,
    .customer-dropdown {
      :deep(.p-inputtext),
      :deep(.p-dropdown),
      :deep(.p-calendar input) {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        transition: all 0.15s ease;
        background: white;
        
        &:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }
        
        &:hover:not(:focus) {
          border-color: #9ca3af;
        }
      }
    }

    .input-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .invoice-input {
        flex: 1;
      }
      
      .generate-btn {
        padding: 0.5rem;
        
        :deep(.p-button-icon) {
          font-size: 0.875rem;
        }
      }
    }
  }

  // Customer dropdown option styling
  .customer-option {
    padding: 0.5rem 0;
    
    .customer-name {
      font-weight: 600;
      color: #111827;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }
    
    .customer-details {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #6b7280;
      
      .gstin, .trn, .phone {
        background: #f3f4f6;
        padding: 0.125rem 0.5rem;
        border-radius: 12px;
        font-family: monospace;
        font-weight: 500;
      }
      
      .gstin {
        background: #dbeafe;
        color: #1d4ed8;
      }
      
      .trn {
        background: #d1fae5;
        color: #065f46;
      }
      
      .phone {
        background: #fef3c7;
        color: #92400e;
      }
    }
  }

  // Responsive design
  @media (max-width: 768px) {
    .invoice-top-section {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 1rem;
    }
    
    .invoice-fields .field-row,
    .settings-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
}
</style>