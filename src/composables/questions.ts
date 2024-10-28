import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import data from '@/assets/data.json';
import { useQuizStore } from '@/stores/quiz';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  codeSnippet?: string;
};

export function useQuestions() {
  const numberOfIndexes = 30;
  const totalItems = data.length;

  const questions = ref<Question[]>([]);
  const { questionIndexes } = storeToRefs(useQuizStore());

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
    questionIndexes.value = questionIndexes.value.length
      ? questionIndexes.value
      : getRandomIndexes(totalItems, numberOfIndexes);
    questions.value = questionIndexes.value.map((index) => data[index]);
  });

  return {
    questions
  };
}
