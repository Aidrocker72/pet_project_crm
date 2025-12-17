<template>
  <Form @submit="onSubmit" :validation-schema="dealSchema" :initial-values="initialFormData" class="crm-deal-form">
    <div class="crm-deal-form__field">
      <Field
        id="deal-title"
        name="title"
        v-slot="{ field, meta }"
      >
        <Input
          v-model="field.value"
          @update:model-value="field.onChange"
          label="Название сделки"
          placeholder="Введите название сделки"
          :class="{ 'crm-input--error': !meta.valid && meta.touched }"
          required
        />
      </Field>
      <ErrorMessage name="title" class="crm-deal-form__error" />
    </div>

    <div class="crm-deal-form__field">
      <Field
        id="deal-description"
        name="description"
        v-slot="{ field, meta }"
      >
        <label for="deal-description" class="crm-deal-form__label">Описание</label>
        <textarea
          v-model="field.value"
          @update:model-value="field.onChange"
          id="deal-description"
          class="crm-deal-form__textarea"
          :class="{ 'crm-deal-form__textarea--error': !meta.valid && meta.touched }"
          placeholder="Введите описание сделки"
        />
      </Field>
      <ErrorMessage name="description" class="crm-deal-form__error" />
    </div>

    <div class="crm-deal-form__field">
      <Field
        id="deal-customer"
        name="customerId"
        v-slot="{ field, meta }"
      >
        <label for="deal-customer" class="crm-deal-form__label">Клиент</label>
        <select
          v-model="field.value"
          @update:model-value="field.onChange"
          class="crm-deal-form__select"
          :class="{ 'crm-deal-form__select--error': !meta.valid && meta.touched }"
          required
        >
          <option value="" disabled>Выберите клиента</option>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.name }} ({{ customer.company }})
          </option>
        </select>
      </Field>
      <ErrorMessage name="customerId" class="crm-deal-form__error" />
    </div>

    <div class="crm-deal-form__field">
      <Field
        id="deal-pipeline"
        name="pipelineId"
        v-slot="{ field, meta }"
      >
        <label for="deal-pipeline" class="crm-deal-form__label">Воронка</label>
        <select
          v-model="field.value"
          @update:model-value="field.onChange"
          class="crm-deal-form__select"
          :class="{ 'crm-deal-form__select--error': !meta.valid && meta.touched }"
          required
        >
          <option value="" disabled>Выберите воронку</option>
          <option v-for="pipeline in pipelines" :key="pipeline.id" :value="pipeline.id">
            {{ pipeline.name }}
          </option>
        </select>
      </Field>
      <ErrorMessage name="pipelineId" class="crm-deal-form__error" />
    </div>

    <div class="crm-deal-form__field">
      <Field
        id="deal-stage"
        name="stageId"
        v-slot="{ field, meta }"
      >
        <label for="deal-stage" class="crm-deal-form__label">Этап</label>
        <select
          v-model="field.value"
          @update:model-value="field.onChange"
          class="crm-deal-form__select"
          :class="{ 'crm-deal-form__select--error': !meta.valid && meta.touched }"
          required
        >
          <option value="" disabled>Выберите этап</option>
          <option v-for="stage in currentPipelineStages" :key="stage.id" :value="stage.id">
            {{ stage.name }}
          </option>
        </select>
      </Field>
      <ErrorMessage name="stageId" class="crm-deal-form__error" />
    </div>

    <div class="crm-deal-form__field">
      <Field
        id="deal-value"
        name="value"
        v-slot="{ field, meta }"
      >
        <Input
          v-model.number="field.value"
          @update:model-value="field.onChange"
          type="number"
          label="Сумма сделки ($)"
          placeholder="Введите сумму сделки"
          :class="{ 'crm-input--error': !meta.valid && meta.touched }"
          required
        />
      </Field>
      <ErrorMessage name="value" class="crm-deal-form__error" />
    </div>

    <div class="crm-deal-form__field">
      <Field
        id="deal-probability"
        name="probability"
        v-slot="{ field, meta }"
      >
        <Input
          v-model.number="field.value"
          @update:model-value="field.onChange"
          type="number"
          min="0"
          max="100"
          label="Вероятность (%)"
          placeholder="Введите вероятность"
          :class="{ 'crm-input--error': !meta.valid && meta.touched }"
          required
        />
      </Field>
      <ErrorMessage name="probability" class="crm-deal-form__error" />
    </div>

    <div class="crm-deal-form__field">
      <Field
        id="deal-close-date"
        name="closeDate"
        v-slot="{ field, meta }"
      >
        <Input
          v-model="field.value"
          @update:model-value="field.onChange"
          type="date"
          label="Планируемая дата закрытия"
          :class="{ 'crm-input--error': !meta.valid && meta.touched }"
        />
      </Field>
      <ErrorMessage name="closeDate" class="crm-deal-form__error" />
    </div>

    <div class="crm-deal-form__actions">
      <Button
        type="submit"
        :loading="isSubmitting"
      >
        {{ isEdit ? 'Обновить сделку' : 'Создать сделку' }}
      </Button>
      <Button
        variant="secondary"
        type="button"
        @click="handleCancel"
        :disabled="isSubmitting"
      >
        Отмена
      </Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed} from 'vue';
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useCustomerStore } from '@/entities/customer/store/customer.store';
import { usePipelineStore } from '@/entities/pipeline/store/pipeline.store';
import Input from '@/shared/ui/Input.vue';
import Button from '@/shared/ui/Button.vue';
import type { IDeal } from '@/interfaces/IDeal';
import type { IPipelineStage } from '@/interfaces/IPipelineStage';

