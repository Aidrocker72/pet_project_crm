import { INITIAL_DATA,  } from '@/constants/initial-data';
import { getFromLocalStorage, saveToLocalStorage } from '@/utils/local-storage.util';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys';
import type { IPipeline } from '@/interfaces/IPipeline';

class PipelineApi {
  private baseUrl = '/api/pipelines';

  private readonly STORAGE_KEY = LOCAL_STORAGE_KEYS.PIPELINES;

  private pipelines: IPipeline[] = this.loadFromStorage();

  private loadFromStorage(): IPipeline[] {
    return getFromLocalStorage(this.STORAGE_KEY, INITIAL_DATA.PIPELINES);
  }

  private saveToStorage(): void {
    saveToLocalStorage(this.STORAGE_KEY, this.pipelines);
  }

  async getAllPipelines(): Promise<IPipeline[]> {
    return [...this.pipelines];
  }

  async getPipelineById(id: string): Promise<IPipeline> {
    const pipeline = this.pipelines.find(p => p.id === id);

    if (!pipeline) {
      throw new Error(`Pipeline with id ${id} not found`);
    }

    return pipeline;
  }

  async createPipeline(pipeline: Omit<IPipeline, 'id' | 'createdAt' | 'updatedAt'> | Partial<IPipeline>): Promise<IPipeline> {
    const newPipeline = {
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: '',
      description: undefined,
      stages: [],
      ...pipeline
    };

    if (!newPipeline.name) {
      throw new Error('Name is required');
    }

    this.pipelines.push(newPipeline as IPipeline);
    this.saveToStorage();
    return newPipeline as IPipeline;
  }

  async updatePipeline(id: string, pipeline: Partial<IPipeline>): Promise<IPipeline> {
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

    this.pipelines[index] = updatedPipeline as IPipeline;
    this.saveToStorage();
    return updatedPipeline as IPipeline;
  }

  async deletePipeline(id: string): Promise<void> {
    const index = this.pipelines.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pipelines.splice(index, 1);
      this.saveToStorage();
    }
  }
}

export const pipelineApi = new PipelineApi();
