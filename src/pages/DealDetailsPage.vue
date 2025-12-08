<template>
  <div class="crm-deal-details-page">
    <header class="page-header">
      <h1 class="page-title">Детали сделки</h1>
      <Button @click="goBack" variant="secondary">Назад</Button>
    </header>

    <div v-if="loading" class="loading">
      Загрузка данных сделки...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="deal" class="deal-details">
      <div class="deal-info-card">
        <h2>{{ deal.title }}</h2>
        <div class="deal-details-grid">
          <div class="detail-item">
            <span class="detail-label">Клиент:</span>
            <span class="detail-value">{{ getCustomerName(deal.customerId) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Воронка:</span>
            <span class="detail-value">{{ getPipelineName(deal.pipelineId) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Этап:</span>
            <span class="detail-value">{{ getStageName(deal.stageId) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Сумма:</span>
            <span class="detail-value">${{ deal.value.toLocaleString() }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Вероятность:</span>
            <span class="detail-value">{{ deal.probability }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Статус:</span>
            <span class="detail-value">{{ deal.status }}</span>
          </div>
          <div class="detail-item" v-if="deal.closeDate">
            <span class="detail-label">Дата закрытия:</span>
            <span class="detail-value">{{ formatDate(deal.closeDate) }}</span>
          </div>
          <div class="detail-item" v-if="deal.description">
            <span class="detail-label">Описание:</span>
            <span class="detail-value">{{ deal.description }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Дата создания:</span>
            <span class="detail-value">{{ formatDate(deal.createdAt) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Дата обновления:</span>
            <span class="detail-value">{{ formatDate(deal.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <div class="deal-actions">
        <Button @click="editDeal" variant="outline">Редактировать сделку</Button>
        <Button @click="deleteDeal" variant="danger">Удалить сделку</Button>
      </div>
    </div>

    <div v-else class="empty-state">
      Сделка не найдена
    </div>

    <!-- Deal Edit Modal -->
    <Modal
      v-model:isOpen="showEditModal"
      title="Редактировать сделку"
      size="large"
    >
      <DealForm
        :initialData="deal"
        @submit="handleEditSubmit"
        @cancel="showEditModal = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDealStore } from '@/entities/deal/store/deal.store';
import { useCustomerStore } from '@/entities/customer/store/customer.store';
import { usePipelineStore } from '@/entities/pipeline/store/pipeline.store';
import type { Deal, Customer, Pipeline } from '@/shared';
import Button from '@/shared/ui/Button.vue';
import Modal from '@/shared/ui/Modal.vue';
import DealForm from '@/features/deal-form/ui/DealForm.vue';

// Stores
const dealStore = useDealStore();
const customerStore = useCustomerStore();
const pipelineStore = usePipelineStore();
const router = useRouter();
const route = useRoute();

// State
const showEditModal = ref(false);

// Computed properties
const dealId = computed(() => route.params.id as string);
const deal = computed(() => dealStore.dealById(dealId.value));
const loading = computed(() => dealStore.isLoading);
const error = computed(() => dealStore.error);

const customers = computed(() => customerStore.allCustomers);
const pipelines = computed(() => pipelineStore.allPipelines);

// Methods
const goBack = () => {
  router.go(-1);
};

const getCustomerName = (customerId: string) => {
  const customer = customers.value.find(c => c.id === customerId);
  return customer ? customer.name : 'Неизвестный клиент';
};

const getPipelineName = (pipelineId: string) => {
  const pipeline = pipelines.value.find(p => p.id === pipelineId);
  return pipeline ? pipeline.name : 'Неизвестная воронка';
};

const getStageName = (stageId: string) => {
  for (const pipeline of pipelines.value) {
    const stage = pipeline.stages.find(s => s.id === stageId);
    if (stage) return stage.name;
  }
  return 'Неизвестный этап';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const editDeal = () => {
  showEditModal.value = true;
};

const deleteDeal = async () => {
  if (confirm('Вы уверены, что хотите удалить эту сделку?')) {
    const result = await dealStore.deleteDeal(dealId.value);
    if (result) {
      router.push('/deals');
    } else {
      alert('Не удалось удалить сделку');
    }
  }
};

const handleEditSubmit = async (dealData: Partial<Deal>) => {
  const result = await dealStore.updateDeal(dealId.value, dealData);
  if (result) {
    showEditModal.value = false;
  } else {
    alert('Не удалось обновить сделку');
  }
};

// Initialize data
onMounted(() => {
  dealStore.fetchDealById(dealId.value);
  customerStore.fetchCustomers();
  pipelineStore.fetchPipelines();
});
</script>

<style scoped>
.crm-deal-details-page {
  padding: var(--padding-lg, 20px);
  max-width: 1200px;
  margin: 0 auto;
  font-family: var(--font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg, 24px);
}

.page-title {
  margin: 0;
  font-size: var(--font-size-lg, 20px);
  color: var(--color-text-primary, #212529);
  font-weight: var(--font-weight-bold, 600);
}

.deal-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 24px);
}

.deal-info-card {
  background-color: var(--color-bg-primary, #ffffff);
  border-radius: var(--border-radius-medium, 8px);
  padding: var(--padding-lg, 20px);
  box-shadow: var(--shadow-md, 0 0.5rem 1rem rgba(0, 0, 0, 0.15));
}

.deal-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md, 16px);
  margin-top: var(--spacing-md, 16px);
}

.detail-item {
  display: flex;
  gap: var(--spacing-sm, 8px);
  padding: var(--padding-md, 12px) 0;
  border-bottom: 1px solid var(--color-border-secondary, #e9ecef);
}

.detail-label {
  font-weight: var(--font-weight-bold, 600);
  color: var(--color-text-secondary, #6c757d);
  min-width: 120px;
}

.detail-value {
  color: var(--color-text-primary, #212529);
  flex: 1;
}

.deal-actions {
  display: flex;
  gap: var(--spacing-md, 16px);
  justify-content: flex-end;
  margin-top: var(--spacing-lg, 24px);
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: var(--padding-xl, 40px);
  font-size: var(--font-size-lg, 18px);
  color: var(--color-text-secondary, #6c757d);
}

.error,
.empty-state {
  color: var(--color-danger, #dc3545);
}
</style>
