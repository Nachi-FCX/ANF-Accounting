<template>
  <div class="sales-invoice-list-view">
    <SalesInvoiceDataTable />
  </div>
</template>

<script setup lang="ts">
import SalesInvoiceDataTable from '../components/SalesInvoiceDataTable.vue'
</script>

<style scoped lang="scss">
.sales-invoice-list-view {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
}
</style>
