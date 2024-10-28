<template>
  <Card class="w-9/12 h-1/2 mx-auto my-12">
    <template #title>
      <h1 class="flex justify-center">Quiz Results</h1>
    </template>
    <template #subtitle>
      <div class="card flex justify-center mt-4">
        <div class="flex flex-col gap-4">
          <Message v-if="isPassing" icon="pi pi-thumbs-up-fill" severity="success">
            Congratulations {{ username }}! your score is {{ percentage }} %
          </Message>
          <Message v-else icon="pi pi-thumbs-down-fill" severity="error">
            Tough luck {{ username }} ! your score is {{ percentage }} %
          </Message>
        </div>
      </div>
    </template>
    <template #content>
      <div class="card flex justify-center mt-4">
        <div class="flex flex-col gap-4">
          <Tag icon="pi pi-calculator" severity="info" :value="`Total Questions ${totalQuestions}`">
          </Tag>
          <Tag icon="pi pi-check" severity="success" :value="`Correct Answers ${answers.correct}`">
          </Tag>
          <Tag icon="pi pi-times" severity="danger" :value="`Wrong Answers ${answers.incorrect}`">
          </Tag>
          <Tag
            icon="pi pi-exclamation-triangle"
            severity="warn"
            :value="`Not Answered ${answers.unanswered}`"
          >
          </Tag>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center mt-4 gap-4">
        <Button label="Go to Home" severity="primary" @click="goHome" fluid />
        <Button label="Review Answers" severity="secondary" @click="reviewAnswers" fluid />
      </div>
    </template>
  </Card>
  <Dialog
    v-model:visible="visible"
    maximizable
    modal
    header="Header"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <div class="flex justify-center">
        <strong>Review Answers</strong>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-4">
        <Button label="Close" @click="visible = false" />
      </div>
    </template>
    <QuizReview />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';
import { useQuestions } from '@/composables/questions';

const visible = ref(false);
const quizStore = useQuizStore();
const { questions } = useQuestions();
const { resetQuizProps } = quizStore;
const { answers, status, username, questionIndexes } = storeToRefs(quizStore);

const totalQuestions = computed(
  () => answers.value.correct + answers.value.incorrect + answers.value.unanswered
);

const percentage = computed(() =>
  ((answers.value.correct / totalQuestions.value) * 100).toFixed(2)
);

const isPassing = computed(() => parseFloat(percentage.value) > 70);

const goHome = () => {
  resetQuizProps();
  username.value = '';
  questions.value = [];
  questionIndexes.value = [];
  status.value = 'inactive';
};

const reviewAnswers = () => {
  visible.value = true;
};
</script>
