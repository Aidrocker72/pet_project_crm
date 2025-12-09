import type { Customer } from '@/shared';

export class CustomerModel implements Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<Customer> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone;
    this.company = data.company;
    this.position = data.position;
    this.notes = data.notes;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static validate(customer: Customer): boolean {
    return !!customer.name && !!customer.email;
  }

  getDisplayName(): string {
    return this.name || this.company || 'Unnamed Customer';
  }

  getFullContactInfo(): string {
    const parts = [this.name, this.position, this.company].filter(Boolean);
    return parts.join(', ') || 'No contact info';
  }
}
