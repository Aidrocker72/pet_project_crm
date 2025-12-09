// Экспорт типов для корректного разрешения модуля
export type * from './types';

// Экспорт констант и утилит
export { API_CONSTANTS } from '../constants/api.constants';
export { validationUtils } from './validation/validation.utils';

// Экспорт компонентов
export { default as Icon } from '@/shared/ui/Icon.vue';
