import type { ICustomer } from "@/interfaces/ICustomer";

export class CustomerModel implements ICustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<ICustomer> = {}) {
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

  static validate(customer: ICustomer): boolean {
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
