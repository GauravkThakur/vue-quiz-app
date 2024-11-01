import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useQuizStore = defineStore(
  'quiz',
  () => {
    const username = ref('');
    const isDarkMode = ref(false);
    const status = ref('inactive');
    const isQuizFinished = ref(false);
    const timerInterval = ref<number | undefined>(undefined);
    const currentPage = ref(0);
    const numberOfIndexes = ref('30');
    const selectedOption = ref<string | null>(null);
    const questionIndexes = ref<number[]>([]);
    const selectedOptions = ref<{ index: number; selected: string | null }[]>([]);
    const answers = ref<{ correct: number; incorrect: number; unanswered: number }>({
      correct: 0,
      incorrect: 0,
      unanswered: 0
    });

    const updatedNumberOfIndexes = computed(() =>
      numberOfIndexes.value === 'All' ? 100 : parseInt(numberOfIndexes.value, 10)
    );

    const timeLeft = ref(updatedNumberOfIndexes.value * 60);

    function resetQuizProps() {
      clearInterval(timerInterval.value);
      console.log(numberOfIndexes.value);
      timeLeft.value = updatedNumberOfIndexes.value * 60;
      timerInterval.value = undefined;
      currentPage.value = 0;
      selectedOption.value = null;
      selectedOptions.value = [];
      answers.value = { correct: 0, incorrect: 0, unanswered: 0 };
    }

    function resetQuiz() {
      username.value = '';
      questionIndexes.value = [];
      numberOfIndexes.value = '30';
      status.value = 'inactive';
      resetQuizProps();
    }

    return {
      username,
      status,
      isQuizFinished,
      timeLeft,
      timerInterval,
      currentPage,
      numberOfIndexes,
      selectedOption,
      selectedOptions,
      questionIndexes,
      updatedNumberOfIndexes,
      answers,
      isDarkMode,
      resetQuiz,
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
        'numberOfIndexes',
        'selectedOption',
        'selectedOptions',
        'answers',
        'isDarkMode',
        'questionIndexes'
      ]
    }
  }
);
