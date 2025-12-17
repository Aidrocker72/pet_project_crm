import type { IDeal } from "@/interfaces/IDeal";

export class DealModel implements IDeal {
  id: string;
  title: string;
  description?: string;
  customerId: string;
  pipelineId: string;
  stageId: string;
  value: number;
  probability: number;
  closeDate?: string;
  status: 'open' | 'won' | 'lost';
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<IDeal> = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description;
    this.customerId = data.customerId || '';
    this.pipelineId = data.pipelineId || '';
    this.stageId = data.stageId || '';
    this.value = data.value || 0;
    this.probability = data.probability || 0;
    this.closeDate = data.closeDate;
    this.status = data.status || 'open';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static validate(deal: IDeal): boolean {
    return !!deal.title && !!deal.customerId && !!deal.pipelineId && !!deal.stageId;
  }

  getExpectedValue(): number {
    return this.value * (this.probability / 100);
  }

  getStatusColor(): string {
    switch (this.status) {
      case 'won': return 'green';
      case 'lost': return 'red';
      default: return 'blue';
    }
  }

  getDisplayValue(): string {
    return `$${this.value.toLocaleString()}`;
  }

  getExpectedValueDisplay(): string {
    return `$${this.getExpectedValue().toLocaleString()}`;
  }

  getProbabilityLabel(): string {
    return `${this.probability}%`;
  }
}
