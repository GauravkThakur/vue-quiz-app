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
  tag: string;
};

export function useQuestions() {
  const { isDarkMode, questionIndexes, allTopics, selectedTopics, numberOfIndexes } =
    storeToRefs(useQuizStore());
  const questions = ref<Question[]>([]);
  const totalItems = data.reduce((a, c, i) => {
    const topics = selectedTopics.value.length ? selectedTopics.value : allTopics.value;
    if (topics.includes(c.tag)) {
      a.push(i);
    }
    return a;
  }, [] as number[]);

  function getRandomIndexes(totalItems: number[], numberOfIndexes: number) {
    //const indexes = Array.from({ length: totalItems }, (_, i) => i);
    // console.log('indexes', indexes);
    const shuffledIndexes = shuffle(totalItems);
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
      : getRandomIndexes(totalItems, parseInt(numberOfIndexes.value, 10) || totalItems.length);
    questions.value = questionIndexes.value.map((index) => data[index]);
  });

  return {
    questions
  };
}
