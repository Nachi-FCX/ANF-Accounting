<template>
  <div class="company-success-state">
    <!-- Success Content -->
    <div class="success-content">
      <!-- Success Icon -->
      <div class="success-icon">
        <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      
      <!-- Success Message -->
      <h3 class="success-title">Company Added Successfully!</h3>
      <p class="success-message">
        {{ companyData.lgnm }} has been successfully added to your account.
      </p>

      <!-- Company Summary -->
      <div class="company-summary">
        <div class="summary-item">
          <span class="summary-label">Company Name:</span>
          <span class="summary-value">{{ companyData.lgnm }}</span>
        </div>
        
        <div class="summary-item">
          <span class="summary-label">GSTIN:</span>
          <span class="summary-value">{{ companyData.gstin }}</span>
        </div>
        
        <div class="summary-item">
          <span class="summary-label">Status:</span>
          <span class="summary-value status-badge" :class="statusClass">
            {{ companyData.sts }}
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="success-actions">
        <FcxButton
          type="button"
          @click="handleClose"
          severity="success"
          variant="filled"
          size="large"
          class="close-button"
        >
          Done
        </FcxButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyData } from '../types/company-types'

// Props
interface Props {
  companyData: CompanyData
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Computed
const statusClass = computed(() => {
  const status = props.companyData.sts?.toLowerCase()
  switch (status) {
    case 'active':
      return 'status-active'
    case 'suspended':
      return 'status-suspended'
    case 'cancelled':
      return 'status-cancelled'
    default:
      return 'status-inactive'
  }
})

// Methods
const handleClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.company-success-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 400px;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #d1fae5;
  border-radius: 50%;
  color: #10b981;
  margin-bottom: 8px;
}

.success-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.success-message {
  margin: 0;
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
  max-width: 320px;
}

.company-summary {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.summary-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  flex-shrink: 0;
}

.summary-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  text-align: right;
  word-break: break-word;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.status-active {
    background: #d1fae5;
    color: #065f46;
  }

  &.status-suspended {
    background: #fef3c7;
    color: #92400e;
  }

  &.status-cancelled {
    background: #fee2e2;
    color: #991b1b;
  }

  &.status-inactive {
    background: #f3f4f6;
    color: #6b7280;
  }
}

.success-actions {
  margin-top: 16px;
}

.close-button {
  min-width: 120px;
  background: #10b981 !important;

  &:hover:not(:disabled) {
    background: #059669 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
}

// Dark theme support
:root[data-theme="dark"] {
  .success-title {
    color: #f9fafb;
  }
  
  .success-message {
    color: #d1d5db;
  }
  
  .success-icon {
    background: #064e3b;
    color: #10b981;
  }

  .company-summary {
    background: #374151;
    border-color: #4b5563;
  }

  .summary-label {
    color: #9ca3af;
  }

  .summary-value {
    color: #f9fafb;
  }

  .status-badge {
    &.status-active {
      background: #064e3b;
      color: #a7f3d0;
    }

    &.status-suspended {
      background: #78350f;
      color: #fcd34d;
    }

    &.status-cancelled {
      background: #7f1d1d;
      color: #fca5a5;
    }

    &.status-inactive {
      background: #374151;
      color: #d1d5db;
    }
  }
}

// Mobile responsive
@media (max-width: 640px) {
  .company-success-state {
    padding: 40px 20px;
  }
  
  .success-title {
    font-size: 20px;
  }
  
  .success-message {
    font-size: 14px;
  }
  
  .success-icon {
    width: 64px;
    height: 64px;
    
    svg {
      width: 48px;
      height: 48px;
    }
  }

  .company-summary {
    padding: 16px;
  }

  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .summary-value {
    text-align: left;
  }
}
</style>
