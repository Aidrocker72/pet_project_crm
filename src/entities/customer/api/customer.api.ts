import type { Customer } from '@/shared';
import { API_CONSTANTS, INITIAL_DATA } from '@/shared/constants/api.constants';
import { getFromLocalStorage, saveToLocalStorage, LOCAL_STORAGE_KEYS } from '@/shared/storage/local-storage.util';

// Моковая реализация API для Customer
// В реальном приложении здесь будет интеграция с реальным API

class CustomerApi {
  private baseUrl = '/api/customers'; // В реальном приложении заменить на реальный URL

  private readonly STORAGE_KEY = LOCAL_STORAGE_KEYS.CUSTOMERS;

  // Инициализируем данные из localStorage или используем начальные данные
  private customers: Customer[] = this.loadFromStorage();

  private loadFromStorage(): Customer[] {
    return getFromLocalStorage(this.STORAGE_KEY, [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'ABC Corp',
        position: 'CEO',
        notes: 'Important client',
        createdAt: '2023-01-15T10:30:00Z',
        updatedAt: '2023-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        company: 'XYZ Ltd',
        position: 'CTO',
        notes: 'Technical decision maker',
        createdAt: '2023-02-20T14:45:00Z',
        updatedAt: '2023-02-20T14:45:00Z'
      }
    ]);
  }

  private saveToStorage(): void {
    saveToLocalStorage(this.STORAGE_KEY, this.customers);
  }

  async getAllCustomers(): Promise<Customer[]> {
    // Возвращаем копию массива, чтобы избежать внешних изменений
    return [...this.customers];
  }

  // Метод для обновления данных в хранилище
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

    // Убедимся, что обязательные поля заполнены
    if (!newCustomer.name || !newCustomer.email) {
      throw new Error('Name and email are required');
    }

    this.customers.push(newCustomer as Customer);
    this.updateStorage(); // Сохраняем в localStorage
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
    this.updateStorage(); // Сохраняем в localStorage
    return updatedCustomer as Customer;
  }

  async deleteCustomer(id: string): Promise<void> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
      this.updateStorage(); // Сохраняем в localStorage
    }
  }
}

export const customerApi = new CustomerApi();
