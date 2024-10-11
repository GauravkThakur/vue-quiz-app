<template>
  <QuizWelcome v-if="status === 'inactive'" @start="startQuiz" />
  <QuizContent v-else-if="status === 'started'" />
  <QuizResults v-else />
</template>

<script setup lang="ts">
import QuizWelcome from '@/components/QuizWelcome.vue';
import QuizContent from '@/components/QuizContent.vue';
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