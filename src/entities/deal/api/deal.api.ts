import type { Deal } from '@/shared';
import { API_CONSTANTS } from '@/constants/api.constants';
import { getFromLocalStorage, saveToLocalStorage, LOCAL_STORAGE_KEYS } from '@/shared/storage/local-storage.util';

// Моковая реализация API для Deal
// В реальном приложении здесь будет интеграция с реальным API

class DealApi {
  private baseUrl = '/api/deals'; // В реальном приложении заменить на реальный URL

  private readonly STORAGE_KEY = LOCAL_STORAGE_KEYS.DEALS;

  // Инициализируем данные из localStorage или используем начальные данные
  private deals: Deal[] = this.loadFromStorage();

  private loadFromStorage(): Deal[] {
    return getFromLocalStorage(this.STORAGE_KEY, [
      {
        id: '1',
        title: 'Enterprise Software License',
        description: 'Large enterprise software package',
        customerId: '1',
        pipelineId: '1',
        stageId: '1',
        value: 50000,
        probability: 75,
        closeDate: '2023-12-15',
        status: 'open',
        createdAt: '2023-09-10T09:15:00Z',
        updatedAt: '2023-09-10T09:15:00Z'
      },
      {
        id: '2',
        title: 'Consulting Services',
        description: 'IT consulting for digital transformation',
        customerId: '2',
        pipelineId: '1',
        stageId: '2',
        value: 25000,
        probability: 60,
        closeDate: '2023-11-30',
        status: 'open',
        createdAt: '2023-08-22T14:30:00Z',
        updatedAt: '2023-08-22T14:30:00Z'
      }
    ]) as Deal[];
  }

  private saveToStorage(): void {
    saveToLocalStorage(this.STORAGE_KEY, this.deals);
  }

  private updateStorage(): void {
    this.saveToStorage();
  }

  async getAllDeals(): Promise<Deal[]> {
    // Возвращаем копию массива, чтобы избежать внешних изменений
    return [...this.deals];
  }

  async getDealById(id: string): Promise<Deal> {
    const deal = this.deals.find(d => d.id === id);

    if (!deal) {
      throw new Error(`Deal with id ${id} not found`);
    }

    return deal;
  }

  async createDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> | Partial<Deal>): Promise<Deal> {
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

    // Убедимся, что обязательные поля заполнены
    if (!newDeal.title || !newDeal.customerId || !newDeal.pipelineId || !newDeal.stageId) {
      throw new Error('Title, customer, pipeline, and stage are required');
    }

    this.deals.push(newDeal as Deal);
    this.saveToStorage(); // Сохраняем в localStorage
    return newDeal as Deal;
  }

  async updateDeal(id: string, deal: Partial<Deal>): Promise<Deal> {
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

    this.deals[index] = updatedDeal as Deal;
    this.saveToStorage(); // Сохраняем в localStorage
    return updatedDeal as Deal;
  }

  async deleteDeal(id: string): Promise<void> {
    const index = this.deals.findIndex(d => d.id === id);
    if (index !== -1) {
      this.deals.splice(index, 1);
      this.saveToStorage(); // Сохраняем изменения в localStorage
    }
  }
}

export const dealApi = new DealApi();
