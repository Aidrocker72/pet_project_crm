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
import { useDealStore } from '@/store/deal.store';
import { useCustomerStore } from '@/store/customer.store';
import { usePipelineStore } from '@/store/pipeline.store';
import draggable from 'vuedraggable';
import type { IDeal } from '@/interfaces/IDeal';

const dealStore = useDealStore();
const customerStore = useCustomerStore();
const pipelineStore = usePipelineStore();

const loading = ref(false);
const error = ref<string | null>(null);
const dragging = ref(false);

  const deals = computed(() => dealStore.allDeals);
  const customers = computed(() => customerStore.allCustomers);
  const pipelines = computed(() => pipelineStore.allPipelines);

  const currentPipeline = computed(() => {
    return pipelines.value.length > 0 ? pipelines.value[0] : null;
  });

  const dealsByStage = computed(() => {
    const result: Record<string, IDeal[]> = {};
    const current = currentPipeline.value;
    if (current) {
      current.stages?.forEach(stage => {
        result[stage.id] = deals.value.filter(deal => deal.stageId === stage.id);
      });
    }
    return result;
  });

  const dealsByStageRef = ref<Record<string, IDeal[]>>({});

  watchEffect(() => {
    dealsByStageRef.value = { ...dealsByStage.value };
  });

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

const onMove = () => {
  return true;
};

watch(() => dealsByStageRef.value, (newVal: Record<string, IDeal[]>) => {
  Object.keys(newVal).forEach(stageId => {
    newVal[stageId]?.forEach((deal: IDeal, index: number) => {
      if (deal.stageId !== stageId) {
        dealStore.updateDeal(deal.id, { stageId });
      }
    });
  });
}, { deep: true });

const onDealClick = (deal: IDeal) => {
  console.log('Deal clicked:', deal);
};

onMounted(() => {
  refreshData();
});
</script>
