<template>
  <Toolbar class="h-20">
    <template #start>
      <span class="flex items-center text-sm">
        <Avatar
          icon="pi pi-user"
          class="mr-2"
          size="normal"
          style="background-color: #dee9fc; color: #1a2551"
          shape="circle"
        />
        <strong class="text-lg">Welcome {{ username }} !!!</strong>
      </span>
    </template>
    <template #end>
      <Tag
        icon="text-lg flex justify-center items-center mr-1 pi pi-clock"
        class="w-24 h-10 text-xl"
        severity="contrast"
        :value="formattedTime"
      ></Tag>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, watchEffect } from 'vue';
import { useQuizStore } from '@/stores/quiz';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['onTimerOut']);
const props = withDefaults(defineProps<{ isRestart: boolean }>(), {
  isRestart: false
});

const { username, timeLeft, timerInterval } = storeToRefs(useQuizStore());

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const resetInterval = () => {
  timerInterval.value = setInterval(() => {
    if (timeLeft.value) {
      timeLeft.value--;
      if (timeLeft.value === 0) {
        emit('onTimerOut');
      }
    } else {
      clearInterval(timerInterval.value);
    }
  }, 1000) as unknown as number;
};

onMounted(() => {
  resetInterval();
});

onUnmounted(() => {
  clearInterval(timerInterval.value);
});

watchEffect(() => {
  if (props.isRestart) {
    clearInterval(timerInterval.value);
    resetInterval();
  }
});
</script>
