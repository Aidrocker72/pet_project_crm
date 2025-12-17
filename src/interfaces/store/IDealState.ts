import type { IDeal } from "../IDeal";

export interface IDealState {
  deals: IDeal[];
  loading: boolean;
  error: string | null;
  currentDeal: IDeal | null;
}
