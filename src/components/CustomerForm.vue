<template>
  <Form @submit="onSubmit" :validation-schema="CUSTOMER_VALIDATION_SCHEMA" :initial-values="initialData || undefined" class="crm-customer-form">
    <div class="crm-customer-form__field">
      <Field
        id="customer-name"
        name="name"
        v-slot="{ field, meta }"
      >
        <Input
          v-model="field.value"
          @update:model-value="field.onChange"
          label="Полное имя"
          placeholder="Введите полное имя клиента"
          :class="{ 'crm-input--error': !meta.valid && meta.touched }"
          required
        />
      </Field>
      <ErrorMessage name="name" class="crm-customer-form__error" />
    </div>

    <div class="crm-customer-form__field">
      <Field
        id="customer-email"
        name="email"
        v-slot="{ field, meta }"
      >
        <Input
          v-model="field.value"
          @update:model-value="field.onChange"
          label="Email"
          type="email"
          placeholder="Введите email клиента"
          :class="{ 'crm-input--error': !meta.valid && meta.touched }"
          required
        />
      </Field>
      <ErrorMessage name="email" class="crm-customer-form__error" />
    </div>

    <div class="crm-customer-form__field">
      <Field
        id="customer-phone"
        name="phone"
        v-slot="{ field, meta }"
      >
        <Input
          v-model="field.value"
          @update:model-value="field.onChange"
          label="Телефон"
          type="tel"
          placeholder="Введите номер телефона клиента"
          :class="{ 'crm-input--error': !meta.valid && meta.touched }"
          required
        />
      </Field>
      <ErrorMessage name="phone" class="crm-customer-form__error" />
    </div>

    <div class="crm-customer-form__field">
      <Field
        id="customer-company"
        name="company"
        v-slot="{ field, meta }"
      >
        <Input
          v-model="field.value"
          @update:model-value="field.onChange"
          label="Компания"
          placeholder="Введите компанию клиента"
          :class="{ 'crm-input--error': !meta.valid && meta.touched }"
        />
      </Field>
      <ErrorMessage name="company" class="crm-customer-form__error" />
    </div>

    <div class="crm-customer-form__field">
      <Field
        id="customer-position"
        name="position"
        v-slot="{ field, meta }"
      >
        <Input
          v-model="field.value"
          @update:model-value="field.onChange"
          label="Должность"
          placeholder="Введите должность клиента"
          :class="{ 'crm-input--error': !meta.valid && meta.touched }"
        />
      </Field>
      <ErrorMessage name="position" class="crm-customer-form__error" />
    </div>

    <div class="crm-customer-form__field">
      <Field
        id="customer-notes"
        name="notes"
        v-slot="{ field, meta }"
      >
        <label for="customer-notes" class="crm-customer-form__label">Заметки</label>
        <textarea
          v-bind="field"
          @update:model-value="field.onChange"
          id="customer-notes"
          class="crm-customer-form__textarea"
          :class="{ 'crm-customer-form__textarea--error': !meta.valid && meta.touched }"
          placeholder="Дополнительные заметки о клиенте"
        ></textarea>
      </Field>
      <ErrorMessage name="notes" class="crm-customer-form__error" />
    </div>

    <div class="crm-customer-form__actions">
      <Button
        type="submit"
        :loading="isSubmitting"
      >
        {{ isEdit ? 'Обновить клиента' : 'Создать клиента' }}
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
import { ref, computed } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import type { ICustomerFormProps } from '@/interfaces/props/ICustomerFormProps';
import type { ICustomerFormEmits } from '@/interfaces/emits/ICustomerFormEmits';
import type { ICustomer } from '@/interfaces/ICustomer';
import { CUSTOMER_VALIDATION_SCHEMA } from '@/constants/customer-validation';

const props = withDefaults(defineProps<ICustomerFormProps>(), {
  initialData: null
});

const emit = defineEmits<ICustomerFormEmits>();

const isEdit = computed(() => !!props.initialData?.id);

const isSubmitting = ref(false);

const onSubmit = (values: any) => {
  isSubmitting.value = true;
  console.log(values)
  try {
    if (isEdit.value && props.initialData?.id) {
      const updateData = {
        ...values,
        id: props.initialData.id
      } as Partial<ICustomer> & { id: string };
      emit('submit', updateData);
    } else {
      const createData = {
        ...values
      } as Omit<ICustomer, 'id' | 'createdAt' | 'updatedAt'>;
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
