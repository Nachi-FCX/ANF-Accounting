<template>
  <div class="invoice-actions-container flex justify-end items-center gap-3">
    <FcxButton 
      label="Cancel" 
      class="invoice-btn-secondary" 
      @click="$emit('cancel')"
      type="button"
    />
    <FcxButton 
      label="Save Invoice" 
      icon="pi pi-check" 
      class="invoice-btn-primary"
      @click="$emit('save')"
      type="submit"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import FcxButton from '@/components/buttoncomponents/FcxButton.vue';

const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'cancel'): void;
}>();
</script>

<style scoped>
.invoice-actions {
  border-radius: 0 0 8px 8px;
}
</style>
