<template>
  <div class="invoice-ocr-view">
    <div class="invoice-ocr-header">
      <h1>{{ $t('invoice.ocr.title') }}</h1>
      <div class="header-actions">
        <FcxButton
          :label="$t('invoice.ocr.uploadDocument')"
          icon="pi pi-upload"
          @click="handleUploadClick"
          severity="primary"
        />
        <FcxButton
          v-if="currentDocument"
          :label="$t('invoice.ocr.processOcr')"
          icon="pi pi-bolt"
          @click="handleProcessOcr"
          :loading="isProcessing"
          severity="success"
        />
        <FcxButton
          icon="pi pi-refresh"
          @click="handleReset"
          severity="secondary"
          text
          label="Reset"
        />
        <FcxButton
          icon="pi pi-save"
          @click="handleSave"
          severity="primary"
          label="Save"
          :loading="isProcessing"
        />
      </div>
    </div>

    <!-- Main Split Layout -->
    <div class="invoice-ocr-content">
      <!-- Top Split: PDF Viewer and Form -->
      <Splitter class="top-splitter" layout="horizontal">
        <!-- Left Panel: PDF Viewer -->
        <SplitterPanel :size="50" :minSize="40" class="pdf-panel">
          <InvoicePdfViewer
            v-if="currentDocument"
            :document="currentDocument"
            :ocrResults="ocrResults"
            @text-selected="handleTextSelected"
            @field-mapped="handleFieldMapped"
          />
          <div v-else class="empty-state">
            <i class="pi pi-file-pdf empty-icon"></i>
            <p>{{ $t('invoice.ocr.noPdfSelected') }}</p>
            <FcxButton
              :label="$t('invoice.ocr.uploadFirst')"
              icon="pi pi-upload"
              @click="handleUploadClick"
            />
          </div>
        </SplitterPanel>

        <!-- Right Panel: Form -->
        <SplitterPanel :size="50" :minSize="40" class="form-panel">
          <InvoiceFormPanel
            v-model:invoiceData="invoiceData"
            v-model:lineItems="lineItems"
            :isLoading="isProcessing"
          />
        </SplitterPanel>
      </Splitter>

      <!-- Bottom Panel: Document List -->
      <div class="document-list-panel">
        <InvoiceDocumentList
          :documents="documents"
          :currentDocument="currentDocument"
          @document-select="handleDocumentSelect"
          @document-delete="handleDocumentDelete"
          @document-upload="handleUploadClick"
          :hideHeader="true"
        />
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept=".pdf,.png,.jpg,.jpeg,.tiff"
      multiple
      style="display: none"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { FcxButton } from '@/components/buttoncomponents'
import InvoicePdfViewer from './components/InvoicePdfViewer.vue'
import InvoiceFormPanel from './components/InvoiceFormPanel.vue'
import InvoiceDocumentList from './components/InvoiceDocumentList.vue'
import { invoiceOcrService } from '@/services/invoice/invoiceOcrService'
import type { InvoiceData } from './types/invoice-ocr.types'
import type { InvoiceLineItem } from './types/invoice-table.types'
import type { PdfDocument } from './types/invoice-pdf.types'

// Composables
const toast = useToast()

// Refs
const fileInput = ref<HTMLInputElement>()
const isProcessing = ref(false)
const documents = ref<PdfDocument[]>([])
const currentDocument = ref<PdfDocument | null>(null)
const ocrResults = ref<any>(null)
const invoiceData = ref<InvoiceData>({
  invoiceNumber: '',
  invoiceDate: new Date(),
  dueDate: undefined,
  poNumber: '',
  vendorName: '',
  vendorGSTIN: '',
  vendorAddress: '',
  vendorPAN: '',
  vendorState: '',
  vendorCity: '',
  vendorPincode: '',
  buyerName: '',
  buyerGSTIN: '',
  buyerAddress: '',
  buyerState: '',
  buyerCity: '',
  buyerPincode: '',
  lineItems: [],
  subtotal: 0,
  totalCGST: 0,
  totalSGST: 0,
  totalIGST: 0,
  totalCess: 0,
  totalDiscount: 0,
  roundOff: 0,
  totalAmount: 0,
  currency: 'INR',
  paymentTerms: '',
  notes: '',
  bankDetails: '',
  isInterState: false,
  reverseCharge: false,
  placeOfSupply: ''
})
const lineItems = ref<InvoiceLineItem[]>([])

