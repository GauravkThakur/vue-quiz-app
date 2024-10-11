<template>
  <div class="flex justify-between w-9/12 mx-auto my-6">
    <Button
      icon="pi pi-arrow-left"
      label="Previous"
      severity="contrast"
      rounded
      @click="previousPage"
      :disabled="currentPage === 0"
    />
    <Button
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Next"
      severity="contrast"
      rounded
      @click="nextPage"
      :disabled="currentPage === totalPages - 1"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';

const props = defineProps<{ totalPages: number }>();
const { currentPage } = storeToRefs(useQuizStore());

function previousPage() {
  if (currentPage.value) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < props.totalPages - 1) {
    currentPage.value++;
  }
}
</script>
