<template>
  <div class="crm-deals-page">
    <header class="page-header">
      <h1 class="page-title">Сделки</h1>
      <Button @click="showDealModal = true">Добавить сделку</Button>
    </header>

    <div class="page-controls">
      <Input
        v-model="searchQuery"
        placeholder="Поиск сделок..."
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">
      Загрузка сделок...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="deals-list">
      <div
        v-for="deal in filteredDeals"
        :key="deal.id"
        class="deal-card"
        @click="goToDealDetails(deal.id)"
      >
        <div class="deal-info">
          <h3>{{ deal.title }}</h3>
          <p>{{ getCustomerName(deal.customerId) }}</p>
          <p class="deal-value">${{ deal.value.toLocaleString() }}</p>
          <p class="deal-stage">{{ getStageName(deal.stageId) }}</p>
          <p class="deal-probability">{{ deal.probability }}% probability</p>
        </div>
        <div class="deal-actions">
          <Button variant="outline" size="small" @click.stop="editDeal(deal)">
            Редактировать
          </Button>
          <Button variant="danger" size="small" @click.stop="deleteDeal(deal.id)">
            Удалить
          </Button>
        </div>
      </div>

      <div v-if="filteredDeals.length === 0" class="empty-state">
        Сделки не найдены
      </div>
    </div>

    <!-- Deal Modal -->
    <Modal
      v-model:isOpen="showDealModal"
      :title="isEditing ? 'Редактировать сделку' : 'Создать новую сделку'"
      size="large"
    >
      <DealForm
        :initialData="editingDeal"
        @submit="handleDealSubmit"
        @cancel="closeDealModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDealStore } from '@/entities/deal/store/deal.store';
import { useCustomerStore } from '@/entities/customer/store/customer.store';
import { usePipelineStore } from '@/entities/pipeline/store/pipeline.store';
import type { Deal } from '@/shared';
import Button from '@/shared/ui/Button.vue';
import Input from '@/shared/ui/Input.vue';
import Modal from '@/shared/ui/Modal.vue';
import DealForm from '@/features/deal-form/ui/DealForm.vue';

// Stores
const dealStore = useDealStore();
const customerStore = useCustomerStore();
const pipelineStore = usePipelineStore();
const router = useRouter();

// State
const showDealModal = ref(false);
const searchQuery = ref('');
const editingDeal = ref<Deal | null>(null);

// Computed properties
const deals = computed(() => dealStore.allDeals);
const customers = computed(() => customerStore.allCustomers);
const pipelines = computed(() => pipelineStore.allPipelines);
const loading = computed(() => dealStore.isLoading);
const error = computed(() => dealStore.error);

const isEditing = computed(() => editingDeal.value !== null);

const filteredDeals = computed(() => {
  if (!searchQuery.value) {
    return deals.value;
  }

  const query = searchQuery.value.toLowerCase();
 return deals.value.filter(deal =>
    deal.title.toLowerCase().includes(query) ||
    getCustomerName(deal.customerId).toLowerCase().includes(query) ||
    deal.value.toString().includes(query)
  );
});

// Methods
const getCustomerName = (customerId: string) => {
  const customer = customers.value.find(c => c.id === customerId);
  return customer ? customer.name : 'Unknown Customer';
};

const getStageName = (stageId: string) => {
  for (const pipeline of pipelines.value) {
    const stage = pipeline.stages.find(s => s.id === stageId);
    if (stage) return stage.name;
  }
  return 'Unknown Stage';
};

const goToDealDetails = (id: string) => {
  router.push(`/deals/${id}`);
};

const editDeal = (deal: Deal) => {
  editingDeal.value = deal;
  showDealModal.value = true;
};

const deleteDeal = async (id: string) => {
  if (confirm('Are you sure you want to delete this deal?')) {
    const result = await dealStore.deleteDeal(id);
    if (!result) {
      alert('Failed to delete deal');
    }
  }
};

const handleDealSubmit = async (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> | Partial<Deal>) => {
  let result;

  if (isEditing.value && editingDeal.value?.id) {
    // Update existing deal
    result = await dealStore.updateDeal(editingDeal.value.id, dealData as Partial<Deal>);
  } else {
    // Create new deal
    result = await dealStore.createDeal(dealData as Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>);
  }

  if (result) {
    closeDealModal();
  } else {
    alert('Failed to save deal');
  }
};

const closeDealModal = () => {
  showDealModal.value = false;
  editingDeal.value = null;
};

// Initialize data
onMounted(async () => {
  await Promise.all([
    dealStore.fetchDeals(),
    customerStore.fetchCustomers(),
    pipelineStore.fetchPipelines()
  ]);
});
</script>
