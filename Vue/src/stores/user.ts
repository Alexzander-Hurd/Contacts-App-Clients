import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { client } from '@/api/api'
import { setTokens, clearTokens, access } from '@/api/auth'
import type { components, paths } from '@/api/schema'

type UserProfile = components['schemas']['UserSession'] | null | undefined;

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile | null>(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!access.value);

  async function fetchUser() {
    if (!isAuthenticated.value) return;

    isLoading.value = true;
    try {
      const {data, error} = await client.GET('/me');

      if (error) {
        logout();
        return;
      }

      user.value = data;
    } finally {
      isLoading.value = false;
    }
  }

  async function login(credentials: components['schemas']['LoginRequest']) {
    isLoading.value = true;
    try {
      const { data, error } = await client.POST('/login', {
        body: credentials
      });
      if (error) {
        throw error;
      }

      if (!data || !data.token || !data.refresh) {
        throw new Error('No data received');
      }

      setTokens(data?.token, data?.refresh);
      await fetchUser();
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    user.value = null;
    clearTokens();
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    fetchUser,
    login,
    logout
  }
})
