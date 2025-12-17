import type { IBaseEntity } from "./IBaseEntity";
import type { IPipelineStage } from "./IPipelineStage";

export interface IPipeline extends IBaseEntity {
  name: string;
  description?: string;
  stages: IPipelineStage[];
}
