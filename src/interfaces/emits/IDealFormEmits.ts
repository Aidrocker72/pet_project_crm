import type { IDeal } from "@/interfaces/IDeal";

export interface IDealFormEmits {
  submit: [deal: Omit<IDeal, 'id' | 'createdAt' | 'updatedAt'> | Partial<IDeal>];
  cancel: [];
}
