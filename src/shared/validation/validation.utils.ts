import type { Customer, Deal, Pipeline } from '@/shared';
import { API_CONSTANTS } from '@/shared/constants/api.constants';

/**
 * Утилиты для валидации данных
 */
export const validationUtils = {
  /**
   * Валидация данных клиента
   */
  validateCustomer(data: Partial<Customer>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push(API_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD);
    }

    if (!data.email || data.email.trim().length === 0) {
      errors.push(API_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD);
    } else if (!API_CONSTANTS.PATTERNS.EMAIL.test(data.email)) {
      errors.push(API_CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL);
    }

    if (data.phone && data.phone.trim().length > 0 && !API_CONSTANTS.PATTERNS.PHONE.test(data.phone)) {
      errors.push(API_CONSTANTS.ERROR_MESSAGES.INVALID_PHONE);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Валидация данных сделки
   */
  validateDeal(data: Partial<Deal>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push(API_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD);
    }

    if (!data.customerId || data.customerId.trim().length === 0) {
      errors.push('Customer ID is required');
    }

    if (!data.pipelineId || data.pipelineId.trim().length === 0) {
      errors.push('Pipeline ID is required');
    }

    if (!data.stageId || data.stageId.trim().length === 0) {
      errors.push('Stage ID is required');
    }

    if (typeof data.value === 'number' && data.value < 0) {
      errors.push('Value must be a non-negative number');
    }

    if (typeof data.probability === 'number' && (data.probability < 0 || data.probability > 100)) {
      errors.push('Probability must be between 0 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Валидация данных воронки
   */
  validatePipeline(data: Partial<Pipeline>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push(API_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD);
    }

    if (data.stages) {
      for (let i = 0; i < data.stages.length; i++) {
        const stage = data.stages[i];
        if (stage && (!stage.name || stage.name.trim().length === 0)) {
          errors.push(`Stage ${i + 1} name is required`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Проверка email
   */
  isEmailValid(email: string): boolean {
    return API_CONSTANTS.PATTERNS.EMAIL.test(email);
  },

  /**
   * Проверка телефона
   */
  isPhoneValid(phone: string): boolean {
    return API_CONSTANTS.PATTERNS.PHONE.test(phone);
  },

  /**
   * Проверка URL
   */
  isUrlValid(url: string): boolean {
    return API_CONSTANTS.PATTERNS.URL.test(url);
  },

  /**
   * Проверка минимальной длины строки
   */
  hasMinLength(str: string, min: number): boolean {
    return str.length >= min;
  },

  /**
   * Проверка максимальной длины строки
   */
  hasMaxLength(str: string, max: number): boolean {
    return str.length <= max;
  }
};
