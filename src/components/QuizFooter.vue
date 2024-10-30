<template>
  <Toolbar class="h-20">
    <template #start>
      <Button
        label="Quit"
        severity="danger"
        icon="pi pi-stop"
        outlined
        @click.prevent.stop="emitQuit"
      />
    </template>
    <template #center>
      <Button
        label="Restart"
        severity="info"
        icon="pi pi-refresh"
        outlined
        @click.prevent.stop="emitRestart"
      />
    </template>
    <template #end>
      <Button
        label="Finish"
        severity="success"
        icon="pi pi-check"
        outlined
        @click.prevent.stop="emitFinish"
      />
    </template>
  </Toolbar>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();
const emit = defineEmits(['onQuizFinish', 'onQuizQuit', 'onQuizRestart']);

const emitFinish = () => {
  confirm.require({
    message: 'Please review your answers before finishing the quiz.',
    header: 'Finish Quiz',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Review Answers',
    rejectProps: {
      label: 'Review Answers',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Finish',
      severity: 'success'
    },
    accept: () => {
      emit('onQuizFinish');
    }
  });
};

const emitQuit = () => {
  confirm.require({
    message: 'Do you want to end this session?',
    header: 'End Quiz',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      emit('onQuizQuit');
    }
  });
};

const emitRestart = () => {
  confirm.require({
    message: 'Do you want to reset this session? All your previous changes will be lost.',
    header: 'Restart Quiz',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Reset',
      severity: 'info'
    },
    accept: () => {
      emit('onQuizRestart');
    }
  });
};
</script>
