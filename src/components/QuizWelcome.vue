<template>
  <Toolbar class="w-11/12 sm:w-9/12 md:w-7/12 mx-auto my-6 items-center">
    <template #start>
      <Image src="favicon.svg" alt="logo" width="56" />
    </template>
    <template #end>
      <div class="flex gap-2">
        <Button
          :icon="isDarkMode ? 'pi pi-moon' : 'pi pi-sun'"
          severity="contrast"
          aria-label="Toggle Dark Mode"
          variant="outlined"
          @click="toggleDarkMode()"
          class="float-right"
        />
        <QuizLogin />
      </div>
    </template>
  </Toolbar>
  <Card class="w-11/12 sm:w-9/12 md:w-7/12 mx-auto">
    <template #title>
      <h1 class="flex justify-center">Front-end Quiz</h1>
      <div class="flex justify-center gap-2">
        <QuizIcon
          v-for="topic in allTopics"
          :key="topic"
          :name="topic.toLowerCase()"
          class="h-10 w-10"
        />
      </div>
    </template>
    <template #subtitle>
      <h2 class="w-full md:w-3/4 m-auto">
        This quiz consists of multiple-choice questions which focus on the concepts of JavaScript,
        TypeScript and Vue JS composition API.
      </h2>
    </template>
    <template #content>
      <div class="flex flex-col text-center w-full md:w-3/4 m-auto">
        <Fieldset>
          <template #legend>
            <div class="flex items-center pl-2">
              <span class="font-bold p-2">Choose topics</span>
            </div>
          </template>
          <SelectButton
            v-model="selectedTopics"
            :options="allTopics"
            multiple
            aria-labelledby="multiple"
            class="flex-wrap gap-2 justify-center"
          >
            <template #option="slotProps">{{ slotProps.option }}</template>
          </SelectButton>
        </Fieldset>
        <Fieldset>
          <template #legend>
            <div class="flex items-center pl-2">
              <span class="font-bold p-2">Number of questions</span>
            </div>
          </template>
          <SelectButton
            v-model="numberOfIndexes"
            :options="options"
            aria-labelledby="basic"
            class="flex-wrap gap-2 justify-center"
          >
            <template #option="slotProps">{{ slotProps.option }}</template>
          </SelectButton>
        </Fieldset>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center w-full md:w-3/4 m-auto">
        <Button label="Start Quiz" severity="primary" @click="startQuiz" fluid />
      </div>
      <Dialog
        v-model:visible="visible"
        maximizable
        modal
        header="Header"
        :style="{ width: '40vw' }"
        :breakpoints="{ '1199px': '60vw', '575px': '90vw' }"
      >
        <template #header>
          <strong class="flex items-center gap-2">
            <i class="pi pi-sign-in" />
            <span class="font-bold">Sign In</span>
          </strong>
        </template>
        <span class="text-surface-500 dark:text-surface-400 block mb-2">
          Please sign in with your google account or continue as guest to start the quiz.
        </span>
        <template #footer>
          <div class="flex justify-center gap-2">
            <QuizLogin />
            <Button
              size="small"
              label="Continue as Guest"
              severity="contrast"
              variant="outlined"
              @click="onReply"
              class="text-xs"
            ></Button>
          </div>
        </template>
      </Dialog>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';
import { useUserStore } from '@/stores/user';

const visible = ref(false);
const { isLoggedIn } = storeToRefs(useUserStore());

const { allTopics, selectedTopics, numberOfIndexes, timeLeft, isDarkMode, updatedNumberOfIndexes } =
  storeToRefs(useQuizStore());

const options = ref(['30', '40', '50', 'All']);
const emit = defineEmits(['start']);

const startQuiz = () => {
  if (isLoggedIn.value) {
    emit('start');
  } else {
    visible.value = true;
  }
};

const onClose = () => {
  visible.value = false;
};

const onReply = () => {
  onClose();
  emit('start');
};

watch(numberOfIndexes, () => {
  timeLeft.value = updatedNumberOfIndexes.value * 60;
});

watch(isLoggedIn, (newValue) => {
  if (newValue && visible.value) {
    onClose();
    emit('start');
  }
});

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
  isDarkMode.value = !isDarkMode.value;
}

onMounted(async () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('my-app-dark');
  }
});
</script>
