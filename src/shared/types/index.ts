export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
}

export interface Pipeline extends BaseEntity {
  name: string;
  description?: string;
  stages: PipelineStage[];
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
}

export interface Deal extends BaseEntity {
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Пустой экспорт для обеспечения корректного разрешения модуля
export {};
