import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Pipeline } from '@/shared';
import { PipelineModel } from '@/entities/pipeline/model/pipeline.model';
import { pipelineApi } from '@/entities/pipeline/api/pipeline.api';

interface PipelineState {
  pipelines: Pipeline[];
  loading: boolean;
  error: string | null;
  currentPipeline: Pipeline | null;
}

export const usePipelineStore = defineStore('pipeline', () => {
  const state = ref<PipelineState>({
    pipelines: [],
    loading: false,
    error: null,
    currentPipeline: null
  });

  // Getters
  const allPipelines = computed(() => state.value.pipelines);
  const pipelineById = computed(() => (id: string) =>
    state.value.pipelines.find(pipeline => pipeline.id === id)
  );
  const pipelineCount = computed(() => state.value.pipelines.length);
  const isLoading = computed(() => state.value.loading);
  const error = computed(() => state.value.error);

  // Actions
  const fetchPipelines = async (): Promise<void> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      // Сначала попробуем загрузить данные из localStorage
      const storedPipelines = localStorage.getItem('crm_pipelines_data');
      if (storedPipelines) {
        state.value.pipelines = JSON.parse(storedPipelines).map((p: any) => new PipelineModel(p));
      } else {
        // Если данных нет в localStorage, загружаем с сервера
        const pipelines = await pipelineApi.getAllPipelines();
        state.value.pipelines = pipelines.map(p => new PipelineModel(p));
        // Сохраняем в localStorage
        localStorage.setItem('crm_pipelines_data', JSON.stringify(state.value.pipelines));
      }
    } catch (err: any) {
      state.value.error = err.message || 'Failed to fetch pipelines';
      console.error('Error fetching pipelines:', err);
    } finally {
      state.value.loading = false;
    }
  };

  const fetchPipelineById = async (id: string): Promise<Pipeline | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const pipeline = await pipelineApi.getPipelineById(id);
      const pipelineModel = new PipelineModel(pipeline);

      // Update in local state if exists
      const existingIndex = state.value.pipelines.findIndex(p => p.id === id);
      if (existingIndex !== -1) {
        state.value.pipelines[existingIndex] = pipelineModel;
      } else {
        state.value.pipelines.push(pipelineModel);
      }

      state.value.currentPipeline = pipelineModel;
      return pipelineModel;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to fetch pipeline';
      console.error(`Error fetching pipeline with id ${id}:`, err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  const createPipeline = async (pipelineData: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'> | Partial<Pipeline>): Promise<Pipeline | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      // Проверяем, что обязательные поля присутствуют
      if (!pipelineData.name) {
        throw new Error('Name is required');
      }

      const validPipelineData = {
        name: pipelineData.name,
        description: pipelineData.description,
        stages: pipelineData.stages || []
      } as Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>;

      const createdPipeline = await pipelineApi.createPipeline(validPipelineData);
      const pipelineModel = new PipelineModel(createdPipeline);
      state.value.pipelines.push(pipelineModel);

      // Сохраняем обновленный список в localStorage
      localStorage.setItem('crm_pipelines_data', JSON.stringify(state.value.pipelines));

      return pipelineModel;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to create pipeline';
      console.error('Error creating pipeline:', err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  const updatePipeline = async (id: string, pipelineData: Partial<Pipeline>): Promise<Pipeline | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const updatedPipeline = await pipelineApi.updatePipeline(id, pipelineData);
      const pipelineModel = new PipelineModel(updatedPipeline);

      const index = state.value.pipelines.findIndex(p => p.id === id);
      if (index !== -1) {
        state.value.pipelines[index] = pipelineModel;
      }

      if (state.value.currentPipeline?.id === id) {
        state.value.currentPipeline = pipelineModel;
      }

      // Сохраняем обновленный список в localStorage
      localStorage.setItem('crm_pipelines_data', JSON.stringify(state.value.pipelines));

      return pipelineModel;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to update pipeline';
      console.error(`Error updating pipeline with id ${id}:`, err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  const deletePipeline = async (id: string): Promise<boolean> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      await pipelineApi.deletePipeline(id);

      state.value.pipelines = state.value.pipelines.filter(p => p.id !== id);

      if (state.value.currentPipeline?.id === id) {
        state.value.currentPipeline = null;
      }

      // Сохраняем обновленный список в localStorage
      localStorage.setItem('crm_pipelines_data', JSON.stringify(state.value.pipelines));

      return true;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to delete pipeline';
      console.error(`Error deleting pipeline with id ${id}:`, err);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  const setCurrentPipeline = (pipeline: Pipeline | null) => {
    state.value.currentPipeline = pipeline;
  };

  return {
    // State
    ...state.value,

    // Getters
    allPipelines,
    pipelineById,
    pipelineCount,
    isLoading,
    error,

    // Actions
    fetchPipelines,
    fetchPipelineById,
    createPipeline,
    updatePipeline,
    deletePipeline,
    setCurrentPipeline
  };
});
