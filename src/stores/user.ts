import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import type { DecodedGoogleUser } from '@/types';

export const useUserStore = defineStore(
  'user',
  () => {
    const isLoggedIn = ref(false);
    const user = reactive({
      name: '',
      email: '',
      picture: ''
    });

    const setUser = (newUser: DecodedGoogleUser) => {
      user.name = newUser.name;
      user.email = newUser.email;
      user.picture = newUser.picture;
      isLoggedIn.value = true;
    };

    const resetUser = () => {
      user.email = '';
      user.name = '';
      user.picture = '';
      isLoggedIn.value = false;
    };

    return { user, isLoggedIn, setUser, resetUser };
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['user', 'isLoggedIn']
    }
  }
);
