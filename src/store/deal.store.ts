import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DealModel } from '@/class/models/deal.model';
import { dealApi } from '@/api/deal.api';
import type { IDealState } from '@/interfaces/store/IDealState';
import type { IDeal } from '@/interfaces/IDeal';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys';
import { getFromLocalStorage, saveToLocalStorage } from '@/utils/local-storage.util';


export const useDealStore = defineStore('deal', () => {
  const state = ref<IDealState>({
    deals: [],
    loading: false,
    error: null,
    currentDeal: null
  });

  const allDeals = computed(() => state.value.deals);
  const dealById = computed(() => (id: string) =>
    state.value.deals.find(deal => deal.id === id)
  );
  const dealsByCustomerId = computed(() => (customerId: string) =>
    state.value.deals.filter(deal => deal.customerId === customerId)
  );
  const dealsByPipelineId = computed(() => (pipelineId: string) =>
    state.value.deals.filter(deal => deal.pipelineId === pipelineId)
  );
  const dealsByStageId = computed(() => (stageId: string) =>
    state.value.deals.filter(deal => deal.stageId === stageId)
  );
  const dealCount = computed(() => state.value.deals.length);
  const isLoading = computed(() => state.value.loading);
  const error = computed(() => state.value.error);

  const fetchDeals = async (): Promise<void> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const storedDeals = getFromLocalStorage<IDeal[] | null>(LOCAL_STORAGE_KEYS.DEALS, null);
      if (storedDeals) {
        state.value.deals = storedDeals.map((d: any) => new DealModel(d));
      } else {
        const deals = await dealApi.getAllDeals();

        state.value.deals = deals.map(d => new DealModel(d));
        saveToLocalStorage(LOCAL_STORAGE_KEYS.DEALS, state.value.deals);

      }
    } catch (err: any) {
      state.value.error = err.message || 'Failed to fetch deals';
      console.error('Error fetching deals:', err);
    } finally {
      state.value.loading = false;
    }
  };

  const setDeals = (deals: IDeal[]): void => {
    state.value.deals = deals.map(d => new DealModel(d));
  };

  const fetchDealById = async (id: string): Promise<IDeal | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const deal = state.value.deals.find(el => el.id === id);
      const dealModel = new DealModel(deal);

      const existingIndex = state.value.deals.findIndex(d => d.id === id);
      if (existingIndex !== -1) {
        state.value.deals[existingIndex] = dealModel;
      } else {
        state.value.deals.push(dealModel);
      }

      state.value.currentDeal = dealModel;
      return dealModel;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to fetch deal';
      console.error(`Error fetching deal with id ${id}:`, err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  const createDeal = async (dealData: Omit<IDeal, 'id' | 'createdAt' | 'updatedAt'> | Partial<IDeal>): Promise<IDeal | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      if (!dealData.title || !dealData.customerId || !dealData.pipelineId || !dealData.stageId) {
        throw new Error('Title, customer, pipeline, and stage are required');
      }

      const validDealData = {
        title: dealData.title,
        description: dealData.description,
        customerId: dealData.customerId,
        pipelineId: dealData.pipelineId,
        stageId: dealData.stageId,
        value: dealData.value || 0,
        probability: dealData.probability || 0,
        closeDate: dealData.closeDate,
        status: dealData.status || 'open'
      } as Omit<IDeal, 'id' | 'createdAt' | 'updatedAt'>;

      const newDeal = {
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: undefined,
        closeDate: undefined,
        ...validDealData
      };

      const dealModel = new DealModel(newDeal);
      state.value.deals.push(dealModel);

      saveToLocalStorage(LOCAL_STORAGE_KEYS.DEALS, state.value.deals);
      return dealModel;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to create deal';
      console.error('Error creating deal:', err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  const updateDeal = async (id: string, dealData: Partial<IDeal>): Promise<IDeal | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const index = state.value.deals.findIndex(d => d.id === id);
      const existingDeal = state.value.deals[index];

      const updatedDeal = {
        ...existingDeal,
        ...dealData,
        id: existingDeal!.id,
        title: dealData.title ?? existingDeal!.title,
        customerId: dealData.customerId ?? existingDeal!.customerId,
        pipelineId: dealData.pipelineId ?? existingDeal!.pipelineId,
        stageId: dealData.stageId ?? existingDeal!.stageId,
        createdAt: existingDeal!.createdAt,
        updatedAt: new Date().toISOString()
      };

      const dealModel = new DealModel(updatedDeal);


      if (index !== -1) {
        state.value.deals[index] = dealModel;
      }

      if (state.value.currentDeal?.id === id) {
        state.value.currentDeal = dealModel;
      }

      saveToLocalStorage(LOCAL_STORAGE_KEYS.DEALS, state.value.deals);

      return dealModel;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to update deal';
      console.error(`Error updating deal with id ${id}:`, err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  const deleteDeal = async (id: string): Promise<boolean> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      state.value.deals = state.value.deals.filter(d => d.id !== id);

      if (state.value.currentDeal?.id === id) {
        state.value.currentDeal = null;
      }

      saveToLocalStorage(LOCAL_STORAGE_KEYS.DEALS, state.value.deals);

      return true;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to delete deal';
      console.error(`Error deleting deal with id ${id}:`, err);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  const setCurrentDeal = (deal: IDeal | null) => {
    state.value.currentDeal = deal;
  };

  return {
    ...state.value,

    allDeals,
    dealById,
    dealsByCustomerId,
    dealsByPipelineId,
    dealsByStageId,
    dealCount,
    isLoading,
    error,

    fetchDeals,
    fetchDealById,
    createDeal,
    updateDeal,
    deleteDeal,
    setCurrentDeal,
    setDeals,
  };
});
