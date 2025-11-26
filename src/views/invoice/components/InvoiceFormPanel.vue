<template>
  <div class="invoice-form-panel">
    <div class="form-content">
      <TabView>
        <!-- Invoice Details Tab -->
        <TabPanel header="Invoice Details" value="0">
          <div class="form-section">
            <h3>Basic Information</h3>
            <div class="form-grid">
              <FcxInputtext
                v-model="localInvoiceData.invoiceNumber"
                name="invoiceNumber"
                label="Invoice Number"
                placeholder="Enter invoice number"
                required
                :draggable="true"
                @drop="handleFieldDrop($event, 'invoiceNumber')"
                @dragover.prevent
              />

              <FcxCalendar
                v-model="localInvoiceData.invoiceDate"
                name="invoiceDate"
                label="Invoice Date"
                placeholder="Select date"
                required
                showIcon
              />

              <FcxCalendar
                v-model="localInvoiceData.dueDate"
                name="dueDate"
                label="Due Date"
                placeholder="Select date"
                showIcon
              />

              <FcxInputtext
                v-model="localInvoiceData.poNumber"
                name="poNumber"
                label="PO Number"
                placeholder="Enter PO number"
              />
            </div>
          </div>

          <Divider />

          <div class="form-section">
            <h3>Vendor Information</h3>
            <div class="form-grid">
              <FcxInputtext
                v-model="localInvoiceData.vendorName"
                name="vendorName"
                label="Vendor Name"
                placeholder="Enter vendor name"
                required
                class="full-width"
                @drop="handleFieldDrop($event, 'vendorName')"
                @dragover.prevent
              />

              <FcxInputtext
                v-model="localInvoiceData.vendorGSTIN"
                name="vendorGSTIN"
                label="Vendor GSTIN"
                placeholder="Enter GSTIN"
                required
                @drop="handleFieldDrop($event, 'vendorGSTIN')"
                @dragover.prevent
              />

              <FcxInputtext
                v-model="localInvoiceData.vendorPAN"
                name="vendorPAN"
                label="Vendor PAN"
                placeholder="Enter PAN"
              />

              <FcxTextarea
                v-model="localInvoiceData.vendorAddress"
                name="vendorAddress"
                label="Vendor Address"
                placeholder="Enter address"
                :rows="2"
                class="full-width"
              />
            </div>
          </div>

          <Divider />

          <div class="form-section">
            <h3>Buyer Information</h3>
            <div class="form-grid">
              <FcxInputtext
                v-model="localInvoiceData.buyerName"
                name="buyerName"
                label="Buyer Name"
                placeholder="Enter buyer name"
                class="full-width"
              />

              <FcxInputtext
                v-model="localInvoiceData.buyerGSTIN"
                name="buyerGSTIN"
                label="Buyer GSTIN"
                placeholder="Enter GSTIN"
              />

              <FcxTextarea
                v-model="localInvoiceData.buyerAddress"
                name="buyerAddress"
                label="Buyer Address"
                placeholder="Enter address"
                :rows="2"
                class="full-width"
              />
            </div>
          </div>
        </TabPanel>

        <!-- Line Items Tab -->
        <TabPanel header="Line Items" value="1">
          <div class="form-section">
            <InvoiceLineItemsTable
              v-model:lineItems="localLineItems"
              :readonly="false"
            />
          </div>
        </TabPanel>

        <!-- Summary Tab -->
        <TabPanel header="Summary" value="2">
          <div class="form-section">
            <h3>Financial Summary</h3>
            <div class="summary-grid">
              <div class="summary-row">
                <label>Subtotal:</label>
                <span class="value">{{ formatAmount(localInvoiceData.subtotal || 0) }}</span>
              </div>
              
              <!-- Indian GST -->
              <!-- <template v-if="localInvoiceData.totalCGST || localInvoiceData.totalSGST || localInvoiceData.totalIGST">
                <div class="summary-row" v-if="localInvoiceData.totalCGST">
                  <label>CGST:</label>
                  <span class="value">{{ formatAmount(localInvoiceData.totalCGST || 0) }}</span>
                </div>
                
                <div class="summary-row" v-if="localInvoiceData.totalSGST">
                  <label>SGST:</label>
                  <span class="value">{{ formatAmount(localInvoiceData.totalSGST || 0) }}</span>
                </div>
                
                <div class="summary-row" v-if="localInvoiceData.totalIGST">
                  <label>IGST:</label>
                  <span class="value">{{ formatAmount(localInvoiceData.totalIGST || 0) }}</span>
                </div>
              </template> -->
              
              <!-- VAT (for UAE, etc.) -->
              <div class="summary-row" v-if="localInvoiceData.currency === 'AED' || !localInvoiceData.totalCGST">
                <label>VAT:</label>
                <span class="value">{{ formatAmount(localInvoiceData.totalVAT || 0) }}</span>
              </div>
              
              <div class="summary-row" v-if="localInvoiceData.totalCess">
                <label>Cess:</label>
                <span class="value">{{ formatAmount(localInvoiceData.totalCess || 0) }}</span>
              </div>
              
              <div class="summary-row" v-if="localInvoiceData.totalDiscount">
                <label>Discount:</label>
                <span class="value">{{ formatAmount(localInvoiceData.totalDiscount || 0) }}</span>
              </div>
              
              <Divider />
              
              <div class="summary-row total">
                <label>Total Amount:</label>
                <span class="value">{{ formatAmount(localInvoiceData.totalAmount || 0) }}</span>
              </div>
            </div>

            

            <FcxTextarea
              v-model="localInvoiceData.notes"
              name="notes"
              label="Notes"
              placeholder="Enter any notes"
              :rows="3"
              class="full-width"
              style="margin-top: 1rem;"
            />
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Divider from 'primevue/divider'
import { FcxInputtext, FcxCalendar, FcxTextarea } from '@/components/formcomponents'
import InvoiceLineItemsTable from './InvoiceLineItemsTable.vue'
import type { InvoiceData } from '../types/invoice-ocr.types'
import type { InvoiceLineItem } from '../types/invoice-table.types'

