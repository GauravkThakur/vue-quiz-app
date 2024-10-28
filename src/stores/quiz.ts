import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useQuizStore = defineStore(
  'quiz',
  () => {
    const totalTime = 30 * 60; // 30 minutes in seconds
    const username = ref('');
    const status = ref('inactive');
    const isQuizFinished = ref(false);
    const timeLeft = ref(totalTime);
    const timerInterval = ref<number | undefined>(undefined);
    const currentPage = ref(0);
    const selectedOption = ref<string | null>(null);
    const questionIndexes = ref<number[]>([]);
    const selectedOptions = ref<{ index: number; selected: string | null }[]>([]);
    const answers = ref<{ correct: number; incorrect: number; unanswered: number }>({
      correct: 0,
      incorrect: 0,
      unanswered: 0
    });

    function resetQuizProps() {
      clearInterval(timerInterval.value);
      timeLeft.value = totalTime;
      timerInterval.value = undefined;
      currentPage.value = 0;
      selectedOption.value = null;
      selectedOptions.value = [];
      answers.value = { correct: 0, incorrect: 0, unanswered: 0 };
    }

    return {
      username,
      status,
      isQuizFinished,
      timeLeft,
      timerInterval,
      currentPage,
      selectedOption,
      selectedOptions,
      questionIndexes,
      answers,
      resetQuizProps
    };
  },
  {
    persist: {
      storage: sessionStorage,
      pick: [
        'username',
        'status',
        'timeLeft',
        'timerInterval',
        'currentPage',
        'selectedOption',
        'selectedOptions',
        'answers',
        'questionIndexes'
      ]
    }
  }
);
