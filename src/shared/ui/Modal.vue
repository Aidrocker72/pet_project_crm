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
