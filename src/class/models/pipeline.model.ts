import type { IPipeline } from '@/interfaces/IPipeline';
import type { IPipelineStage } from '@/interfaces/IPipelineStage';

export class PipelineModel implements IPipeline {
  id: string;
  name: string;
  description?: string;
  stages: IPipelineStage[];
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<IPipeline> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description;
    this.stages = data.stages || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static validate(pipeline: IPipeline): boolean {
    return !!pipeline.name && pipeline.stages.length > 0;
  }

  getStageById(stageId: string): IPipelineStage | undefined {
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

  addStage(stage: IPipelineStage): void {
    this.stages.push(stage);
    this.stages.sort((a, b) => a.order - b.order);
  }

  updateStage(stageId: string, updates: Partial<IPipelineStage>): void {
    const index = this.stages.findIndex(s => s.id === stageId);
    if (index !== -1) {
      this.stages[index] = {
        ...this.stages[index],
        ...updates
      } as IPipelineStage;
      this.stages.sort((a, b) => a.order - b.order);
    }
  }

  removeStage(stageId: string): void {
    this.stages = this.stages.filter(stage => stage.id !== stageId);
  }
}
