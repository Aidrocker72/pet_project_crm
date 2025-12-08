import type { Pipeline, PipelineStage } from '@/shared';

export class PipelineModel implements Pipeline {
  id: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<Pipeline> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description;
    this.stages = data.stages || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Методы для работы с моделью
  static validate(pipeline: Pipeline): boolean {
    return !!pipeline.name && pipeline.stages.length > 0;
  }

  getStageById(stageId: string): PipelineStage | undefined {
    return this.stages.find(stage => stage.id === stageId);
  }

  getStageIndex(stageId: string): number {
    return this.stages.findIndex(stage => stage.id === stageId);
  }

  getNextStageId(currentStageId: string): string | null {
    const currentIndex = this.getStageIndex(currentStageId);
    if (currentIndex === -1 || currentIndex >= this.stages.length - 1) {
      return null;
    }
    const nextStage = this.stages[currentIndex + 1];
    return nextStage ? nextStage.id : null;
  }

  getPreviousStageId(currentStageId: string): string | null {
    const currentIndex = this.getStageIndex(currentStageId);
    if (currentIndex <= 0) {
      return null;
    }
    const previousStage = this.stages[currentIndex - 1];
    return previousStage ? previousStage.id : null;
  }

  addStage(stage: PipelineStage): void {
    this.stages.push(stage);
    this.stages.sort((a, b) => a.order - b.order);
  }

  updateStage(stageId: string, updates: Partial<PipelineStage>): void {
    const index = this.stages.findIndex(s => s.id === stageId);
    if (index !== -1) {
      this.stages[index] = {
        ...this.stages[index],
        ...updates
      } as PipelineStage;
      this.stages.sort((a, b) => a.order - b.order);
    }
  }

  removeStage(stageId: string): void {
    this.stages = this.stages.filter(stage => stage.id !== stageId);
  }
}
