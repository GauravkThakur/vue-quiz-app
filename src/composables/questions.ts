import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import data from '@/assets/data.json';
import { useQuizStore } from '@/stores/quiz';

type Question = {
  question: string;
  options: string[];
  codeHint?: string;
  codeSnippet?: string;
  correctAnswer: string;
};

export function useQuestions() {
  const totalItems = data.length;

  const questions = ref<Question[]>([]);
  const { isDarkMode, questionIndexes, numberOfIndexes } = storeToRefs(useQuizStore());

  function getRandomIndexes(totalItems: number, numberOfIndexes: number) {
    const indexes = Array.from({ length: totalItems }, (_, i) => i);
    const shuffledIndexes = shuffle(indexes);
    return shuffledIndexes.slice(0, numberOfIndexes) as number[];
  }

  function shuffle(array: unknown[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  onMounted(() => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('my-app-dark');
    }

    questionIndexes.value = questionIndexes.value.length
      ? questionIndexes.value
      : getRandomIndexes(totalItems, parseInt(numberOfIndexes.value, 10));
    questions.value = questionIndexes.value.map((index) => data[index]);
  });

  return {
    questions
  };
}
