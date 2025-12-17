import { getFromLocalStorage, saveToLocalStorage } from '@/shared/storage/local-storage.util';
import { INITIAL_DATA } from '@/constants/initial-data';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys';
import type { IDeal } from '@/interfaces/IDeal';

class DealApi {
  private baseUrl = '/api/deals';

  private readonly STORAGE_KEY = LOCAL_STORAGE_KEYS.DEALS;

  private deals: IDeal[] = this.loadFromStorage();

  private loadFromStorage(): IDeal[] {
    return getFromLocalStorage(this.STORAGE_KEY, INITIAL_DATA.DEALS) as IDeal[];
  }

  private saveToStorage(): void {
    saveToLocalStorage(this.STORAGE_KEY, this.deals);
  }

  private updateStorage(): void {
    this.saveToStorage();
  }

  async getAllDeals(): Promise<IDeal[]> {
    return [...this.deals];
  }

  async getDealById(id: string): Promise<IDeal> {
    const deal = this.deals.find(d => d.id === id);

    if (!deal) {
      throw new Error(`Deal with id ${id} not found`);
    }

    return deal;
  }

  async createDeal(deal: Omit<IDeal, 'id' | 'createdAt' | 'updatedAt'> | Partial<IDeal>): Promise<IDeal> {
    const newDeal = {
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: '',
      description: undefined,
      customerId: '',
      pipelineId: '',
      stageId: '',
      value: 0,
      probability: 0,
      closeDate: undefined,
      status: 'open',
      ...deal
    };

    if (!newDeal.title || !newDeal.customerId || !newDeal.pipelineId || !newDeal.stageId) {
      throw new Error('Title, customer, pipeline, and stage are required');
    }

    this.deals.push(newDeal as IDeal);
    this.saveToStorage();
    return newDeal as IDeal;
  }

  async updateDeal(id: string, deal: Partial<IDeal>): Promise<IDeal> {
    const index = this.deals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Deal with id ${id} not found`);
    }

    const existingDeal = this.deals[index];
    if (!existingDeal) {
      throw new Error(`Deal with id ${id} not found`);
    }

    const updatedDeal = {
      ...existingDeal,
      ...deal,
      id: existingDeal.id,
      title: deal.title ?? existingDeal.title,
      customerId: deal.customerId ?? existingDeal.customerId,
      pipelineId: deal.pipelineId ?? existingDeal.pipelineId,
      stageId: deal.stageId ?? existingDeal.stageId,
      createdAt: existingDeal.createdAt,
      updatedAt: new Date().toISOString()
    };

    this.deals[index] = updatedDeal as IDeal;
    this.saveToStorage();
    return updatedDeal as IDeal;
  }

  async deleteDeal(id: string): Promise<void> {
    const index = this.deals.findIndex(d => d.id === id);
    if (index !== -1) {
      this.deals.splice(index, 1);
      this.saveToStorage();
    }
  }
}

export const dealApi = new DealApi();
