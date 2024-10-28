<template>
  <Splitter style="max-height: 500px; min-height: 400px">
    <SplitterPanel class="flex flex-col items-center justify-center" :size="65">
      <Card class="w-9/12 m-auto">
        <template #header>
          <div class="flex justify-center">
            <strong>Question {{ currentPage + 1 }}/{{ data.length }}</strong>
          </div>
        </template>
        <template #title>
          <div class="flex flex-col gap-4">{{ data[currentPage].question }}</div>
        </template>
        <template #subtitle>
          <pre><code class="flex flex-col gap-4">{{ data[currentPage].codeSnippet }}</code></pre>
        </template>
        <template #content>
          <div class="flex flex-col gap-2">
            <div
              v-for="(option, index) in data[currentPage].options"
              :key="index"
              class="flex items-center"
            >
              <RadioButton
                v-model="selectedOption"
                :inputId="`${index}`"
                name="dynamic"
                :value="option"
              />
              <label :for="`${index}`" class="ml-2">{{ option }}</label>
            </div>
          </div>
        </template>
      </Card>
      <Pagination :total-pages="data.length"></Pagination>
    </SplitterPanel>
    <SplitterPanel class="flex items-center justify-center overflow-auto" :size="35" :minSize="10">
      <div class="flex flex-wrap gap-5 justify-center mx-auto p-10">
        <Button
          v-for="(option, index) in options"
          class="w-11 h-11"
          rounded
          :key="index"
          :label="`${option.value < 9 ? '0' : ''}${option.value + 1}`"
          :severity="
            currentPage === option.value
              ? 'warn'
              : isOptionSelected(option.value)
                ? 'success'
                : 'secondary'
          "
          @click.prevent.stop="onClickQuestionItem(option.value)"
        />
      </div>
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useQuizStore } from '@/stores/quiz';
import Pagination from './QuizPagination.vue';
const options = ref<{ name: string; value: number }[]>([]);

const props = defineProps<{
  data: { question: string; options: string[]; correctAnswer: string }[];
}>();

const { currentPage, selectedOption, selectedOptions } = storeToRefs(useQuizStore());

onMounted(() => {
  options.value = props.data.reduce((prev: { name: string; value: number }[], curr, index) => {
    prev.push({ name: `Q${index + 1}`, value: index });
    return prev;
  }, []);
});

watch(
  () => currentPage.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      const oldIndex = selectedOptions.value.findIndex((option) => option.index === oldValue);
      const newIndex = selectedOptions.value.findIndex((option) => option.index === newValue);
      if (oldIndex !== -1) {
        selectedOptions.value[oldIndex].selected =
          selectedOption.value ?? selectedOptions.value[oldIndex].selected;
      } else {
        selectedOptions.value.push({
          index: oldValue,
          selected: selectedOption.value
        });
      }
      selectedOption.value = newIndex !== -1 ? selectedOptions.value[newIndex].selected : null;
    }
  }
);

watchEffect(() => {
  if (selectedOption.value) {
    const oldIndex = selectedOptions.value.findIndex(
      (option) => option.index === currentPage.value
    );
    if (oldIndex !== -1) {
      selectedOptions.value[oldIndex].selected =
        selectedOption.value ?? selectedOptions.value[oldIndex].selected;
    } else {
      selectedOptions.value.push({
        index: currentPage.value,
        selected: selectedOption.value
      });
    }
  }
});

const isOptionSelected = (value: number) =>
  selectedOptions.value.some((option) => option.index === value && option.selected);

const onClickQuestionItem = (value: number) => {
  currentPage.value = options.value.findIndex((option) => option.value === value);
};
</script>