// Props
const props = defineProps<{
  invoiceData: InvoiceData
  lineItems: InvoiceLineItem[]
  isLoading?: boolean
}>()

// Emits
const emit = defineEmits<{
  'update:invoiceData': [value: InvoiceData]
  'update:lineItems': [value: InvoiceLineItem[]]
}>()

// Local state
const localInvoiceData = ref<InvoiceData>({ ...props.invoiceData })
const localLineItems = ref<InvoiceLineItem[]>([...props.lineItems])
const amountInWords = ref<string>('')

// Watch for external changes - only update if actually different
watch(() => props.invoiceData, (newValue) => {
  // Don't update if it's the same object reference (prevents loop)
  if (JSON.stringify(newValue) !== JSON.stringify(localInvoiceData.value)) {
    console.log('InvoiceFormPanel: invoiceData prop changed:', newValue)
    localInvoiceData.value = { ...newValue }
  }
}, { immediate: true })

watch(() => props.lineItems, (newValue) => {
  // Don't update if it's the same content (prevents loop)
  if (JSON.stringify(newValue) !== JSON.stringify(localLineItems.value)) {
    console.log('InvoiceFormPanel: lineItems prop changed:', newValue?.length, 'items')
    localLineItems.value = [...newValue]
  }
}, { immediate: true })

// Watch for local changes and emit - with debounce to prevent rapid updates
let invoiceDataTimeout: ReturnType<typeof setTimeout> | null = null
watch(localInvoiceData, (newValue) => {
  if (invoiceDataTimeout) clearTimeout(invoiceDataTimeout)
  invoiceDataTimeout = setTimeout(() => {
    console.log('Emitting invoiceData update to parent')
    emit('update:invoiceData', newValue)
  }, 50)
}, { deep: true })

let lineItemsTimeout: ReturnType<typeof setTimeout> | null = null
watch(localLineItems, (newValue) => {
  if (lineItemsTimeout) clearTimeout(lineItemsTimeout)
  lineItemsTimeout = setTimeout(() => {
    console.log('Emitting lineItems update to parent')
    emit('update:lineItems', newValue)
  }, 50)
}, { deep: true })

// Methods
const handleFieldDrop = (event: DragEvent, fieldName: string) => {
  event.preventDefault()
  const text = event.dataTransfer?.getData('text/plain')
  if (text) {
    (localInvoiceData.value as any)[fieldName] = text
  }
}

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>

<style scoped lang="scss">
.invoice-form-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--surface-card);
}

.form-content {
  flex: 1;
  overflow: auto;
  padding: 0;

  :deep(.p-tabview) {
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .p-tabview-nav-container {
      background: var(--surface-card);
      padding: 1rem 1.5rem 0;
      min-height: 60px;
    }
    
    .p-tabview-nav {
      background: transparent;
      border: none;
      border-bottom: 2px solid var(--surface-border);
      gap: 1rem;
      padding: 0;
      min-height: 50px;
      align-items: center;
    }
    
    .p-tabview-nav-content {
      gap: 1rem;
      min-height: 50px;
      align-items: center;
    }
    
    .p-tabview-header {
      margin: 0;
      min-height: 50px;
      display: flex;
      align-items: center;
      
      .p-tabview-nav-link {
        padding: 1.25rem 2rem;
        min-height: 50px;
        background: transparent;
        border: none;
        border-bottom: 3px solid transparent;
        border-radius: 0;
        color: var(--text-color-secondary);
        font-weight: 500;
        font-size: 1rem;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        
        &:hover {
          background: var(--surface-hover);
          color: var(--text-color);
        }
        
        &:focus {
          box-shadow: none;
        }
      }
      
      &.p-highlight .p-tabview-nav-link {
        background: transparent;
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }
    }
    
    .p-tabview-tab-title {
      padding: 0.5rem 1rem !important;
    }

    .p-tabview-panels {
      flex: 1;
      padding: 1.5rem 1rem;
      background: transparent;
      overflow: auto;
    }
    
    .p-tabview-panel {
      background: transparent;
    }
  }
}

.form-section {
  margin-bottom: 1rem;

  h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color);
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
}

// Full-width modifier for form components
:deep(.full-width) {
  grid-column: 1 / -1;
}

.summary-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--surface-ground);
  border-radius: var(--border-radius);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9375rem;

  label {
    color: var(--text-color-secondary);
    font-weight: 500;
  }

  .value {
    color: var(--text-color);
    font-weight: 600;
  }

  &.total {
    font-size: 1.125rem;
    padding-top: 0.5rem;

    label,
    .value {
      color: var(--primary-color);
      font-weight: 700;
    }
  }
}

:deep(.p-divider) {
  margin: 1.5rem 0;
}
</style>
