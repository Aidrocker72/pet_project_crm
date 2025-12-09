<template>
  <svg :class="['crm-icon', `crm-icon--${name}`, className]" :width="width" :height="height" :fill="color">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
export interface IconProps {
  name: string;
  width?: string | number;
  height?: string | number;
  color?: string;
  className?: string;
}

withDefaults(defineProps<IconProps>(), {
  width: 20,
  height: 20,
  color: 'currentColor',
  className: ''
});
</script>

<style scoped>
.crm-icon {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
}
</style>
