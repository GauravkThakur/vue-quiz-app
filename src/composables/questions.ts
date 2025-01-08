import { onMounted, watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { decryptAnswer } from '@/utils';
import { useQuizStore } from '@/stores/quiz';

export function useQuestions() {
  const isConfigChanged = ref(false);
  const { isDarkMode, questions, decryptedQuestions, selectedTopics, noOfQuestions } =
    storeToRefs(useQuizStore());

  function setDarkMode() {
    if (isDarkMode.value) {
      document.documentElement.classList.add('my-app-dark');
    }
  }

  async function setQuestions() {
    setDarkMode();
    if (!questions.value.length || isConfigChanged.value) {
      questions.value = await getData();
      isConfigChanged.value = false;
    }
    decryptedQuestions.value = await Promise.all(
      questions.value.map(async (question) => {
        const correctAnswer = await decryptAnswer(question.correctAnswer);
        return {
          ...question,
          correctAnswer
        };
      })
    );
  }

  async function getData() {
    const maxRetries = 3;
    const url = 'https://vue-quiz-backend.onrender.com/front-end-quiz/data/';
    const params = new URLSearchParams(
      selectedTopics.value.map((topic) => ['tags[]', topic])
    ).toString();
    const urlSubstring = `filter?${params}&count=${noOfQuestions.value}`;

    for (let attempts = 0; attempts < maxRetries; attempts++) {
      try {
        const response = await fetch(`${url}${urlSubstring}`);

        if (!response.ok) {
          if (response.status === 404) {
            console.error('Data not found (404)');
            return [];
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        if (attempts + 1 >= maxRetries) {
          console.error('Max retries reached. Failed to fetch data');
        }
      }
    }
    return [];
  }

  const fetchQuestions = async () => {
    isConfigChanged.value = true;
  };

  watch(selectedTopics, fetchQuestions);
  watch(noOfQuestions, fetchQuestions);

  onMounted(setQuestions);

  return {
    setQuestions
  };
}
