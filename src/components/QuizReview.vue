<template>
  <Card class="w-9/12 m-auto mt-2" v-for="(item, index) in questions" :key="index">
    <template #header>
      <div class="flex justify-center">
        <strong>Question {{ index + 1 }}/{{ questions.length }}</strong>
      </div>
    </template>
    <template #title>
      <div class="flex items-center gap-4">
        {{ item.question }}
        <Tag
          v-if="selected(index).selected === item.correctAnswer"
          class="w-11 h-11"
          icon="pi pi-thumbs-up-fill"
          severity="success"
        />
        <Tag v-else class="w-11 h-11" icon="pi pi-thumbs-down-fill" severity="danger"></Tag>
      </div>
    </template>
    <template #subtitle>
      <pre><code class="flex flex-col gap-4"><span>{{ item.codeSnippet }}</span></code></pre>
    </template>
    <template #content>
      <div class="flex flex-col gap-2">
        <div v-for="(option, index1) in item.options" :key="index1" class="flex items-center">
          <RadioButton
            v-model="selected(index).selected"
            :inputId="`${index1}`"
            name="dynamic"
            :value="option"
            readonly
            disabled
          />
          <label :for="`${index1}`" class="ml-2">{{ option }}</label>
        </div>
      </div>
    </template>
    <template #footer>
      <Message class="mt-2" severity="success"> Correct Answer: {{ item.correctAnswer }} </Message>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';
import { useQuestions } from '@/composables/questions';

const { questions } = useQuestions();
const { selectedOptions } = storeToRefs(useQuizStore());

const selected = (index: number) => {
  return selectedOptions.value.find((opt) => opt.index === index) ?? { selected: null };
};
</script>
