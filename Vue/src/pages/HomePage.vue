<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const errorMessage = ref('')

async function handleLogout() {
  console.log('Logging out...');
  errorMessage.value = ''

  try {
    await userStore.logout();

    // Redirect to home or contacts list on success
    router.push({ name: 'login' })
  } catch (err: unknown) {
    // Handle error based on your backend response structure
    errorMessage.value = err?.response?.data?.message || 'Invalid credentials. Please try again.'
    console.error('Login failed:', err)
  }
}
</script>

<template>
  <div
    class="align-center flex min-h-[calc(100vh)] w-full flex-1 flex-row items-center justify-center"
  >
    <div class="align-center flex max-w-lg flex-col items-center justify-center">
      <p class="text-2xl font-semibold tracking-tight text-black dark:text-slate-300">
        ContactsApp
      </p>
      <button
        @click="handleLogout"
        :disabled="userStore.isLoading"
        class="shadow-primary/25 relative flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-purple-800 py-3 font-semibold text-white transition-all hover:scale-[1.05] hover:bg-purple-600 active:scale-[0.98] disabled:opacity-70 dark:bg-purple-600 hover:dark:bg-purple-500"
      >
        <p v-if="userStore.isLoading">
          <span class="material-symbols-outlined animate-spin">progress_activity</span>
          Logging Out...
        </p>
        <p v-else>Log Out</p>

        <p></p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  background: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-banner {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>
