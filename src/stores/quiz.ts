import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useQuizStore = defineStore(
  'quiz',
  () => {
    const allTopics = ref(['Vue', 'JavaScript', 'TypeScript']);
    const username = ref('');
    const isDarkMode = ref(false);
    const status = ref('inactive');
    const isQuizFinished = ref(false);
    const timerInterval = ref<number | undefined>(undefined);
    const currentPage = ref(0);
    const selectedTopics = ref<string[]>(allTopics.value);
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
      timeLeft.value = updatedNumberOfIndexes.value * 60;
      timerInterval.value = undefined;
      currentPage.value = 0;
      selectedOption.value = null;
      selectedOptions.value = [];
      answers.value = { correct: 0, incorrect: 0, unanswered: 0 };
    }

    function resetQuiz() {
      username.value = '';
      status.value = 'inactive';
      questionIndexes.value = [];
      numberOfIndexes.value = '30';
      selectedTopics.value = allTopics.value;
      resetQuizProps();
    }

    return {
      allTopics,
      username,
      status,
      isQuizFinished,
      timeLeft,
      timerInterval,
      currentPage,
      selectedTopics,
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
        'selectedTopics',
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