interface DealFormEmits {
  submit: [deal: Omit<IDeal, 'id' | 'createdAt' | 'updatedAt'> | Partial<IDeal>];
  cancel: [];
}

interface DealFormProps {
  initialData?: IDeal | null;
}

const props = withDefaults(defineProps<DealFormProps>(), {
  initialData: null
});

const emit = defineEmits<DealFormEmits>();

const isEdit = computed(() => !!props.initialData?.id);

// Stores
const customerStore = useCustomerStore();
const pipelineStore = usePipelineStore();

// Computed properties
const customers = computed(() => customerStore.allCustomers);
const pipelines = computed(() => pipelineStore.allPipelines);

const currentPipelineStages = computed<IPipelineStage[]>(() => {
 // Определяем ID воронки: из начальных данных или автоматически, если доступна только одна воронка
 const pipelineId = props.initialData?.pipelineId ||
                    (pipelines.value.length === 1 ? pipelines.value[0]?.id : null);

  if (!pipelineId) return [];

  const pipeline = pipelineStore.pipelineById(pipelineId);
  return pipeline ? pipeline.stages : [];
});

// Schema for validation
const dealSchema = yup.object({
  title: yup.string().required('Название обязательно').min(2, 'Название должно содержать не менее 2 символов'),
  description: yup.string(),
  customerId: yup.string().required('Клиент обязателен'),
  pipelineId: yup.string().when([], {
    is: () => pipelines.value.length > 1,
    then: (schema) => schema.required('Воронка обязательна'),
    otherwise: (schema) => schema,
  }),
  stageId: yup.string().required('Этап обязателен'),
  value: yup.number().positive('Сумма должна быть положительной').required('Сумма обязательна'),
  probability: yup.number().min(0, 'Вероятность не может быть меньше 0').max(100, 'Вероятность не может быть больше 100').required('Вероятность обязательна'),
  closeDate: yup.date()
});

// Loading state
const isSubmitting = ref(false);

// Initial form data
const initialFormData = computed(() => {
  if (props.initialData) {
    return {
      title: props.initialData.title,
      description: props.initialData.description,
      customerId: props.initialData.customerId,
      pipelineId: props.initialData.pipelineId,
      stageId: props.initialData.stageId,
      value: props.initialData.value,
      probability: props.initialData.probability,
      closeDate: props.initialData.closeDate,
    };
  }

  return {
    title: '',
    description: undefined,
    customerId: '',
    pipelineId: pipelines.value.length === 1 ? (pipelines.value[0]?.id || '') : '',
    stageId: '',
    value: 0,
    probability: 0,
    closeDate: undefined
  };
});

// Initialize form data
const formData = ref({ ...initialFormData.value });
// Используем useForm для управления формой
const { handleSubmit, setValues, values } = useForm({
  validationSchema: dealSchema,
  initialValues: initialFormData.value
});

const onSubmit = (values: any) => {
  isSubmitting.value = true;

  try {
    // Убедимся, что pipelineId установлен, если он не был выбран пользователем
    const formData = {
      ...values,
      pipelineId: values.pipelineId || (pipelines.value.length === 1 ? pipelines.value[0]?.id : '')
    };

    if (isEdit.value && props.initialData?.id) {
      // For edit, include the ID in the partial update
      const updateData = {
        ...formData,
        id: props.initialData.id
      } as Partial<IDeal> & { id: string };
      emit('submit', updateData);
    } else {
      // For create, exclude ID
      const createData = {
        ...formData
      } as Omit<IDeal, 'id' | 'createdAt' | 'updatedAt'>;
      emit('submit', createData);
    }
 } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>