// Methods
const handleUploadClick = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return

  // Add files to documents list
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const document: PdfDocument = {
      id: `doc-${Date.now()}-${i}`,
      name: file.name,
      file: file,
      url: URL.createObjectURL(file),
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      pages: 1,
      currentPage: 1
    }
    documents.value.push(document)
  }

  // Select first document if none selected
  if (!currentDocument.value && documents.value.length > 0) {
    currentDocument.value = documents.value[0]
  }

  // Reset file input
  target.value = ''

  toast.add({
    severity: 'success',
    summary: 'Files Uploaded',
    detail: `${files.length} file(s) added successfully`,
    life: 3000
  })
}

const handleProcessOcr = async () => {
  if (!currentDocument.value) return

  isProcessing.value = true
  currentDocument.value.status = 'processing'

  try {
    const result = await invoiceOcrService.extractInvoice(currentDocument.value.file)
    
    ocrResults.value = result
    currentDocument.value.status = 'completed'
    currentDocument.value.ocrData = result

    // Force reactivity by using nextTick and direct assignment
    await nextTick()
    
    console.log('OCR Result received:', result)
    
    // Populate form with extracted data (backend now returns camelCase)
    if (result) {
      // Create a new object to trigger reactivity
      invoiceData.value = {
        invoiceNumber: result.invoiceNumber || '',
        invoiceDate: result.invoiceDate || '',
        dueDate: result.dueDate || '',
        poNumber: result.poNumber || '',
        vendorName: result.vendorName || '',
        vendorGSTIN: result.vendorGSTIN || '',
        vendorAddress: result.vendorAddress || '',
        vendorPAN: result.vendorPAN || '',
        vendorState: result.vendorState || '',
        buyerName: result.buyerName || '',
        buyerGSTIN: result.buyerGSTIN || '',
        buyerAddress: result.buyerAddress || '',
        buyerState: result.buyerState || '',
        subtotal: result.subtotal || 0,
        totalCGST: result.totalCGST || 0,
        totalSGST: result.totalSGST || 0,
        totalIGST: result.totalIGST || 0,
        totalCess: result.totalCess || 0,
        totalDiscount: result.totalDiscount || 0,
        totalAmount: result.totalAmount || 0,
        currency: result.currency || 'INR',
        paymentTerms: result.paymentTerms || '',
        notes: result.notes || '',
        lineItems: []
      }
      
      console.log('Invoice data set:', invoiceData.value)
    }

    // Populate line items - create new array reference
    if (result.lineItems && result.lineItems.length > 0) {
      lineItems.value = [...result.lineItems]
      console.log('Line items set:', lineItems.value.length, 'items')
    }

    await nextTick()

    // toast.add({
    //   severity: 'success',
    //   summary: 'OCR Complete',
    //   detail: 'Invoice data extracted successfully',
    //   life: 3000
    // })
  } catch (error: any) {
    currentDocument.value.status = 'error'
    currentDocument.value.error = error.message || 'OCR processing failed'
    
    // toast.add({
    //   severity: 'error',
    //   summary: 'OCR Failed',
    //   detail: error.message || 'Failed to process document',
    //   life: 5000
    // })
  } finally {
    isProcessing.value = false
  }
}

const handleTextSelected = (text: string) => {
  console.log('Text selected:', text)
  // This will be used for drag-to-map functionality
}

const handleFieldMapped = (data: { field: string; value: string }) => {
  console.log('Field mapped:', data)
  // Update invoice data with mapped field
  if (data.field in invoiceData.value) {
    (invoiceData.value as any)[data.field] = data.value
  }
}

