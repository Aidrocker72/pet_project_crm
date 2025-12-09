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
