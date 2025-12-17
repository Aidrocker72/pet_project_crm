<template>
  <Teleport to="body">
    <div v-if="isOpen" class="crm-modal-overlay" @click="handleOverlayClick">
      <div
        :class="['crm-modal', `crm-modal--${size}`]"
        @click.stop
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'crm-modal-title' : undefined"
      >
        <header v-if="title || $slots.header" class="crm-modal-header">
          <h2 v-if="title" id="crm-modal-title" class="crm-modal-title">
            {{ title }}
          </h2>
          <div v-else-if="$slots.header" class="crm-modal-slot-header">
            <slot name="header" />
          </div>
          <button
            class="crm-modal-close-button"
            :aria-label="closeButtonLabel"
            @click="closeModal"
          >
            <span class="crm-modal-close-icon">&times;</span>
          </button>
        </header>

        <div class="crm-modal-body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="crm-modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { IModalEmits } from '@/interfaces/emits/ui/IModalEmits';
import type { IModalProps } from '@/interfaces/props/ui/IModalProps';
import { onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(defineProps<IModalProps>(), {
  size: 'medium',
  closeOnOverlayClick: true,
  closeOnEsc: true,
 closeButtonLabel: 'Закрыть модальное окно'
});

const emit = defineEmits<IModalEmits>();

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, { immediate: true });

const closeModal = () => {
  emit('update:isOpen', false);
};

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeModal();
  }
};

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEsc) {
    closeModal();
  }
};

onUnmounted(() => {
  document.body.style.overflow = '';
});

onMounted(() => {
  if (props.closeOnEsc) {
    window.addEventListener('keydown', handleEscKey);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey);
});
</script>

<style scoped>
:root {
  --scrollbar-width: 0px;
}

.crm-modal-overlay {
  position: fixed;
 top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
 justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.crm-modal {
  background: var(--color-bg-primary, white);
  border-radius: var(--border-radius-large, 8px);
  box-shadow: var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.2));
  max-height: 90vh;
 overflow: hidden;
 display: flex;
 flex-direction: column;
  width: 100%;
  max-width: 500px;
}

.crm-modal--small {
  max-width: 300px;
}

.crm-modal--medium {
  max-width: 500px;
}

.crm-modal--large {
  max-width: 800px;
}

.crm-modal--full {
  max-width: 95vw;
  max-height: 95vh;
}

.crm-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--padding-lg, 20px);
  border-bottom: 1px solid var(--color-border-primary, #e9ecef);
  flex-shrink: 0;
}

.crm-modal-title {
  margin: 0;
  font-size: var(--font-size-lg, 18px);
  font-weight: var(--font-weight-bold, 600);
  color: var(--color-text-primary, #333);
  font-family: var(--font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
}

.crm-modal-slot-header {
  flex: 1;
}

.crm-modal-close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
 cursor: pointer;
  color: var(--color-text-secondary, #6c757d);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
 align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-medium, 4px);
  transition: var(--transition-base, all 0.2s ease);
}

.crm-modal-close-button:hover {
  background-color: var(--color-bg-secondary, #f8f9fa);
  color: var(--color-text-tertiary, #495057);
}

.crm-modal-close-icon {
  line-height: 1;
}

.crm-modal-body {
  padding: var(--padding-lg, 20px);
  overflow-y: auto;
  flex: 1;
}

.crm-modal-footer {
  padding: var(--padding-md, 15px) var(--padding-lg, 20px);
  border-top: 1px solid var(--color-border-primary, #e9ecef);
  flex-shrink: 0;
}
</style>
