<template>
  <QuizHeader :is-restart="isRestarted" @on-timer-out="onFinish" />
  <QuizMain :data="questions" v-if="questions.length" />
  <QuizFooter @on-quiz-finish="onFinish" @on-quiz-quit="onQuit" @on-quiz-restart="onRestart" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useQuizStore } from '@/stores/quiz';
import QuizHeader from './QuizHeader.vue';
import QuizFooter from './QuizFooter.vue';
import QuizMain from './QuizMain.vue';
import { useQuestions } from '@/composables/questions';

const isRestarted = ref(false);

const { questions } = useQuestions();

const { timeLeft, username, status, selectedOptions, answers, questionIndexes } =
  storeToRefs(useQuizStore());
const { resetQuizProps } = useQuizStore();

const onFinish = () => {
  timeLeft.value = 0;
  status.value = 'completed';

  if (!selectedOptions.value.length) {
    answers.value = { correct: 0, incorrect: 0, unanswered: questions.value.length };
    return;
  }

  answers.value = questions.value
    .map((option, index) => {
      const { selected } = selectedOptions.value.find((opt) => opt.index === index) ?? {};
      return {
        question: option.question,
        selected,
        correctAnswer: option.correctAnswer,
        correct: option.correctAnswer === selected
      };
    })
    .reduce(
      (prev, curr) => {
        if (!curr.selected) {
          prev.unanswered++;
        } else if (curr.correct) {
          prev.correct++;
        } else {
          prev.incorrect++;
        }
        return prev;
      },
      { correct: 0, incorrect: 0, unanswered: 0 }
    );
};

const onQuit = () => {
  resetQuizProps();
  username.value = '';
  questions.value = [];
  questionIndexes.value = [];
  status.value = 'inactive';
};

const onRestart = () => {
  resetQuizProps();
  status.value = 'started';
  isRestarted.value = true;
};
</script>
