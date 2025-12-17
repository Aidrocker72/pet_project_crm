<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'crm-button',
      `crm-button--${variant}`,
      `crm-button--${size}`,
      {
        'crm-button--loading': loading,
        'crm-button--disabled': disabled || loading
      }
    ]"
    :aria-busy="loading"
  >
    <span v-if="!loading" class="crm-button__content">
      <slot />
    </span>
    <span v-else class="crm-button__loading">
      <span class="crm-button__spinner" />
      <span v-if="loadingText" class="crm-button__loading-text">{{ loadingText }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import type { IButtonProps } from '@/interfaces/props/ui/IButtonProps';


withDefaults(defineProps<IButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false
});
</script>
