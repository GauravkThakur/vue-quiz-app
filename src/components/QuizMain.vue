<template>
  <Splitter class="h-full">
    <SplitterPanel
      class="flex items-center justify-center overflow-auto h-full"
      :size="25"
      :minSize="10"
    >
      <div class="flex flex-wrap gap-2 sm:gap-5 justify-center mx-auto p-4 p-sm-10 h-full">
        <Button
          v-for="index in data.length"
          ref="optionsRef"
          class="w-11 h-11"
          rounded
          :key="index"
          v-bind="buttonProps(index)"
          @click.prevent.stop="onClickQuestionButton(index)"
        />
      </div>
    </SplitterPanel>
    <SplitterPanel class="flex flex-col items-center justify-center overflow-auto" :size="75">
      <Splitter layout="vertical" class="w-full h-full">
        <SplitterPanel class="flex items-center justify-center gap-2" :size="10">
          <QuizIcon :name="data[currentPage].tag" class="h-7 w-7" />
          <strong>Question {{ currentPage + 1 }} of {{ data.length }}</strong>
        </SplitterPanel>
        <SplitterPanel :size="75" class="h-full overflow-auto">
          <Card
            class="shadow-none rounded-none w-full sm:w-3/4 items-center flex justify-center m-auto"
          >
            <template #title>
              <div class="flex items-center gap-2">
                <span class="grow">{{ data[currentPage].question }}</span>
              </div>
            </template>
            <template #subtitle>
              <QuizSyntaxHighlighter
                :key="currentPage"
                v-if="data[currentPage].codeSnippet"
                :language="data[currentPage].tag !== 'Vue' ? 'javascript' : 'html'"
                class="flex flex-col gap-4 my-3"
              >
                {{ data[currentPage].codeSnippet }}
              </QuizSyntaxHighlighter>
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
                    :inputId="index.toString()"
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
import { watch, watchEffect, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';
import type Button from 'primevue/button';

import type { Question } from '@/types';
import { useQuizStore } from '@/stores/quiz';
import QuizIcon from './QuizIcon.vue';
import Pagination from './QuizPagination.vue';
import QuizSyntaxHighlighter from './QuizSyntaxHighlighter.vue';

const optionsRef = useTemplateRef<InstanceType<typeof Button>[]>('optionsRef');

const props = defineProps<{
  data: Question[];
}>();

const { currentPage, selectedOption, selectedOptions } = storeToRefs(useQuizStore());

const isOptionSelected = (index: number) =>
  selectedOptions.value.some((option) => option.index === index && option.selected);

const onClickQuestionButton = (index: number) => {
  currentPage.value = index - 1;
};

const handleScroll = (index: number) => {
  optionsRef.value?.[index]?.$el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const buttonProps = (index: number) => {
  const updatedIndex = index - 1;
  let severity =
    currentPage.value === updatedIndex
      ? 'warn'
      : isOptionSelected(updatedIndex)
        ? 'info'
        : 'secondary';
  return {
    severity,
    raised: !!props.data[updatedIndex]?.codeSnippet,
    label: `${updatedIndex < 9 ? '0' : ''}${updatedIndex + 1}`
  };
};

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
      handleScroll(newValue);
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
  handleScroll(currentPage.value);
});
</script>
