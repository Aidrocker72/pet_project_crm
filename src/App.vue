<template>
  <div class="app">
    <header class="app-header">
      <div class="app-header-content">
        <h1 class="app-title">CRM Система</h1>
        <nav class="app-nav">
          <RouterLink to="/" class="nav-link">Панель управления</RouterLink>
          <RouterLink to="/customers" class="nav-link">Клиенты</RouterLink>
          <RouterLink to="/deals" class="nav-link">Сделки</RouterLink>
          <RouterLink to="/pipeline" class="nav-link">Воронка</RouterLink>
          <RouterLink to="/about" class="nav-link">О программе</RouterLink>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { useDealStore } from '@/store/deal.store';
import { useCustomerStore } from '@/store/customer.store';
import { usePipelineStore } from '@/store/pipeline.store';

const dealStore = useDealStore();
const customerStore = useCustomerStore();
const pipelineStore = usePipelineStore();

onMounted(async () => {
  await Promise.all([
    dealStore.fetchDeals(),
    customerStore.fetchCustomers(),
    pipelineStore.fetchPipelines()
  ]);
});

</script>
