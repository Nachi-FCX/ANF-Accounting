<template>
  <div class="sales-invoice-edit-view">
    <div v-if="isLoading" class="sales-invoice-edit-view__loading">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Loading invoice...</p>
    </div>
    
    <div v-else-if="error" class="sales-invoice-edit-view__error">
      <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)"></i>
      <p>{{ error }}</p>
      <FcxButton label="Go Back" @click="handleBack" />
    </div>
    
    <div v-else class="sales-invoice-edit-view__content">
      <div class="sales-invoice-edit-view__header">
        <div>
          <h2>Edit Invoice: {{ currentInvoice?.invoiceNumber }}</h2>
          <p>Update invoice details below</p>
        </div>
        <Tag 
          v-if="currentInvoice"
          :value="formatStatus(currentInvoice.status)" 
          :severity="getStatusSeverity(currentInvoice.status)"
        />
      </div>
      
      <div class="sales-invoice-edit-view__form">
        <p class="sales-invoice-edit-view__placeholder">
          Invoice edit form will be implemented here with all form sections.
        </p>
        
        <div class="sales-invoice-edit-view__actions">
          <FcxButton 
            label="Cancel" 
            severity="secondary" 
            @click="handleBack"
          />
          <FcxButton 
            label="Save Changes" 
            severity="primary"
            icon="pi pi-check"
            @click="handleSave"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FcxButton } from '@/components/buttoncomponents'
import Tag from 'primevue/tag'
import { useSalesInvoices } from '../composables/useSalesInvoices'
import { formatStatus, getStatusSeverity } from '../utils/invoice-formatters'

const router = useRouter()
const route = useRoute()

const {
  currentInvoice,
  isLoading,
  error,
  fetchInvoiceById
} = useSalesInvoices()

const handleBack = () => {
  router.push({ name: 'sales-invoice-list' })
}

const handleSave = () => {
  console.log('Save changes')
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) {
    await fetchInvoiceById(id)
  }
})
</script>

<style scoped lang="scss">
.sales-invoice-edit-view {
  width: 100%;
  height: 100%;
  padding: 1.5rem;

  &__loading,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 2rem;
    text-align: center;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    h2 {
      margin: 0 0 0.5rem 0;
      color: var(--text-color);
    }

    p {
      margin: 0;
      color: var(--text-color-secondary);
    }
  }

  &__form {
    background: var(--surface-card);
    border-radius: 8px;
    padding: 2rem;
  }

  &__placeholder {
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-color-secondary);
    background: var(--surface-ground);
    border-radius: 4px;
    margin-bottom: 2rem;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-top: 2rem;
    border-top: 1px solid var(--surface-border);
  }
}
</style>
