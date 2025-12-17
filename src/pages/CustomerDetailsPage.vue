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
import { useCustomerStore } from '@/store/customer.store';
import { useDealStore } from '@/store/deal.store';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import CustomerForm from '@/components/CustomerForm.vue';
import type { ICustomer } from '@/interfaces/ICustomer';

const customerStore = useCustomerStore();
const dealStore = useDealStore();
const router = useRouter();
const route = useRoute();

const showEditModal = ref(false);

const customerId = computed(() => route.params.id as string);
const customer = computed(() => customerStore.customerById(customerId.value));
const loading = computed(() => customerStore.isLoading);
const error = computed(() => customerStore.error);

const customerDeals = computed(() => {
  return dealStore.allDeals.filter(deal => deal.customerId === customerId.value);
});

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

const handleEditSubmit = async (customerData: Partial<ICustomer>) => {
  const result = await customerStore.updateCustomer(customerId.value, customerData);
  if (result) {
    showEditModal.value = false;
  } else {
    alert('Не удалось обновить клиента');
  }
};

onMounted(() => {
  customerStore.fetchCustomerById(customerId.value);
  dealStore.fetchDeals();
});
</script>
