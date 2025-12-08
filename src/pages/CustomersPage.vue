<template>
  <div class="crm-customers-page">
    <header class="page-header">
      <h1 class="page-title">Клиенты</h1>
      <Button @click="showCustomerModal = true">Добавить клиента</Button>
    </header>

    <div class="page-controls">
      <Input
        v-model="searchQuery"
        placeholder="Поиск клиентов..."
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">
      Загрузка клиентов...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="customers-list">
      <div
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="customer-card"
        @click="goToCustomerDetails(customer.id)"
      >
        <div class="customer-info">
          <h3>{{ customer.name }}</h3>
          <p>{{ customer.email }}</p>
          <p v-if="customer.company">{{ customer.company }}</p>
          <p v-if="customer.position">{{ customer.position }}</p>
        </div>
        <div class="customer-actions">
          <Button variant="outline" size="small" @click.stop="editCustomer(customer)">
            Редактировать
          </Button>
          <Button variant="danger" size="small" @click.stop="deleteCustomer(customer.id)">
            Удалить
          </Button>
        </div>
      </div>

      <div v-if="filteredCustomers.length === 0" class="empty-state">
        Клиенты не найдены
      </div>
    </div>

    <!-- Customer Modal -->
    <Modal
      v-model:isOpen="showCustomerModal"
      :title="isEditing ? 'Редактировать клиента' : 'Создать нового клиента'"
      size="large"
    >
      <CustomerForm
        :initialData="editingCustomer"
        @submit="handleCustomerSubmit"
        @cancel="closeCustomerModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerStore } from '@/entities/customer/store/customer.store';
import type { Customer } from '@/shared';
import Button from '@/shared/ui/Button.vue';
import Input from '@/shared/ui/Input.vue';
import Modal from '@/shared/ui/Modal.vue';
import CustomerForm from '@/features/customer-form/ui/CustomerForm.vue';

// Stores
const customerStore = useCustomerStore();
const router = useRouter();

// State
const showCustomerModal = ref(false);
const searchQuery = ref('');
const editingCustomer = ref<Customer | null>(null);

// Computed properties
const customers = computed(() => customerStore.allCustomers);
const loading = computed(() => customerStore.isLoading);
const error = computed(() => customerStore.error);

const isEditing = computed(() => editingCustomer.value !== null);

const filteredCustomers = computed(() => {
  if (!searchQuery.value) {
    return customers.value;
  }

  const query = searchQuery.value.toLowerCase();
 return customers.value.filter(customer =>
    customer.name.toLowerCase().includes(query) ||
    customer.email.toLowerCase().includes(query) ||
    (customer.company && customer.company.toLowerCase().includes(query)) ||
    (customer.position && customer.position.toLowerCase().includes(query))
  );
});

// Methods
const goToCustomerDetails = (id: string) => {
  router.push(`/customers/${id}`);
};

const editCustomer = (customer: Customer) => {
  console.log(customer)
  editingCustomer.value = customer;
  showCustomerModal.value = true;
};

const deleteCustomer = async (id: string) => {
  if (confirm('Are you sure you want to delete this customer?')) {
    const result = await customerStore.deleteCustomer(id);
    if (!result) {
      alert('Failed to delete customer');
    }
 }
};

const handleCustomerSubmit = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> | Partial<Customer>) => {
  let result;

  if (isEditing.value && editingCustomer.value?.id) {
    // Update existing customer
    result = await customerStore.updateCustomer(editingCustomer.value.id, customerData as Partial<Customer>);
  } else {
    // Create new customer
    result = await customerStore.createCustomer(customerData as Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>);
  }

  if (result) {
    closeCustomerModal();
  } else {
    alert('Failed to save customer');
  }
};

const closeCustomerModal = () => {
  showCustomerModal.value = false;
  editingCustomer.value = null;
};

// Initialize data
onMounted(() => {
  customerStore.fetchCustomers();
});
</script>
