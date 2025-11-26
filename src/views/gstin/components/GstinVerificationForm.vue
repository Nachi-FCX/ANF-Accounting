<template>
  <div class="gstin-verification-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2 class="form-title">Add GSTIN</h2>
      <button
        class="close-button"
        @click="$emit('cancel')"
        aria-label="Close dialog"
        type="button"
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Verification Content -->
    <div class="verification-content">
      <!-- Info Banner -->
      <div class="info-banner">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" class="info-icon">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="info-text">Please verify the details below</span>
      </div>

      <!-- GSTIN Details -->
      <div class="gstin-details">
        <div class="detail-row">
          <span class="detail-label">Name:</span>
          <span class="detail-value">{{ gstinData.lgnm }}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">GSTIN:</span>
          <span class="detail-value">{{ gstinData.gstin }}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">State Code:</span>
          <span class="detail-value">{{ extractedStateCode }}</span>
        </div>

        <!-- Additional Details (Optional) -->
        <div v-if="gstinData.tradeNam && gstinData.tradeNam !== gstinData.lgnm" class="detail-row">
          <span class="detail-label">Trade Name:</span>
          <span class="detail-value">{{ gstinData.tradeNam }}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="detail-value status-badge" :class="statusClass">
            {{ gstinData.sts }}
          </span>
        </div>

        <div v-if="gstinData.pradr?.addr" class="detail-row">
          <span class="detail-label">Address:</span>
          <span class="detail-value address-text">{{ formattedAddress }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <FcxButton
          type="button"
          @click="$emit('back')"
          severity="secondary"
          variant="outlined"
          size="large"
          class="back-button"
          :disabled="isLoading"
        >
          Back
        </FcxButton>
        
        <FcxButton
          type="button"
          @click="handleConfirm"
          severity="success"
          variant="filled"
          size="large"
          class="confirm-button"
          :loading="isLoading"
          :disabled="isLoading"
        >
          Confirm and Send OTP
        </FcxButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GstinData } from '../types/gstin-accounts-types'

// Props
interface Props {
  gstinData: GstinData
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

// Emits
const emit = defineEmits<{
  confirm: []
  back: []
  cancel: []
}>()

// Computed
const extractedStateCode = computed(() => {
  return props.gstinData.gstin?.substring(0, 2) || ''
})

const formattedAddress = computed(() => {
  if (!props.gstinData.pradr?.addr) return ''
  
  const addr = props.gstinData.pradr.addr
  const parts = [
    addr.bno,
    addr.bnm,
    addr.flno,
    addr.st,
    addr.loc,
    addr.landMark,
    addr.dst,
    addr.pncd ? `PIN: ${addr.pncd}` : ''
  ].filter(Boolean)
  
  return parts.join(', ')
})

const statusClass = computed(() => {
  const status = props.gstinData.sts?.toLowerCase()
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
const handleConfirm = () => {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.gstin-verification-form {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.form-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.close-button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  &:focus {
    outline: none;
    background: #f3f4f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
}

.verification-content {
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  color: #1e40af;
}

.info-icon {
  flex-shrink: 0;
}

.info-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
}

.gstin-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  min-width: 100px;
  flex-shrink: 0;
}

.detail-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  flex: 1;
  word-break: break-word;
}

.address-text {
  font-weight: 400;
  line-height: 1.4;
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

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.back-button {
  flex: 1;
}

.confirm-button {
  flex: 2;
  background: #10b981 !important;

  &:hover:not(:disabled) {
    background: #059669 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
}

// Dark theme support
:root[data-theme="dark"] {
  .gstin-verification-form {
    background: #1f2937;
  }

  .form-header {
    border-bottom-color: #374151;
  }

  .form-title {
    color: #f9fafb;
  }

  .close-button {
    color: #d1d5db;

    &:hover {
      background: #374151;
      color: #f9fafb;
    }
  }

  .info-banner {
    background: #1e3a8a;
    border-color: #3b82f6;
    color: #dbeafe;
  }

  .detail-row {
    border-bottom-color: #374151;
  }

  .detail-label {
    color: #9ca3af;
  }

  .detail-value {
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
  .gstin-verification-form {
    width: 100%;
    max-width: none;
    border-radius: 12px 12px 0 0;
  }

  .form-header {
    padding: 20px 20px 0 20px;
  }

  .verification-content {
    padding: 0 20px 20px 20px;
  }

  .form-title {
    font-size: 18px;
  }

  .detail-row {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

  .detail-label {
    min-width: auto;
  }

  .form-actions {
    flex-direction: column;
    
    .back-button,
    .confirm-button {
      flex: none;
    }
  }
}
</style>