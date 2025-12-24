<template>
  <Form @submit="onSubmit" :validation-schema="DEALS_VALIDATION_SCHEMA" :initial-values="initialData || undefined" class="crm-deal-form">
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
import { useCustomerStore } from '@/store/customer.store';
import { usePipelineStore } from '@/store/pipeline.store';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import type { IDeal } from '@/interfaces/IDeal';
import type { IPipelineStage } from '@/interfaces/IPipelineStage';
import { DEALS_VALIDATION_SCHEMA } from '@/constants/deals-validation';
import type { IDealFormProps } from '@/interfaces/props/IDealFormProps';
import type { IDealFormEmits } from '@/interfaces/emits/IDealFormEmits';

const props = withDefaults(defineProps<IDealFormProps>(), {
  initialData: null
});
const emit = defineEmits<IDealFormEmits>();

const customerStore = useCustomerStore();
const pipelineStore = usePipelineStore();

const isSubmitting = ref(false);

const customers = computed(() => customerStore.allCustomers);
const pipelines = computed(() => pipelineStore.allPipelines);
const isEdit = computed(() => !!props.initialData?.id);
const currentPipelineStages = computed<IPipelineStage[]>(() => {
 const pipelineId = props.initialData?.pipelineId || (pipelines.value.length === 1 ? pipelines.value[0]?.id : null);

  if (!pipelineId) return [];

  const pipeline = pipelineStore.pipelineById(pipelineId);
  return pipeline ? pipeline.stages : [];
});

const onSubmit = (values: any) => {
  isSubmitting.value = true;

  try {
    const formData = {
      ...values,
      pipelineId: values.pipelineId || (pipelines.value.length === 1 ? pipelines.value[0]?.id : '')
    };

    if (isEdit.value && props.initialData?.id) {
      const updateData = {
        ...formData,
        id: props.initialData.id
      } as Partial<IDeal> & { id: string };
      emit('submit', updateData);
    } else {
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
