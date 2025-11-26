<template>
  <div class="state-wrapper">
    <!-- Loading State -->
    <LoadingOverlay 
      v-if="loading" 
      :visible="loading"
      :message="loadingMessage"
    />
    
    <!-- Error States -->
    <Error400 
      v-else-if="error && error.status === 400"
      :custom-message="error.message"
      :details="error.details"
      @retry="$emit('retry')"
    />
    
    <Error401 
      v-else-if="error && error.status === 401"
      :custom-message="error.message"
      :redirect-after-auth="redirectAfterAuth"
    />
    
    <Error403 
      v-else-if="error && error.status === 403"
      :custom-message="error.message"
    />
    
    <Error404 
      v-else-if="error && error.status === 404"
      :custom-message="error.message"
    />
    
    <Error500 
      v-else-if="error && error.status === 500"
      :custom-message="error.message"
      :error-id="error.code"
      @retry="$emit('retry')"
    />
    
    <ErrorNetwork 
      v-else-if="error && error.type === 'network'"
      :custom-message="error.message"
      @retry="$emit('retry')"
    />
    
    <ErrorGeneric 
      v-else-if="error"
      :error="error"
      @retry="$emit('retry')"
    />
    
    <!-- Empty State -->
    <EmptyState 
      v-else-if="isEmpty && !loading"
      :message="emptyMessage"
      :show-action="showEmptyAction"
      @action="$emit('empty-action')"
    />
    
    <!-- Success State -->
    <Success200 
      v-else-if="success"
      :title="success.title"
      :message="success.message"
      :primary-action="success.primaryAction"
      :secondary-action="success.secondaryAction"
      @primary-action="$emit('success-primary')"
      @secondary-action="$emit('success-secondary')"
    />
    
    <!-- Content -->
    <div v-else class="state-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingOverlay from '../loading/LoadingOverlay.vue'
import Error400 from '../errors/Error400.vue'
import Error401 from '../errors/Error401.vue'
import Error403 from '../errors/Error403.vue'
import Error404 from '../errors/Error404.vue'
import Error500 from '../errors/Error500.vue'
import ErrorNetwork from '../errors/ErrorNetwork.vue'
import ErrorGeneric from '../errors/ErrorGeneric.vue'
import EmptyState from '../empty/EmptyState.vue'
import Success200 from '../success/Success200.vue'
import type { StateWrapperProps, ErrorState, SuccessState } from '../types/state-types'

const props = withDefaults(defineProps<StateWrapperProps>(), {
  loading: false,
  isEmpty: false,
  showEmptyAction: false
})

const emit = defineEmits<{
  retry: []
  'empty-action': []
  'success-primary': []
  'success-secondary': []
}>()
</script>

<style scoped lang="scss">
.state-wrapper {
  position: relative;
  min-height: 200px;
  width: 100%;
  
  .state-content {
    width: 100%;
  }
}
</style>
