import type { IBaseEntity } from "./IBaseEntity";

export interface ICustomer extends IBaseEntity {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
}
