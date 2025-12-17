<template>
  <div class="crm-dashboard-page">
    <header class="crm-dashboard-page__header">
      <h1 class="crm-dashboard-page__title">CRM Панель управления</h1>
      <div class="crm-dashboard-page__actions">
        <Button @click="showCustomerModal = true">Добавить клиента</Button>
        <Button @click="showDealModal = true" variant="secondary">Добавить сделку</Button>
      </div>
    </header>

    <div class="crm-dashboard-page__stats">
      <div class="crm-dashboard-page__stat-card">
        <h3>Всего клиентов</h3>
        <p class="stat-value">{{ customerCount }}</p>
      </div>
      <div class="crm-dashboard-page__stat-card">
        <h3>Всего сделок</h3>
        <p class="stat-value">{{ dealCount }}</p>
      </div>
      <div class="crm-dashboard-page__stat-card">
        <h3>Объем воронки</h3>
        <p class="stat-value">${{ pipelineValue.toLocaleString() }}</p>
      </div>
      <div class="crm-dashboard-page__stat-card">
        <h3>Конверсия</h3>
        <p class="stat-value">{{ conversionRate }}%</p>
      </div>
    </div>

    <div class="dashboard-content">
      <section class="crm-dashboard-page__section">
        <div class="section-header">
          <h2>Последние клиенты</h2>
          <RouterLink to="/customers" class="section-link">Показать все</RouterLink>
        </div>
        <div v-if="recentCustomers.length > 0" class="customer-list">
          <div
            v-for="customer in recentCustomers"
            :key="customer.id"
            class="customer-item"
            @click="goToCustomerDetails(customer.id)"
          >
            <div class="customer-info">
              <h3>{{ customer.name }}</h3>
              <p>{{ customer.email }}</p>
            </div>
            <span class="customer-company">{{ customer.company || 'N/A' }}</span>
          </div>
        </div>
        <div v-else class="empty-state">Клиенты не найдены</div>
      </section>

      <section class="crm-dashboard-page__section">
        <div class="section-header">
          <h2>Последние сделки</h2>
          <RouterLink to="/deals" class="section-link">Показать все</RouterLink>
        </div>
        <div v-if="recentDeals.length > 0" class="deal-list">
          <div
            v-for="deal in recentDeals"
            :key="deal.id"
            class="deal-item"
            @click="goToDealDetails(deal.id)"
          >
            <div class="deal-info">
              <h3>{{ deal.title }}</h3>
              <p>{{ getCustomerName(deal.customerId) }}</p>
            </div>
            <div class="deal-value">${{ deal.value.toLocaleString() }}</div>
            <span class="deal-stage">{{ getStageName(deal.stageId) }}</span>
          </div>
        </div>
        <div v-else class="empty-state">Сделки не найдены</div>
      </section>
    </div>

    <Modal
      v-model:isOpen="showCustomerModal"
      title="Создать нового клиента"
      size="large"
    >
      <CustomerForm
        @submit="handleCustomerSubmit"
        @cancel="showCustomerModal = false"
      />
    </Modal>

    <Modal
      v-model:isOpen="showDealModal"
      title="Создать новую сделку"
      size="large"
    >
      <DealForm
        @submit="handleDealSubmit"
        @cancel="showDealModal = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerStore } from '@/entities/customer/store/customer.store';
import { useDealStore } from '@/entities/deal/store/deal.store';
import { usePipelineStore } from '@/entities/pipeline/store/pipeline.store';
import Button from '@/shared/ui/Button.vue';
import Modal from '@/shared/ui/Modal.vue';
import CustomerForm from '@/features/customer-form/ui/CustomerForm.vue';
import DealForm from '@/features/deal-form/ui/DealForm.vue';
import type { ICustomer } from '@/interfaces/ICustomer';
import type { IDeal } from '@/interfaces/IDeal';

const customerStore = useCustomerStore();
const dealStore = useDealStore();
const pipelineStore = usePipelineStore();
const router = useRouter();

const showCustomerModal = ref(false);
const showDealModal = ref(false);

const customerCount = computed(() => customerStore.customerCount);
const dealCount = computed(() => dealStore.dealCount);

const recentCustomers = computed(() => {
 return [...customerStore.allCustomers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

const recentDeals = computed(() => {
 return [...dealStore.allDeals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

const pipelineValue = computed(() => {
  return dealStore.allDeals.reduce((sum, deal) => sum + deal.value, 0);
});

const conversionRate = computed(() => {
 const totalDeals = dealStore.allDeals.length;
  if (totalDeals === 0) return 0;

  const wonDeals = dealStore.allDeals.filter(deal => deal.status === 'won').length;
  return Math.round((wonDeals / totalDeals) * 100);
});

// Methods
const getCustomerName = (customerId: string) => {
  const customer = customerStore.customerById(customerId);
  return customer ? customer.name : 'Unknown Customer';
};

const getStageName = (stageId: string) => {
  // Find the stage in any pipeline
 for (const pipeline of pipelineStore.allPipelines) {
    const stage = pipeline.stages.find(s => s.id === stageId);
    if (stage) return stage.name;
  }
  return 'Unknown Stage';
};

const handleCustomerSubmit = async (customerData: Omit<ICustomer, 'id' | 'createdAt' | 'updatedAt'> | Partial<ICustomer>) => {
  const result = await customerStore.createCustomer(customerData);
  if (result) {
    showCustomerModal.value = false;
  }
};

const handleDealSubmit = async (dealData: Omit<IDeal, 'id' | 'createdAt' | 'updatedAt'> | Partial<IDeal>) => {
 const result = await dealStore.createDeal(dealData);
  if (result) {
    showDealModal.value = false;
  }
};

const goToCustomerDetails = (id: string) => {
  router.push(`/customers/${id}`);
};

const goToDealDetails = (id: string) => {
 router.push(`/deals/${id}`);
};

onMounted(async () => {
 await Promise.all([
    customerStore.fetchCustomers(),
    dealStore.fetchDeals(),
    pipelineStore.fetchPipelines()
  ]);
});
</script>
