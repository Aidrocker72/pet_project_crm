<template>
  <div class="crm-input">
    <label v-if="label" :for="id" class="crm-input__label">
      {{ label }}
      <span v-if="required" class="crm-input-label__required">*</span>
    </label>
    <div class="crm-input__wrapper">
      <input
        :id="id"
        v-bind="attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="[
          'crm-input__field',
          `crm-input__field--${size}`,
          {
            'crm-input__field--error': error,
            'crm-input__field--disabled': disabled,
            'crm-input__field--readonly': readonly
          }
        ]"
        @input="handleInput"
        @blur="handleBlur"
      />
      <div v-if="error" class="crm-input__error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

export interface InputProps {
  id?: string;
  modelValue: string | number | undefined;
  label?: string;
  placeholder?: string;
  type?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'medium',
  disabled: false,
  readonly: false,
  required: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();

// Функция для обработки ввода
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  console.log(target.value)
  emit('update:modelValue', target.value);
}

// Функция для обработки потери фокуса
function handleBlur(event: FocusEvent) {
  emit('blur', event);
}

// Генерация случайного ID, если не предоставлен
const generatedId = `crm-input-${Math.random().toString(36).substr(2, 9)}`;
const id = props.id || generatedId;
</script>

<style scoped>
.crm-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 4px);
  width: 100%;
}

.crm-input__label {
  font-size: var(--font-size-sm, 14px);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-primary, #333);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs, 4px);
}

.crm-input-label__required {
  color: var(--color-danger, #dc3545);
}

.crm-input__wrapper {
  position: relative;
  margin-top: 10px;
}

.crm-input__field {
  width: 100%;
  padding: var(--padding-md, 12px);
  border: 1px solid var(--color-border-primary, #ced4da);
  border-radius: var(--border-radius-medium, 8px);
  font-size: var(--font-size-md, 16px);
  line-height: 1.5;
  transition: var(--transition-base, all 0.2s ease);
  box-sizing: border-box;
  font-family: var(--font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
}

.crm-input__field:focus {
  outline: none;
  border-color: var(--color-primary, #007bff);
  box-shadow: 0 0 0.2rem var(--color-primary-disable, rgba(0, 123, 255, 0.25));
}

.crm-input__field--small {
  padding: var(--padding-sm, 8px);
  font-size: var(--font-size-sm, 14px);
}

.crm-input__field--large {
  padding: var(--padding-lg, 16px);
  font-size: var(--font-size-lg, 18px);
}

.crm-input__field--error {
  border-color: var(--color-danger, #dc3545);
}

.crm-input__field--error:focus {
  border-color: var(--color-danger, #dc3545);
  box-shadow: 0 0 0 0.2rem var(--color-danger-disable, rgba(220, 53, 69, 0.25));
}

.crm-input__field--disabled {
  background-color: var(--color-bg-disabled, #e9ecef);
  opacity: 0.6;
  cursor: not-allowed;
}

.crm-input__field--readonly {
  background-color: var(--color-bg-secondary, #f8f9fa);
}

.crm-input__error {
  color: var(--color-danger, #dc3545);
  font-size: var(--font-size-sm, 14px);
  margin-top: var(--spacing-xs, 4px);
}
</style>

