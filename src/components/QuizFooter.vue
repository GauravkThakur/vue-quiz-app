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
        label="Submit"
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

const showConfirmDialog = (message, header, acceptLabel, acceptSeverity, emitEvent) => {
  confirm.require({
    message,
    header,
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: acceptLabel,
      severity: acceptSeverity
    },
    accept: () => {
      emit(emitEvent);
    }
  });
};

const emitFinish = () => {
  showConfirmDialog(
    'Please review your answers before finishing the quiz.',
    'Finish Quiz',
    'Submit',
    'success',
    'onQuizFinish'
  );
};

const emitQuit = () => {
  showConfirmDialog('Do you want to end this session?', 'End Quiz', 'End', 'danger', 'onQuizQuit');
};

const emitRestart = () => {
  showConfirmDialog(
    'Do you want to reset this session? All your previous changes will be lost.',
    'Restart Quiz',
    'Reset',
    'info',
    'onQuizRestart'
  );
};
</script>
