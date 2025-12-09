export const API_CONSTANTS = {
  CUSTOMER_STORAGE_KEY: 'crm_customers_data',
  DEAL_STORAGE_KEY: 'crm_deals_data',
  PIPELINE_STORAGE_KEY: 'crm_pipelines_data',

  DEFAULT_PAGINATION_LIMIT: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },

  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s\-\(\)]+$/,
    URL: /^https?:\/\/.+$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    NAME: /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/,
  },

  ERROR_MESSAGES: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    MIN_LENGTH: (min: number) => `Minimum length is ${min} characters`,
    MAX_LENGTH: (max: number) => `Maximum length is ${max} characters`,
    INVALID_VALUE: 'Invalid value provided'
  }
};

export const INITIAL_DATA = {
  CUSTOMERS: [
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
  ],
  DEALS: [
    {
      id: '1',
      title: 'Enterprise Software License',
      description: 'Large enterprise software package',
      customerId: '1',
      pipelineId: '1',
      stageId: '1',
      value: 50000,
      probability: 75,
      closeDate: '2023-12-15',
      status: 'open' as const,
      createdAt: '2023-09-10T09:15:00Z',
      updatedAt: '2023-09-10T09:15:00Z'
    },
    {
      id: '2',
      title: 'Consulting Services',
      description: 'IT consulting for digital transformation',
      customerId: '2',
      pipelineId: '1',
      stageId: '2',
      value: 25000,
      probability: 60,
      closeDate: '2023-11-30',
      status: 'open' as const,
      createdAt: '2023-08-22T14:30:00Z',
      updatedAt: '2023-08-22T14:30:00Z'
    }
  ],
  PIPELINES: [
    {
      id: '1',
      name: 'Sales Pipeline',
      description: 'Standard sales process',
      stages: [
        {
          id: '1',
          name: 'Новый запрос',
          order: 1
        },
        {
          id: '2',
          name: 'Обсуждение',
          order: 2
        },
        {
          id: '3',
          name: 'Отправлено предложение',
          order: 3
        },
        {
          id: '4',
          name: 'Согласование',
          order: 4
        },
        {
          id: '5',
          name: 'Сделка завершена',
          order: 5
        }
      ],
      createdAt: '2023-01-10T08:00:00Z',
      updatedAt: '2023-01-10T08:00:00Z'
    }
  ]
};
