<template>
  <div class="crm-customer-details-page">
    <header class="page-header">
      <h1 class="page-title">Детали клиента</h1>
      <Button @click="goBack" variant="secondary">Назад</Button>
    </header>

    <div v-if="loading" class="loading">
      Загрузка данных клиента...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="customer" class="customer-details">
      <div class="customer-info-card">
        <h2>{{ customer.name }}</h2>
        <div class="customer-details-grid">
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ customer.email }}</span>
          </div>
          <div class="detail-item" v-if="customer.phone">
            <span class="detail-label">Телефон:</span>
            <span class="detail-value">{{ customer.phone }}</span>
          </div>
          <div class="detail-item" v-if="customer.company">
            <span class="detail-label">Компания:</span>
            <span class="detail-value">{{ customer.company }}</span>
          </div>
          <div class="detail-item" v-if="customer.position">
            <span class="detail-label">Должность:</span>
            <span class="detail-value">{{ customer.position }}</span>
          </div>
          <div class="detail-item" v-if="customer.notes">
            <span class="detail-label">Заметки:</span>
            <span class="detail-value">{{ customer.notes }}</span>
          </div>
        </div>
      </div>

      <div class="customer-deals-section">
        <h3>Сделки клиента</h3>
        <div v-if="customerDeals.length > 0" class="deals-list">
          <div
            v-for="deal in customerDeals"
            :key="deal.id"
            class="deal-item"
            @click="goToDealDetails(deal.id)"
          >
            <div class="deal-info">
              <h4>{{ deal.title }}</h4>
              <p>{{ deal.description || 'Без описания' }}</p>
            </div>
            <div class="deal-value">${{ deal.value.toLocaleString() }}</div>
            <span class="deal-status">{{ deal.status }}</span>
          </div>
        </div>
        <div v-else class="empty-state">
          У клиента пока нет сделок
        </div>
      </div>

      <div class="customer-actions">
        <Button @click="editCustomer" variant="outline">Редактировать клиента</Button>
        <Button @click="deleteCustomer" variant="danger">Удалить клиента</Button>
      </div>
    </div>

    <div v-else class="empty-state">
      Клиент не найден
    </div>

    <!-- Customer Edit Modal -->
    <Modal
      v-model:isOpen="showEditModal"
      title="Редактировать клиента"
      size="large"
    >
      <CustomerForm
        :initialData="customer"
        @submit="handleEditSubmit"
        @cancel="showEditModal = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCustomerStore } from '@/entities/customer/store/customer.store';
import { useDealStore } from '@/entities/deal/store/deal.store';
import type { Customer, Deal } from '@/shared';
import Button from '@/shared/ui/Button.vue';
import Modal from '@/shared/ui/Modal.vue';
import CustomerForm from '@/features/customer-form/ui/CustomerForm.vue';

// Stores
const customerStore = useCustomerStore();
const dealStore = useDealStore();
const router = useRouter();
const route = useRoute();

// State
const showEditModal = ref(false);

// Computed properties
const customerId = computed(() => route.params.id as string);
const customer = computed(() => customerStore.customerById(customerId.value));
const loading = computed(() => customerStore.isLoading);
const error = computed(() => customerStore.error);

const customerDeals = computed(() => {
  return dealStore.allDeals.filter(deal => deal.customerId === customerId.value);
});

// Methods
const goBack = () => {
  router.go(-1);
};

const goToDealDetails = (id: string) => {
  router.push(`/deals/${id}`);
};

const editCustomer = () => {
  showEditModal.value = true;
};

const deleteCustomer = async () => {
  if (confirm('Вы уверены, что хотите удалить этого клиента?')) {
    const result = await customerStore.deleteCustomer(customerId.value);
    if (result) {
      router.push('/customers');
    } else {
      alert('Не удалось удалить клиента');
    }
  }
};

const handleEditSubmit = async (customerData: Partial<Customer>) => {
  const result = await customerStore.updateCustomer(customerId.value, customerData);
  if (result) {
    showEditModal.value = false;
  } else {
    alert('Не удалось обновить клиента');
  }
};

// Initialize data
onMounted(() => {
  customerStore.fetchCustomerById(customerId.value);
  dealStore.fetchDeals();
});
</script>

<style scoped>
.crm-customer-details-page {
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

.customer-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 24px);
}

.customer-info-card {
  background-color: var(--color-bg-primary, #ffffff);
  border-radius: var(--border-radius-medium, 8px);
  padding: var(--padding-lg, 20px);
  box-shadow: var(--shadow-md, 0 0.5rem 1rem rgba(0, 0, 0, 0.15));
}

.customer-details-grid {
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

.customer-deals-section {
  background-color: var(--color-bg-primary, #ffffff);
  border-radius: var(--border-radius-medium, 8px);
  padding: var(--padding-lg, 20px);
  box-shadow: var(--shadow-md, 0 0.5rem 1rem rgba(0, 0, 0, 0.15));
}

.customer-deals-section h3 {
  margin-top: 0;
  margin-bottom: var(--spacing-lg, 24px);
  color: var(--color-text-primary, #212529);
}

.deals-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 16px);
}

.deal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--padding-md, 12px);
  border: 1px solid var(--color-border-primary, #ced4da);
  border-radius: var(--border-radius-small, 6px);
  cursor: pointer;
  transition: var(--transition-base, all 0.2s ease);
}

.deal-item:hover {
  border-color: var(--color-primary, #007bff);
  box-shadow: var(--shadow-sm, 0 0.25rem 0.5rem rgba(0, 123, 255, 0.15));
}

.deal-info h4 {
  margin: 0 0 var(--spacing-sm, 8px) 0;
  color: var(--color-text-primary, #212529);
  font-size: var(--font-size-md, 16px);
}

.deal-info p {
  margin: 0;
  color: var(--color-text-secondary, #6c757d);
  font-size: var(--font-size-sm, 14px);
}

.deal-value {
  font-weight: var(--font-weight-bold, 600);
  color: var(--color-success, #28a745);
  margin: 0 var(--spacing-lg, 16px);
}

.deal-status {
  padding: var(--padding-xs, 6px) var(--padding-sm, 12px);
  border-radius: var(--border-radius-small, 4px);
  font-size: var(--font-size-xs, 12px);
  font-weight: var(--font-weight-medium, 500);
}

.customer-actions {
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
