import type { IPipeline } from "../IPipeline";

export interface IPipelineState {
  pipelines: IPipeline[];
  loading: boolean;
  error: string | null;
  currentPipeline: IPipeline | null;
}
