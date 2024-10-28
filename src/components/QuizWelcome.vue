<template>
  <Card class="w-9/12 h-1/2 mx-auto my-12">
    <template #title>
      <h1 class="flex justify-center">Welcome to the Vue Quiz App</h1>
      <Image src="/logo.svg" alt="Vue Quiz" class="flex justify-center mt-4" width="50" />
    </template>
    <template #content>
      <div class="flex justify-center my-4">
        <div class="flex flex-col gap-4">
          <p>
            Test your knowledge with our interactive quiz. Click the button below to get started!
          </p>
          <FloatLabel variant="in">
            <InputText
              id="username"
              v-model="username"
              fluid
              :invalid="isInvalid"
              @input="validateInput"
            />
            <label for="username">Enter your name</label>
          </FloatLabel>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center">
        <Button label="Start Quiz" severity="primary" @click="startQuiz" fluid />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';

const isInvalid = ref(false);
const emit = defineEmits(['start']);

const startQuiz = () => {
  validateInput();
  if (!isInvalid.value) {
    emit('start');
  }
};

const validateInput = () => {
  console.log(username.value);
  if (username.value === '') {
    isInvalid.value = true;
    return;
  }
  isInvalid.value = false;
};

const { username } = storeToRefs(useQuizStore());
</script>

<style scoped></style>