const handleDocumentSelect = async (document: PdfDocument) => {
  currentDocument.value = document
  
  // Load OCR data if already processed
  if (document.ocrData) {
    const result = document.ocrData as any
    ocrResults.value = result
    
    // Force reactivity with nextTick and new object creation
    await nextTick()
    
    if (result.invoiceNumber) {
      // Create a new object to trigger reactivity
      invoiceData.value = {
        invoiceNumber: result.invoiceNumber || '',
        invoiceDate: result.invoiceDate || '',
        dueDate: result.dueDate || '',
        poNumber: result.poNumber || '',
        vendorName: result.vendorName || '',
        vendorGSTIN: result.vendorGSTIN || '',
        vendorAddress: result.vendorAddress || '',
        vendorPAN: result.vendorPAN || '',
        vendorState: result.vendorState || '',
        buyerName: result.buyerName || '',
        buyerGSTIN: result.buyerGSTIN || '',
        buyerAddress: result.buyerAddress || '',
        buyerState: result.buyerState || '',
        subtotal: result.subtotal || 0,
        totalCGST: result.totalCGST || 0,
        totalSGST: result.totalSGST || 0,
        totalIGST: result.totalIGST || 0,
        totalCess: result.totalCess || 0,
        totalDiscount: result.totalDiscount || 0,
        totalAmount: result.totalAmount || 0,
        currency: result.currency || 'INR',
        paymentTerms: result.paymentTerms || '',
        notes: result.notes || '',
        lineItems: []
      }
    }
    
    if (result.lineItems && result.lineItems.length > 0) {
      lineItems.value = [...result.lineItems]
    }
    
    await nextTick()
  }
}

const handleDocumentDelete = (documentId: string) => {
  const index = documents.value.findIndex((d: PdfDocument) => d.id === documentId)
  if (index !== -1) {
    const document = documents.value[index]
    
    // Revoke object URL to free memory
    if (document.url) {
      URL.revokeObjectURL(document.url)
    }
    
    documents.value.splice(index, 1)
    
    // Select another document if current was deleted
    if (currentDocument.value?.id === documentId) {
      currentDocument.value = documents.value.length > 0 ? documents.value[0] : null
      ocrResults.value = null
      handleReset()
    }
    
    toast.add({
      severity: 'info',
      summary: 'Document Deleted',
      detail: 'Document removed successfully',
      life: 3000
    })
  }
}

const handleSave = async () => {
  try {
    console.log('Saving invoice data:', {
      invoiceData: invoiceData.value,
      lineItems: lineItems.value
    })
    
    // TODO: Implement save to backend
    
    toast.add({
      severity: 'success',
      summary: 'Invoice Saved',
      detail: 'Invoice data saved successfully',
      life: 3000
    })
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: error.message || 'Failed to save invoice',
      life: 5000
    })
  }
}

const handleReset = () => {
  invoiceData.value = {
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    poNumber: '',
    vendorName: '',
    vendorGSTIN: '',
    vendorAddress: '',
    vendorPAN: '',
    buyerName: '',
    buyerGSTIN: '',
    buyerAddress: '',
    subtotal: 0,
    totalCGST: 0,
    totalSGST: 0,
    totalIGST: 0,
    totalCess: 0,
    totalDiscount: 0,
    totalAmount: 0,
    notes: '',
    lineItems: []
  }
  lineItems.value = []
  ocrResults.value = null
}
</script>

<style scoped lang="scss">
.invoice-ocr-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 2px;
  min-height: calc(100vh - 60px);
  background: var(--surface-ground);
}

.invoice-ocr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);

  h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.invoice-ocr-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-splitter {
  flex: 1;
  overflow: hidden;
  margin-bottom: 10px;
  :deep(.p-splitter) {
    border: none;
    height: 100%;
  }

  :deep(.p-splitter-gutter) {
    background: var(--surface-border);
    cursor: col-resize;
    transition: background-color 0.2s;
    
    &:hover {
      background: var(--primary-color);
    }
  }

  :deep(.p-splitter-gutter-handle) {
    background: var(--surface-border);
  }
}

.pdf-panel,
.form-panel {
  background: var(--surface-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  :deep(.p-splitter-panel-nested) {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  > * {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1.5rem;
  color: var(--text-color-secondary);

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 0.75rem;
    opacity: 0.5;
  }

  p {
    margin-bottom: 1rem;
    font-size: 1rem;
  }
}

.document-list-panel {
  height: 180px;
  border-top: 1px solid var(--surface-border);
  background: var(--surface-card);
  overflow: auto;
}

:deep(.p-splitter-panel) {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  
  > * {
    flex: 1;
    overflow: auto;
    min-height: 0;
  }
}
</style>
