<template>
  <div class="gstin-loading-state">
    <div class="loading-content">
      <!-- Loading Spinner -->
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      
      <!-- Loading Message -->
      <h3 class="loading-title">{{ title }}</h3>
      <p class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Please wait...',
  title: 'Processing'
})
</script>

<style lang="scss" scoped>
.gstin-loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 300px;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.loading-message {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

// Dark theme support
:root[data-theme="dark"] {
  .loading-title {
    color: #f9fafb;
  }
  
  .loading-message {
    color: #d1d5db;
  }
  
  .spinner {
    border-color: #374151;
    border-top-color: #3b82f6;
  }
}

// Mobile responsive
@media (max-width: 640px) {
  .gstin-loading-state {
    padding: 40px 20px;
  }
  
  .loading-title {
    font-size: 16px;
  }
  
  .loading-message {
    font-size: 13px;
  }
  
  .spinner {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }
}
</style>