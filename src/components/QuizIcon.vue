<template>
  <i class="flex justify-center items-center" v-html="getIcon(name)" />
</template>

<script setup lang="ts">
defineProps<{
  name: string;
}>();
const modules = import.meta.glob('@/assets/*.svg', { query: '?raw', eager: true });

const getIcon = (name: string) =>
  (modules[`/src/assets/${name.toLowerCase()}.svg`] as { default: string }).default;
</script>
