<template>
  <div class="invoice-document-list mt-3">
    <div v-if="!hideHeader" class="list-header">
      <h3>{{ $t('invoice.documents.title') }}</h3>
      <FcxButton
        icon="pi pi-upload"
        @click="handleUpload"
        severity="primary"
        size="small"
        label="Upload"
      />
    </div>

    <div v-if="documents.length === 0" class="empty-state">
      <i class="pi pi-file empty-icon"></i>
      <p>{{ $t('invoice.documents.empty') }}</p>
      <FcxButton
        icon="pi pi-upload"
        @click="handleUpload"
        label="Upload Documents"
      />
    </div>

    <div v-else class="document-table">
      <FcxDataTable
        :value="documents"
        :columns="columns"
        :selection="currentDocument"
        @row-select="onRowSelect"
        selectionMode="single"
        :paginator="false"
        :rows="10"
        dataKey="id"
        :stripedRows="true"
        :showActionsColumn="true"
        :showHeader="false"
      >
        <!-- Document Name Column -->
        <template #body-name="slotProps">
          <div class="document-name-cell">
            <i class="pi pi-file-pdf" style="color: var(--red-500); margin-right: 0.5rem;"></i>
            <span :title="slotProps.data.name">{{ slotProps.data.name }}</span>
          </div>
        </template>

        <!-- Status Column -->
        <template #body-status="slotProps">
          <div class="status-cell">
            <span :class="['status-badge', slotProps.data.status]">
              <i :class="getStatusIcon(slotProps.data.status)"></i>
              {{ getStatusText(slotProps.data.status) }}
            </span>
          </div>
        </template>

        <!-- Pages Column -->
        <template #body-pages="slotProps">
          {{ slotProps.data.pages }} page(s)
        </template>

        <!-- Uploaded Column -->
        <template #body-uploadedAt="slotProps">
          {{ formatDate(slotProps.data.uploadedAt) }}
        </template>

        <!-- Actions Column -->
        <template #body-actions="slotProps">
          <div class="action-buttons">
            <FcxButton
              icon="pi pi-eye"
              @click.stop="handleDocumentClick(slotProps.data)"
              severity="info"
              text
              size="small"
              title="View"
            />
            <FcxButton
              icon="pi pi-trash"
              @click.stop="handleDelete(slotProps.data.id)"
              severity="danger"
              text
              size="small"
              title="Delete"
            />
          </div>
        </template>
      </FcxDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FcxButton } from '@/components/buttoncomponents'
import { FcxDataTable } from '@/components/datacomponents'
import type { PdfDocument } from '../types/invoice-pdf.types'
import type { DataTableColumn } from '@/components/datacomponents/types/datatable-types'

// Props
const props = defineProps<{
  documents: PdfDocument[]
  currentDocument: PdfDocument | null
  hideHeader?: boolean
}>()

// Emits
const emit = defineEmits<{
  documentSelect: [document: PdfDocument]
  documentDelete: [documentId: string]
  documentUpload: []
}>()

// Table columns configuration
const columns = computed<DataTableColumn[]>(() => [
  {
    field: 'name',
    header: 'Document Name',
    sortable: true,
    filterable: true,
    minWidth: '200px'
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true,
    width: '120px'
  },
  {
    field: 'pages',
    header: 'Pages',
    sortable: true,
    width: '100px'
  },
  {
    field: 'uploadedAt',
    header: 'Uploaded',
    sortable: true,
    width: '180px'
  }
])

// Methods
const handleDocumentClick = (document: PdfDocument) => {
  emit('documentSelect', document)
}

const onRowSelect = (event: any) => {
  emit('documentSelect', event.data)
}

const handleDelete = (documentId: string) => {
  emit('documentDelete', documentId)
}

const handleUpload = () => {
  emit('documentUpload')
}

const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    pending: 'pi pi-clock',
    processing: 'pi pi-spin pi-spinner',
    completed: 'pi pi-check-circle',
    error: 'pi pi-times-circle'
  }
  return icons[status] || 'pi pi-file'
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    error: 'Error'
  }
  return texts[status] || status
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped lang="scss">
.invoice-document-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--surface-card);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--surface-border);

  h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 1.5rem;
  color: var(--text-color-secondary);

  .empty-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    opacity: 0.5;
  }

  p {
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
  }
}

.document-table {
  flex: 1;
  overflow: hidden;
  
  :deep(.fcx-datatable) {
    height: 100%;
  }
}

.document-name-cell {
  display: flex;
  align-items: center;
  font-weight: 500;
  
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.status-cell {
  display: flex;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;

  &.pending {
    background: var(--orange-50);
    color: var(--orange-700);
    
    i {
      color: var(--orange-500);
    }
  }

  &.processing {
    background: var(--blue-50);
    color: var(--blue-700);
    
    i {
      color: var(--blue-500);
    }
  }

  &.completed {
    background: var(--green-50);
    color: var(--green-700);
    
    i {
      color: var(--green-500);
    }
  }

  &.error {
    background: var(--red-50);
    color: var(--red-700);
    
    i {
      color: var(--red-500);
    }
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>
