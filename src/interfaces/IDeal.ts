import type { IBaseEntity } from "./IBaseEntity";

export interface IDeal extends IBaseEntity {
  title: string;
  description?: string;
  customerId: string;
  pipelineId: string;
  stageId: string;
  value: number; // Стоимость сделки
  probability: number; // Вероятность закрытия (%)
  closeDate?: string; // Предполагаемая дата закрытия
  status: 'open' | 'won' | 'lost';
}
