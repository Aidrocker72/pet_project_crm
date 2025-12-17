import { INITIAL_DATA } from '@/constants/initial-data';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys';
import type { ICustomer } from '@/interfaces/ICustomer';
import { getFromLocalStorage, saveToLocalStorage } from '@/utils/local-storage.util';

class CustomerApi {

  private readonly STORAGE_KEY = LOCAL_STORAGE_KEYS.CUSTOMERS;

  private customers: ICustomer[] = this.loadFromStorage();

  private loadFromStorage(): ICustomer[] {
    return getFromLocalStorage(this.STORAGE_KEY, INITIAL_DATA.CUSTOMERS);
  }

  private saveToStorage(): void {
    saveToLocalStorage(this.STORAGE_KEY, this.customers);
  }

  async getAllCustomers(): Promise<ICustomer[]> {
    return [...this.customers];
  }

  private updateStorage(): void {
    this.saveToStorage();
  }

  async getCustomerById(id: string): Promise<ICustomer> {
    const customer = this.customers.find(c => c.id === id);

    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async createCustomer(customer: Omit<ICustomer, 'id' | 'createdAt' | 'updatedAt'> | Partial<ICustomer>): Promise<ICustomer> {
    const newCustomer = {
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: '',
      email: '',
      ...customer
    };

    if (!newCustomer.name || !newCustomer.email) {
      throw new Error('Name and email are required');
    }

    this.customers.push(newCustomer as ICustomer);
    this.updateStorage();
    return newCustomer as ICustomer;
  }

  async updateCustomer(id: string, customer: Partial<ICustomer>): Promise<ICustomer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Customer with id ${id} not found`);
    }

    const existingCustomer = this.customers[index];
    if (!existingCustomer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    const updatedCustomer = {
      ...existingCustomer,
      ...customer,
      id: existingCustomer.id,
      name: customer.name ?? existingCustomer.name,
      email: customer.email ?? existingCustomer.email,
      createdAt: existingCustomer.createdAt,
      updatedAt: new Date().toISOString()
    };

    this.customers[index] = updatedCustomer as ICustomer;
    this.updateStorage();
    return updatedCustomer as ICustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
      this.updateStorage();
    }
  }
}

export const customerApi = new CustomerApi();
