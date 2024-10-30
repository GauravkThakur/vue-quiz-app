<template>
  <Splitter class="h-full">
    <SplitterPanel
      class="flex items-center justify-center overflow-auto h-full"
      :size="25"
      :minSize="10"
    >
      <div class="flex flex-wrap gap-2 sm:gap-5 justify-center mx-auto p-4 p-sm-10 h-full">
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
                ? 'info'
                : 'secondary'
          "
          @click.prevent.stop="onClickQuestionItem(option.value)"
        />
      </div>
    </SplitterPanel>
    <SplitterPanel class="flex flex-col items-center justify-center overflow-auto" :size="75">
      <Splitter layout="vertical" class="w-full h-full">
        <SplitterPanel class="flex items-center justify-center" :size="10">
          <strong>Question {{ currentPage + 1 }} of {{ data.length }}</strong>
        </SplitterPanel>
        <SplitterPanel :size="75" class="h-full overflow-auto">
          <Card
            class="shadow-none rounded-none w-full sm:w-3/4 items-center flex justify-center m-auto"
          >
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
        </SplitterPanel>
        <SplitterPanel class="flex items-center justify-center" :size="15">
          <Pagination :total-pages="data.length"></Pagination>
        </SplitterPanel>
      </Splitter>
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
  data: { question: string; options: string[]; correctAnswer: string; codeSnippet?: string }[];
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
