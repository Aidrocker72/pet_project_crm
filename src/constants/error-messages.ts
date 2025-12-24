export const CUSTOMER_ERROR_MESSAGES = {
  NAME_REQUIRED: 'Имя обязательно',
  NAME_MIN_LENGTH: 'Имя должно содержать не менее 2 символов',
  EMAIL_REQUIRED: 'Email обязателен',
  EMAIL_INVALID: 'Пожалуйста, введите действительный email',
  PHONE_INVALID: 'Пожалуйста, введите действительный номер телефона'
};

export const DEAL_ERROR_MESSAGES = {
  TITLE_REQUIRED: 'Название обязательно',
  TITLE_MIN_LENGTH: 'Название должно содержать не менее 2 символов',
  CUSTOMER_REQUIRED: 'Клиент обязателен',
  PIPELINE_REQUIRED: 'Воронка обязательна',
  STAGE_REQUIRED: 'Этап обязателен',
  VALUE_REQUIRED: 'Сумма обязательна',
  VALUE_POSITIVE: 'Сумма должна быть положительной',
  PROBABILITY_REQUIRED: 'Вероятность обязательна',
  PROBABILITY_MIN: 'Вероятность не может быть меньше 0',
  PROBABILITY_MAX: 'Вероятность не может быть больше 100'
} as const;
