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
export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}

withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false
});
</script>

<style scoped>
.crm-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius-medium, 8px);
  font-weight: var(--font-weight-medium, 500);
  cursor: pointer;
  transition: var(--transition-base, all 0.2s ease);
  position: relative;
  gap: 8px;
  font-family: var(--font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
}

/* Variant styles */
.crm-button--primary {
  background-color: var(--color-primary, #007bff);
  color: var(--color-text-inverse, white);
}

.crm-button--primary:hover:not(.crm-button--disabled) {
  background-color: var(--color-primary-hover, #0056b3);
}

.crm-button--secondary {
  background-color: var(--color-secondary, #6c757d);
  color: var(--color-text-inverse, white);
}

.crm-button--secondary:hover:not(.crm-button--disabled) {
  background-color: var(--color-secondary-hover, #545b62);
}

.crm-button--danger {
  background-color: var(--color-danger, #dc3545);
  color: var(--color-text-inverse, white);
}

.crm-button--danger:hover:not(.crm-button--disabled) {
  background-color: var(--color-danger-hover, #c82333);
}

.crm-button--outline {
  background-color: transparent;
  color: var(--color-primary, #007bff);
  border: 1px solid var(--color-primary, #007bff);
}

.crm-button--outline:hover:not(.crm-button--disabled) {
  background-color: var(--color-bg-secondary, #f8f9fa);
}

/* Size styles */
.crm-button--small {
  padding: var(--padding-sm, 8px) var(--padding-md, 12px);
  font-size: var(--font-size-sm, 14px);
}

.crm-button--medium {
  padding: var(--padding-md, 12px) var(--padding-lg, 16px);
  font-size: var(--font-size-md, 16px);
}

.crm-button--large {
  padding: var(--padding-lg, 16px) var(--padding-xl, 20px);
  font-size: var(--font-size-lg, 18px);
}

/* Disabled and loading states */
.crm-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.crm-button--loading {
  pointer-events: none;
}

.crm-button__loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.crm-button__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.crm-button--small .crm-button__spinner {
  width: 12px;
  height: 12px;
}

.crm-button--large .crm-button__spinner {
  width: 20px;
  height: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
