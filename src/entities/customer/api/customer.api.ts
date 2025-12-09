import { INITIAL_DATA } from '@/constants/initial-data';
import type { Customer } from '@/shared';
import { getFromLocalStorage, saveToLocalStorage, LOCAL_STORAGE_KEYS } from '@/shared/storage/local-storage.util';

class CustomerApi {

  private readonly STORAGE_KEY = LOCAL_STORAGE_KEYS.CUSTOMERS;

  private customers: Customer[] = this.loadFromStorage();

  private loadFromStorage(): Customer[] {
    return getFromLocalStorage(this.STORAGE_KEY, INITIAL_DATA.CUSTOMERS);
  }

  private saveToStorage(): void {
    saveToLocalStorage(this.STORAGE_KEY, this.customers);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return [...this.customers];
  }

  private updateStorage(): void {
    this.saveToStorage();
  }

  async getCustomerById(id: string): Promise<Customer> {
    const customer = this.customers.find(c => c.id === id);

    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> | Partial<Customer>): Promise<Customer> {
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

    this.customers.push(newCustomer as Customer);
    this.updateStorage();
    return newCustomer as Customer;
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
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

    this.customers[index] = updatedCustomer as Customer;
    this.updateStorage();
    return updatedCustomer as Customer;
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
