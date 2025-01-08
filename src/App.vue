<template>
  <QuizWelcome v-if="status === 'inactive'" @start="startQuiz" />
  <QuizContent v-else-if="status === 'started'" />
  <QuizResults v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';
import { useQuestions } from '@/composables/questions';

const { status } = storeToRefs(useQuizStore());
const { setQuestions } = useQuestions();

const startQuiz = async () => {
  status.value = 'started';
  await setQuestions();
};
</script>

<style lang="scss">
@import 'primeicons/primeicons.css';
</style>
