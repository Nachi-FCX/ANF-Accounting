<template>
  <div class="sales-invoice-create-view">
    <div class="sales-invoice-create-view__header">
      <div class="sales-invoice-create-view__header-content">
        <FcxButton
          icon="pi pi-arrow-left"
          severity="secondary"
          text
          @click="handleCancel"
          class="header-back-btn"
        />
        <div class="header-text">
          <h2>Create Sales Invoice</h2>
        </div>
        <div class="header-actions">
          <span class="status-badge draft">Draft</span>
        </div>
      </div>
    </div>
    
    <div class="sales-invoice-create-view__content">
      <!-- Invoice Header Section -->
      <InvoiceHeaderSection
        v-model="formData"
        :errors="errors"
      />

      <!-- Line Items Section -->
      <InvoiceLineItemsSection
        v-model="formData.lineItems"
        :errors="lineItemErrors"
      />

      <!-- Totals Section -->
      <InvoiceTotalsSection
        :totals="totals"
        :isInterState="isInterState"
      />
      
      <!-- Actions -->
      <div class="sales-invoice-create-view__actions">
        <div class="actions-left">
          <FcxButton 
            label="Cancel" 
            severity="secondary"
            text
            @click="handleCancel"
          />
        </div>
        <div class="actions-right">
          <FcxButton 
            label="Save as Draft" 
            severity="secondary"
            icon="pi pi-save"
            :loading="isSavingDraft"
            @click="handleSaveDraft"
          />
          <FcxButton 
            label="Create Invoice" 
            severity="primary"
            icon="pi pi-check"
            :loading="isCreating"
            @click="handleCreate"
            class="primary-action"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FcxButton } from '@/components/buttoncomponents'
import InvoiceHeaderSection from '../components/InvoiceHeaderSection.vue'
import InvoiceLineItemsSection from '../components/InvoiceLineItemsSection.vue'
import InvoiceTotalsSection from '../components/InvoiceTotalsSection.vue'
import { useSalesInvoices } from '../composables/useSalesInvoices'
import { useInvoiceCalculations } from '../composables/useInvoiceCalculations'
import { useInvoiceValidation } from '../composables/useInvoiceValidation'
import type { CreateInvoiceData, InvoiceLineItem } from '../types/sales-invoice-types'
import { DEFAULT_LINE_ITEM, DEFAULT_PAYMENT_TERMS } from '../constants/sales-invoice-constants'
import { SUCCESS_MESSAGES } from '../constants/sales-invoice-constants'

const router = useRouter()
const { createInvoice } = useSalesInvoices()
const { validateForm, errors, lineItemErrors } = useInvoiceValidation()

const isCreating = ref(false)
const isSavingDraft = ref(false)

// Form data
const formData = ref<Partial<CreateInvoiceData> & { lineItems: InvoiceLineItem[] }>({
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  reference: '',
  brandingTheme: 'standard',
  customerId: 0,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerGSTIN: '',
  customerAddress: '',
  paymentTerms: DEFAULT_PAYMENT_TERMS,
  placeOfSupply: '',
  lineItems: [{ ...DEFAULT_LINE_ITEM }],
  notes: ''
})

// Calculate totals
const placeOfSupplyRef = ref(formData.value.placeOfSupply || '')
const lineItemsRef = computed(() => formData.value.lineItems)

// Update placeOfSupply ref when formData changes
watch(() => formData.value.placeOfSupply, (newVal) => {
  placeOfSupplyRef.value = newVal || ''
})

const {
  totals,
  isInterState
} = useInvoiceCalculations(lineItemsRef, placeOfSupplyRef, 'Maharashtra')

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
    router.push({ name: 'sales-invoice-list' })
  }
}

const handleSaveDraft = async () => {
  try {
    isSavingDraft.value = true
    
    const invoiceData: CreateInvoiceData = {
      invoiceDate: formData.value.invoiceDate!,
      dueDate: formData.value.dueDate!,
      customerId: formData.value.customerId || 0,
      customerName: formData.value.customerName!,
      customerEmail: formData.value.customerEmail,
      customerPhone: formData.value.customerPhone,
      customerGSTIN: formData.value.customerGSTIN,
      customerAddress: formData.value.customerAddress,
      paymentTerms: formData.value.paymentTerms!,
      placeOfSupply: formData.value.placeOfSupply!,
      lineItems: formData.value.lineItems,
      notes: formData.value.notes
    }
    
    await createInvoice(invoiceData)
    
    alert('Invoice saved as draft successfully!')
    router.push({ name: 'sales-invoice-list' })
  } catch (error: any) {
    alert(`Failed to save draft: ${error.message}`)
  } finally {
    isSavingDraft.value = false
  }
}

const handleCreate = async () => {
  try {
    isCreating.value = true
    
    // Validate form
    const invoiceData: CreateInvoiceData = {
      invoiceDate: formData.value.invoiceDate!,
      dueDate: formData.value.dueDate!,
      customerId: formData.value.customerId || 0,
      customerName: formData.value.customerName!,
      customerEmail: formData.value.customerEmail,
      customerPhone: formData.value.customerPhone,
      customerGSTIN: formData.value.customerGSTIN,
      customerAddress: formData.value.customerAddress,
      paymentTerms: formData.value.paymentTerms!,
      placeOfSupply: formData.value.placeOfSupply!,
      lineItems: formData.value.lineItems,
      notes: formData.value.notes
    }
    
    const isValid = validateForm(invoiceData)
    
    if (!isValid) {
      alert('Please fix the validation errors before creating the invoice.')
      return
    }
    
    await createInvoice(invoiceData)
    
    alert(SUCCESS_MESSAGES.CREATE_SUCCESS)
    router.push({ name: 'sales-invoice-list' })
  } catch (error: any) {
    alert(`Failed to create invoice: ${error.message}`)
  } finally {
    isCreating.value = false
  }
}
</script>

<style scoped lang="scss">
.sales-invoice-create-view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;

  &__header {
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .header-back-btn {
        margin-right: 1rem;
      }

      .header-text {
        flex: 1;
        
        h2 {
          margin: 0;
          color: #1e293b;
          font-size: 1.5rem;
          font-weight: 700;
        }
      }

      .header-actions {
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          
          &.draft {
            background: #fef3c7;
            color: #92400e;
          }
        }
      }
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 100%;
    margin: 0 auto;
    width: 100%;
  }



  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-top: 1px solid #e2e8f0;
    background: white;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
    margin-top: 0.75rem;
    
    .actions-left, .actions-right {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    
    .primary-action {
      background: #3b82f6;
      border: none;
      transition: all 0.15s ease;
      
      &:hover {
        background: #2563eb;
        transform: translateY(-1px);
      }
    }
  }
}
</style>
