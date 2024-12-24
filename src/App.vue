<template>
  <QuizWelcome v-if="status === 'inactive'" @start="startQuiz" />
  <QuizContent v-else-if="status === 'started'" />
  <QuizResults v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';

const { status } = storeToRefs(useQuizStore());

const startQuiz = () => {
  status.value = 'started';
};
</script>

<style lang="scss">
@import 'primeicons/primeicons.css';
</style>
