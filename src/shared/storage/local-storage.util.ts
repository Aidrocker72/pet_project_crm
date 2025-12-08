/**
 * Утилиты для работы с localStorage
 */

export const LOCAL_STORAGE_KEYS = {
  CUSTOMERS: 'crm_customers_data',
  DEALS: 'crm_deals_data',
  PIPELINES: 'crm_pipelines_data',
};

/**
 * Получить данные из localStorage
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage with key ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Сохранить данные в localStorage
 */
export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage with key ${key}:`, error);
  }
}

/**
 * Удалить данные из localStorage
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage with key ${key}:`, error);
  }
}

/**
 * Очистить все данные CRM из localStorage
 */
export function clearCrmData(): void {
  try {
    Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing CRM data from localStorage:', error);
  }
}
