<template>
  <Card class="w-11/12 sm:w-9/12 md:w-7/12 h-full mx-auto my-12">
    <template #title>
      <Image src="/logo.svg" alt="Vue Quiz" class="flex justify-center" width="50" />
      <h1 class="flex justify-center">Vue JS Quiz</h1>
    </template>
    <template #subtitle>
      <h2 class="w-full md:w-3/4 m-auto">
        This quiz is designed to test your knowledge of Vue.js. You will be presented with a series
        of multiple-choice questions which focus on Vue composition API concepts. Good luck :-)
      </h2>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 text-center w-full md:w-3/4 m-auto">
        <Fieldset>
          <template #legend>
            <div class="flex items-center pl-2">
              <span class="font-bold p-2">Number of questions</span>
            </div>
          </template>
          <SelectButton v-model="numberOfIndexes" :options="options" aria-labelledby="basic">
            <template #option="slotProps">{{ slotProps.option }} Questions</template>
          </SelectButton>
        </Fieldset>
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
    </template>
    <template #footer>
      <div class="flex justify-center w-full md:w-3/4 m-auto">
        <Button label="Start Quiz" severity="primary" @click="startQuiz" fluid />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';

const isInvalid = ref(false);
const options = ref(['30', '40', '50']);
const emit = defineEmits(['start']);

const startQuiz = () => {
  validateInput();
  if (!isInvalid.value) {
    emit('start');
  }
};

const validateInput = () => {
  if (username.value === '') {
    isInvalid.value = true;
    return;
  }
  isInvalid.value = false;
};

const { username, numberOfIndexes } = storeToRefs(useQuizStore());

watch(numberOfIndexes, () => {
  useQuizStore().timeLeft = parseInt(numberOfIndexes.value, 10) * 60;
});
</script>

<style scoped></style>
