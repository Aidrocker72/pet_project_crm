import type { Pipeline } from '@/shared';
import { INITIAL_DATA,  } from '@/shared/constants/api.constants';
import { getFromLocalStorage, saveToLocalStorage, LOCAL_STORAGE_KEYS } from '@/shared/storage/local-storage.util';

// Моковая реализация API для Pipeline
// В реальном приложении здесь будет интеграция с реальным API

class PipelineApi {
  private baseUrl = '/api/pipelines'; // В реальном приложении заменить на реальный URL

  private readonly STORAGE_KEY = LOCAL_STORAGE_KEYS.PIPELINES;

  // Инициализируем данные из localStorage или используем начальные данные
  private pipelines: Pipeline[] = this.loadFromStorage();

  private loadFromStorage(): Pipeline[] {
    return getFromLocalStorage(this.STORAGE_KEY, INITIAL_DATA.PIPELINES);
  }

  private saveToStorage(): void {
    saveToLocalStorage(this.STORAGE_KEY, this.pipelines);
  }

  async getAllPipelines(): Promise<Pipeline[]> {
    // Возвращаем копию массива, чтобы избежать внешних изменений
    return [...this.pipelines];
  }

  async getPipelineById(id: string): Promise<Pipeline> {
    const pipeline = this.pipelines.find(p => p.id === id);

    if (!pipeline) {
      throw new Error(`Pipeline with id ${id} not found`);
    }

    return pipeline;
  }

  async createPipeline(pipeline: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'> | Partial<Pipeline>): Promise<Pipeline> {
    const newPipeline = {
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: '',
      description: undefined,
      stages: [],
      ...pipeline
    };

    // Убедимся, что обязательные поля заполнены
    if (!newPipeline.name) {
      throw new Error('Name is required');
    }

    this.pipelines.push(newPipeline as Pipeline);
    this.saveToStorage(); // Сохраняем в localStorage
    return newPipeline as Pipeline;
  }

  async updatePipeline(id: string, pipeline: Partial<Pipeline>): Promise<Pipeline> {
    const index = this.pipelines.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Pipeline with id ${id} not found`);
    }

    const existingPipeline = this.pipelines[index];
    if (!existingPipeline) {
      throw new Error(`Pipeline with id ${id} not found`);
    }

    const updatedPipeline = {
      ...existingPipeline,
      ...pipeline,
      id: existingPipeline.id,
      name: pipeline.name ?? existingPipeline.name,
      createdAt: existingPipeline.createdAt,
      updatedAt: new Date().toISOString()
    };

    this.pipelines[index] = updatedPipeline as Pipeline;
    this.saveToStorage(); // Сохраняем в localStorage
    return updatedPipeline as Pipeline;
  }

  async deletePipeline(id: string): Promise<void> {
    const index = this.pipelines.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pipelines.splice(index, 1);
      this.saveToStorage(); // Сохраняем изменения в localStorage
    }
  }
}

export const pipelineApi = new PipelineApi();
