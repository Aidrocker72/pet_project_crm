import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CustomerModel } from '@/class/models/customer.model';
import { customerApi } from '@/api/customer.api';
import type { ICustomerState } from '@/interfaces/store/ICustomerState';
import type { ICustomer } from '@/interfaces/ICustomer';

export const useCustomerStore = defineStore('customer', () => {
  const state = ref<ICustomerState>({
    customers: [],
    loading: false,
    error: null,
    currentCustomer: null
  });

  const allCustomers = computed(() => state.value.customers);
  const customerById = computed(() => (id: string) =>
    state.value.customers.find(customer => customer.id === id)
  );
  const customerCount = computed(() => state.value.customers.length);
  const isLoading = computed(() => state.value.loading);
  const error = computed(() => state.value.error);

  const fetchCustomers = async (): Promise<void> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const storedCustomers = localStorage.getItem('crm_customers_data');
      if (storedCustomers) {
        state.value.customers = JSON.parse(storedCustomers).map((c: any) => new CustomerModel(c));
      } else {
        const customers = await customerApi.getAllCustomers();
        state.value.customers = customers.map(c => new CustomerModel(c));
        localStorage.setItem('crm_customers_data', JSON.stringify(state.value.customers));
      }
    } catch (err: any) {
      state.value.error = err.message || 'Failed to fetch customers';
      console.error('Error fetching customers:', err);
    } finally {
      state.value.loading = false;
    }
  };

  const fetchCustomerById = async (id: string): Promise<ICustomer | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const customer = await customerApi.getCustomerById(id);
      const customerModel = new CustomerModel(customer);

      const existingIndex = state.value.customers.findIndex(c => c.id === id);
      if (existingIndex !== -1) {
        state.value.customers[existingIndex] = customerModel;
      } else {
        state.value.customers.push(customerModel);
      }

      state.value.currentCustomer = customerModel;
      return customerModel;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to fetch customer';
      console.error(`Error fetching customer with id ${id}:`, err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  const createCustomer = async (customerData: Omit<ICustomer, 'id' | 'createdAt' | 'updatedAt'> | Partial<ICustomer>): Promise<ICustomer | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      if (!customerData.name || !customerData.email) {
        throw new Error('Name and email are required');
      }

      const validCustomerData = {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        company: customerData.company,
        position: customerData.position,
        notes: customerData.notes
      } as Omit<ICustomer, 'id' | 'createdAt' | 'updatedAt'>;

      const createdCustomer = await customerApi.createCustomer(validCustomerData);
      const customerModel = new CustomerModel(createdCustomer);
      state.value.customers.push(customerModel);

      localStorage.setItem('crm_customers_data', JSON.stringify(state.value.customers));

      return customerModel;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to create customer';
      console.error('Error creating customer:', err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<ICustomer>): Promise<ICustomer | null> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const updatedCustomer = await customerApi.updateCustomer(id, customerData);
      const customerModel = new CustomerModel(updatedCustomer);

      const index = state.value.customers.findIndex(c => c.id === id);
      if (index !== -1) {
        state.value.customers[index] = customerModel;
      }

      if (state.value.currentCustomer?.id === id) {
        state.value.currentCustomer = customerModel;
      }

      localStorage.setItem('crm_customers_data', JSON.stringify(state.value.customers));

      return customerModel;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to update customer';
      console.error(`Error updating customer with id ${id}:`, err);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  const deleteCustomer = async (id: string): Promise<boolean> => {
    state.value.loading = true;
    state.value.error = null;

    try {
      await customerApi.deleteCustomer(id);

      state.value.customers = state.value.customers.filter(c => c.id !== id);

      if (state.value.currentCustomer?.id === id) {
        state.value.currentCustomer = null;
      }

      localStorage.setItem('crm_customers_data', JSON.stringify(state.value.customers));

      return true;
    } catch (err: any) {
      state.value.error = err.message || 'Failed to delete customer';
      console.error(`Error deleting customer with id ${id}:`, err);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  const setCurrentCustomer = (customer: ICustomer | null) => {
    state.value.currentCustomer = customer;
  };

  return {
    ...state.value,

    allCustomers,
    customerById,
    customerCount,
    isLoading,
    error,

    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    setCurrentCustomer
  };
});
