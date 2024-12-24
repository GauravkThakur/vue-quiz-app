<template>
  <div class="flex flex-col min-h-screen">
    <header class="absolute w-full top-0">
      <QuizHeader :is-restart="isRestarted" @on-timer-out="onFinish" />
    </header>
    <div class="absolute flex-grow top-20 bottom-20 overflow-y-hidden">
      <QuizMain :data="questions" v-if="questions.length" />
    </div>
    <footer class="absolute w-full bottom-0">
      <QuizFooter @on-quiz-finish="onFinish" @on-quiz-quit="onQuit" @on-quiz-restart="onRestart" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useQuizStore } from '@/stores/quiz';
import { useQuestions } from '@/composables/questions';

import QuizMain from './QuizMain.vue';
import QuizHeader from './QuizHeader.vue';
import QuizFooter from './QuizFooter.vue';

const isRestarted = ref(false);

const { questions } = useQuestions();
const quizStore = useQuizStore();
const { timeLeft, status, selectedOptions, answers } = storeToRefs(quizStore);

const onFinish = () => {
  timeLeft.value = 0;
  status.value = 'completed';

  const initialAnswers = { correct: 0, incorrect: 0, unanswered: 0 };

  answers.value = questions.value.reduce((acc, question, index) => {
    const selectedOption = selectedOptions.value.find((opt) => opt.index === index)?.selected;
    if (!selectedOption) {
      acc.unanswered++;
    } else if (question.correctAnswer === selectedOption) {
      acc.correct++;
    } else {
      acc.incorrect++;
    }
    return acc;
  }, initialAnswers);
};

const onQuit = () => {
  quizStore.resetQuiz();
  questions.value = [];
};

const onRestart = () => {
  quizStore.resetQuizProps();
  status.value = 'started';
  isRestarted.value = true;
};
</script>
