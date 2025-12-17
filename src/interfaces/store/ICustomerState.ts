import type { ICustomer } from "../ICustomer";

export interface ICustomerState {
  customers: ICustomer[];
  loading: boolean;
  error: string | null;
  currentCustomer: ICustomer | null;
}
