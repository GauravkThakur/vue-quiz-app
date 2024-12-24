<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { GoogleLogin, googleLogout, type CallbackTypes, decodeCredential } from 'vue3-google-login';
import { useUserStore } from '@/stores/user';
import type { DecodedGoogleUser } from '@/types';

const op = ref();
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { user, setUser, resetUser } = userStore;

const onLogin: CallbackTypes.CredentialCallback = (response) => {
  const user = decodeCredential(response.credential) as DecodedGoogleUser;
  setUser(user);
};

const onLogout = () => {
  resetUser();
  googleLogout();
};

const onClick = (event: Event) => {
  op.value.toggle(event);
};
</script>

<template>
  <GoogleLogin v-if="!isLoggedIn" :callback="onLogin" prompt auto-login />
  <template v-else>
    <Button @click="onClick" severity="contrast" variant="outlined" class="p-1">
      <Avatar :image="user.picture" shape="circle" />
      <span class="version-icon pi pi-angle-down" />
    </Button>
    <Popover ref="op">
      <div class="flex items-center">
        <Avatar :image="user.picture" shape="circle" size="xlarge" />
        <div class="flex flex-col ml-4">
          <span class="font-medium">{{ user.name }}</span>
          <div class="text-sm text-surface-500 dark:text-surface-400">{{ user.email }}</div>
        </div>
      </div>
      <Divider />
      <Button
        label="Logout"
        icon="pi pi-sign-out"
        @click="onLogout"
        size="small"
        severity="contrast"
        variant="outlined"
      />
    </Popover>
  </template>
</template>
