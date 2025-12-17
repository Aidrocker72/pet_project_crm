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
import type { IInputEmits } from '@/interfaces/emits/ui/IInputEmits';
import type { IInputProps } from '@/interfaces/props/ui/IInputProps';
import { useAttrs } from 'vue';

const props = withDefaults(defineProps<IInputProps>(), {
  type: 'text',
  size: 'medium',
  disabled: false,
  readonly: false,
  required: false
});

const emit = defineEmits<IInputEmits>();

const attrs = useAttrs();

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function handleBlur(event: FocusEvent) {
  emit('blur', event);
}

const generatedId = `crm-input-${Math.random().toString(36).substr(2, 9)}`;
const id = props.id || generatedId;
</script>
