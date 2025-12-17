import type { ICustomer } from "../ICustomer";

export interface ICustomerFormEmits {
  submit: [customer: Omit<ICustomer, 'id' | 'createdAt' | 'updatedAt'> | Partial<ICustomer>];
  cancel: [];
}
