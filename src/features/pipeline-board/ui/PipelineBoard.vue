<template>
  <div class="crm-pipeline-board">
    <div class="crm-pipeline-board__header">
      <h2 class="crm-pipeline-board__title">Воронка продаж</h2>
    </div>

    <div v-if="loading" class="crm-pipeline-board__loading">
      Загрузка данных воронки...
    </div>

    <div v-else-if="error" class="crm-pipeline-board__error">
      Error: {{ error }}
    </div>

    <div v-else class="crm-pipeline-board__content">
      <div class="crm-pipeline-board__stages">
        <div
          v-for="stage in currentPipeline?.stages"
          :key="stage.id"
          class="crm-pipeline-board__stage"
        >
          <div class="crm-pipeline-board__stage-header">
            <h3 class="crm-pipeline-board__stage-title">{{ stage.name }}</h3>
            <span class="crm-pipeline-board__stage-count">
              {{ getDealsByStage(stage.id).length }}
            </span>
          </div>

          <div class="crm-pipeline-board__stage-content">
            <draggable
              v-model="dealsByStageRef[stage.id]"
              :group="{ name: 'deals', pull: true, put: true }"
              item-key="id"
              class="crm-pipeline-board__deal-list"
              @start="dragging = true"
              @end="dragging = false"
              :move="onMove"
            >
              <template #item="{ element: deal }">
                <div
                  class="crm-pipeline-board__deal"
                  @click="onDealClick(deal)"
                >
                  <div class="crm-pipeline-board__deal-header">
                    <h4 class="crm-pipeline-board__deal-title">{{ deal.title }}</h4>
                    <span class="crm-pipeline-board__deal-value">${{ deal.value.toLocaleString() }}</span>
                  </div>

                  <div class="crm-pipeline-board__deal-customer">
                    {{ getCustomerName(deal.customerId) }}
                  </div>

                  <div class="crm-pipeline-board__deal-probability">
                    <span :style="{ width: deal.probability + '%' }" class="crm-pipeline-board__probability-bar"></span>
                    <span class="crm-pipeline-board__probability-text">{{ deal.probability }}%</span>
                  </div>
                </div>
              </template>
            </draggable>

            <div v-if="getDealsByStage(stage.id).length === 0" class="crm-pipeline-board__empty-stage">
              Нет сделок на этом этапе
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, watch } from 'vue';
import type { Deal } from '@/shared';
import { useDealStore } from '@/entities/deal/store/deal.store';
import { useCustomerStore } from '@/entities/customer/store/customer.store';
import { usePipelineStore } from '@/entities/pipeline/store/pipeline.store';
import Button from '@/shared/ui/Button.vue';
import draggable from 'vuedraggable';

// Stores
const dealStore = useDealStore();
const customerStore = useCustomerStore();
const pipelineStore = usePipelineStore();

// State
const loading = ref(false);
const error = ref<string | null>(null);
const dragging = ref(false);

// Computed properties
  const deals = computed(() => dealStore.allDeals);
  const customers = computed(() => customerStore.allCustomers);
  const pipelines = computed(() => pipelineStore.allPipelines);

  const currentPipeline = computed(() => {
    // For now, use the first pipeline - in a real app, this might come from props or route params
    return pipelines.value.length > 0 ? pipelines.value[0] : null;
  });

  const dealsByStage = computed(() => {
    const result: Record<string, Deal[]> = {};
    const current = currentPipeline.value;
    if (current) {
      current.stages?.forEach(stage => {
        result[stage.id] = deals.value.filter(deal => deal.stageId === stage.id);
      });
    }
    return result;
  });

  // Используем ref для хранения текущих сделок по стадиям
  const dealsByStageRef = ref<Record<string, Deal[]>>({});

  // Обновляем реактивный объект при изменении исходных данных
  watchEffect(() => {
    dealsByStageRef.value = { ...dealsByStage.value };
  });

// Methods
const getDealsByStage = (stageId: string) => {
  return dealsByStageRef.value[stageId] || [];
};


const getCustomerName = (customerId: string) => {
  const customer = customers.value.find(c => c.id === customerId);
  return customer ? customer.name : 'Unknown Customer';
};

const refreshData = async () => {
  loading.value = true;
  error.value = null;

  try {
    await Promise.all([
      dealStore.fetchDeals(),
      customerStore.fetchCustomers(),
      pipelineStore.fetchPipelines()
    ]);
  } catch (err: any) {
    error.value = err.message || 'Failed to load data';
    console.error('Error loading pipeline board data:', err);
  } finally {
    loading.value = false;
  }
};

const onMove = (event: any) => {
  // Разрешаем перемещение
  return true;
};

// Watcher для отслеживания изменений в массивах и обновления стадии сделок
watch(() => dealsByStageRef.value, (newVal: Record<string, Deal[]>) => {
  // Проходим по всем стадиям и обновляем стадию для каждой сделки
  Object.keys(newVal).forEach(stageId => {
    newVal[stageId]?.forEach((deal: Deal, index: number) => {
      // Если стадия сделки не совпадает с текущей стадией, обновляем
      if (deal.stageId !== stageId) {
        dealStore.updateDeal(deal.id, { stageId });
      }
    });
  });
}, { deep: true });

const onStageChange = async (event: any, stageId: string) => {
  if (event?.added) {
    // Deal was added from another stage
    const { element: deal } = event.added;
    // Update the deal's stage
    const updatedDeal = await dealStore.updateDeal(deal.id, { stageId });

    if (!updatedDeal) {
      error.value = 'Failed to update deal stage';
    }
  }
};

// Deal click handler
const onDealClick = (deal: Deal) => {
  // In a real app, this might navigate to a deal detail page
  console.log('Deal clicked:', deal);
};

// Initialize data
onMounted(() => {
  refreshData();
});
</script>

<style scoped>
@import '../styles/pipeline-board.scss';
</style>
