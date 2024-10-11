<template>
  <Card class="w-9/12 h-1/2 mx-auto my-12">
    <template #title>
      <h1 class="flex justify-center">Welcome to the Vue Quiz App</h1>
    </template>
    <template #content>
      <div class="card flex justify-center mt-4">
        <div class="flex flex-col gap-4">
          <p>
            Test your knowledge with our interactive quiz. Click the button below to get started!
          </p>
          <FloatLabel variant="in">
            <InputText id="username" v-model="username" fluid />
            <label for="username">Enter your name</label>
          </FloatLabel>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center mt-4">
        <Button label="Start Quiz" severity="primary" @click="startQuiz" fluid />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';

const emit = defineEmits(['start']);

const startQuiz = () => {
  emit('start');
};

const { username } = storeToRefs(useQuizStore());
</script>

<style scoped></style>
