<template>
  <svg :class="['crm-icon', `crm-icon--${name}`, className]" :width="width" :height="height" :fill="color">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
import type { IIconProps } from '@/interfaces/props/ui/IIconProps';

withDefaults(defineProps<IIconProps>(), {
  width: 20,
  height: 20,
  color: 'currentColor',
  className: ''
});
</script>
