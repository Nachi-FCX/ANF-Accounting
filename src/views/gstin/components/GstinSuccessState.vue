<template>
  <div class="gstin-success-state">
    <!-- Success Content -->
    <div class="success-content">
      <!-- Success Icon -->
      <div class="success-icon">
        <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      
      <!-- Success Message -->
      <h3 class="success-title">GSTIN Added Successfully!</h3>
      <p class="success-message">
        {{ gstinData.companyName }} has been successfully added to your account.
      </p>

      <!-- GSTIN Summary -->
      <div class="gstin-summary">
        <div class="summary-item">
          <span class="summary-label">Company Name:</span>
          <span class="summary-value">{{ gstinData.companyName }}</span>
        </div>
        
        <div class="summary-item">
          <span class="summary-label">GSTIN:</span>
          <span class="summary-value">{{ gstinData.gstin }}</span>
        </div>
        
        <div class="summary-item">
          <span class="summary-label">State Code:</span>
          <span class="summary-value">{{ gstinData.stateCode }}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">Username:</span>
          <span class="summary-value">{{ gstinData.username }}</span>
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
import type { GstinAccount } from '../types/gstin-accounts-types'

// Props
interface Props {
  gstinData: GstinAccount
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Methods
const handleClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.gstin-success-state {
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

.gstin-summary {
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

  .gstin-summary {
    background: #374151;
    border-color: #4b5563;
  }

  .summary-label {
    color: #9ca3af;
  }

  .summary-value {
    color: #f9fafb;
  }
}

// Mobile responsive
@media (max-width: 640px) {
  .gstin-success-state {
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

  .gstin-summary {
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