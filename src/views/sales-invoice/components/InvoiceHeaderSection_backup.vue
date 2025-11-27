<template>
  <div class="invoice-header-section">
    <div class="section-header">
      <div class="section-title">
        <i class="pi pi-file-edit"></i>
        <h3>Invoice Details</h3>
      </div>
    </div>
    
    <!-- Contact Information Card -->
    <div class="field-card contact-card">
      <div class="card-header">
        <i class="pi pi-users"></i>
        <span>Customer Information</span>
      </div>
      <div class="field-group">
        <div class="form-field full-width">
          <label class="field-label required">
            Contact
          </label>
          <FcxInputtext
            name="customerName"
            v-model="localData.customerName"
            placeholder="Enter customer name"
            :error="errors.customerName"
            required
            class="modern-input"
          />
        </div>
      </div>
    </div>

    <!-- Invoice Details Card -->
    <div class="field-card details-card">
      <div class="card-header">
        <i class="pi pi-file-text"></i>
        <span>Invoice Information</span>
      </div>
      <div class="field-group grid-4">
        <!-- Invoice Number -->
        <div class="form-field">
          <label class="field-label">Invoice Number</label>
          <div class="input-group">
            <FcxInputtext
              name="invoiceNumber"
              v-model="localData.invoiceNumber"
              placeholder="INV-1997"
              :error="errors.invoiceNumber"
              :disabled="isGenerating"
              class="modern-input"
            />
            <FcxButton
              v-if="!isGenerating"
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              @click="handleGenerateNumber"
              class="generate-btn"
              text
            />
          </div>
        </div>

        <!-- Issue Date -->
        <div class="form-field">
          <label class="field-label required">Issue Date</label>
          <FcxCalendar
            name="invoiceDate"
            v-model="localData.invoiceDate"
            :error="errors.invoiceDate"
            required
            dateFormat="dd/mm/yy"
            :showIcon="true"
            class="modern-input"
          />
        </div>

        <!-- Due Date -->
        <div class="form-field">
          <label class="field-label required">Due Date</label>
          <FcxCalendar
            name="dueDate"
            v-model="localData.dueDate"
            :error="errors.dueDate"
            required
            dateFormat="dd/mm/yy"
            :showIcon="true"
            class="modern-input"
          />
        </div>

        <!-- Reference -->
        <div class="form-field">
          <label class="field-label">Reference</label>
          <FcxInputtext
            name="reference"
            v-model="localData.reference"
            placeholder="Optional"
            class="modern-input"
          />
        </div>
      </div>
    </div>

    <!-- Settings Card -->
    <div class="field-card settings-card">
      <div class="card-header">
        <i class="pi pi-cog"></i>
        <span>Settings & Location</span>
      </div>
      <div class="field-group grid-2">
        <!-- Branding Theme -->
        <div class="form-field">
          <label class="field-label">Branding Theme</label>
          <FcxDropdown
            name="brandingTheme"
            v-model="localData.brandingTheme"
            :options="BRANDING_THEME_OPTIONS"
            optionLabel="label"
            optionValue="value"
            placeholder="Standard"
            class="modern-input"
          />
        </div>

        <!-- Place of Supply -->
        <div class="form-field">
          <label class="field-label required">Place of Supply</label>
          <FcxDropdown
            name="placeOfSupply"
            v-model="localData.placeOfSupply"
            :options="INDIAN_STATES"
            optionLabel="label"
            optionValue="value"
            placeholder="Select state"
            :error="errors.placeOfSupply"
            required
            :filter="true"
            class="modern-input"
          />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { FcxInputtext, FcxTextarea } from '@/components/formcomponents'
import { FcxCalendar } from '@/components/formcomponents'
import { FcxDropdown } from '@/components/formcomponents'
import { FcxButton } from '@/components/buttoncomponents'
import { INDIAN_STATES } from '../constants/sales-invoice-constants'
import type { CreateInvoiceData, InvoiceFormErrors } from '../types/sales-invoice-types'
import { useSalesInvoices } from '../composables/useSalesInvoices'

const BRANDING_THEME_OPTIONS = [
  { label: 'Standard', value: 'standard' },
  { label: 'Modern', value: 'modern' },
  { label: 'Classic', value: 'classic' }
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
.invoice-header-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      i {
        color: #3b82f6;
        font-size: 1.25rem;
      }
      
      h3 {
        margin: 0;
        color: #1e293b;
        font-size: 1.5rem;
        font-weight: 700;
      }
    }
  }

  .field-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-color: #d1d5db;
    }
  }

  .card-header {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    i {
      color: #6366f1;
      font-size: 1rem;
    }
    
    span {
      font-weight: 600;
      color: #374151;
      font-size: 0.9375rem;
    }
  }

  .field-group {
    padding: 1.5rem;
    
    &.grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      
      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
    
    &.grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem 1rem;

    @media (max-width: 1400px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__field {
    position: relative;
    display: flex;
    flex-direction: column;

    .field-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
      font-size: 0.875rem;
      min-height: 1.25rem;
      
      i {
        color: #6b7280;
        font-size: 0.875rem;
        width: 0.875rem;
        flex-shrink: 0;
      }
    }

    .field-input {
      width: 100%;
      border: 1.5px solid #d1d5db;
      border-radius: 6px;
      transition: all 0.15s ease;
      min-height: 2.5rem;
      
      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      &:hover {
        border-color: #9ca3af;
      }
    }

    .input-with-button {
      position: relative;
      display: flex;
      align-items: center;
      
      .field-input {
        padding-right: 2.5rem;
      }
      
      .generate-btn {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        padding: 0.25rem;
        color: #6b7280;
        z-index: 1;
        
        &:hover {
          color: #3b82f6;
          background: #f3f4f6;
        }
      }
    }
  }
}
</style>
