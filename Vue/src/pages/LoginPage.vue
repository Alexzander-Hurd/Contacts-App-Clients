<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  try {
    await userStore.login({
      username: username.value,
      password: password.value,
    })

    // Redirect to home or contacts list on success
    router.push({ name: 'home' })
  } catch (err: unknown) {
    // Handle error based on your backend response structure
    errorMessage.value = err?.response?.data?.message || 'Invalid credentials. Please try again.'
    console.error('Login failed:', err)
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password') as HTMLInputElement
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
}
</script>

<template>
  <div
    class="align-center flex min-h-[calc(100vh)] w-full flex-1 flex-row items-center justify-center"
  >
    <div class="align-center flex max-w-lg flex-col items-center justify-center">
      <div class="w-max-md mb-16 flex flex-col items-center gap-3">
        <div
          class="bg-primary shadow-primary/20 flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl"
        >
          <span class="material-symbols-outlined text-5xl text-black dark:text-slate-300">
            contact_page
          </span>
        </div>
        <h1 class="text-2xl font-semibold tracking-tight text-black dark:text-slate-300">
          ContactsApp
        </h1>
      </div>
      <p
        :class="[
          'text-md mb-6 w-full rounded-xl bg-red-600 px-4 py-2 text-center text-white',
          errorMessage ? 'block' : 'hidden',
        ]"
      >
        {{ errorMessage }}
      </p>
      <div class="w-full space-y-4">
        <form @submit.prevent="handleLogin">
          <div class="space-y-1.5">
            <label
              class="text-plum-muted px-1 text-xs font-medium tracking-wider uppercase"
              for="username"
              >Email</label
            >
            <input
              class="border-plum-border focus:ring-purple-500 h-14 w-full rounded-xl border bg-[#faf5ff] dark:bg-[#2d1b36] px-4 text-black dark:text-slate-300 transition-all outline-none placeholder:text-[#715d7a] focus:border-transparent focus:ring-2"
              id="username"
              v-model="username"
              type="email"
              required
              placeholder="you@example.com"
              :disabled="userStore.isLoading"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="text-plum-muted px-1 text-xs font-medium tracking-wider uppercase"
              for="password"
              >Password</label
            >
            <div class="relative">
              <input
                class="border-plum-border focus:ring-purple-500 h-14 w-full rounded-xl border bg-[#faf5ff] dark:bg-[#2d1b36] px-4 text-black dark:text-slate-300 transition-all outline-none placeholder:text-[#715d7a] focus:border-transparent focus:ring-2"
                placeholder="••••••••"
                id="password"
                v-model="password"
                type="password"
                required
                :disabled="userStore.isLoading"
              />
              <button
                type="button"
                class="text-plum-muted absolute top-1/2 right-4 -translate-y-1/2"
                @click.prevent="togglePasswordVisibility"
              >
                <span class="material-symbols-outlined text-xl">visibility</span>
              </button>
            </div>
          </div>
          <div class="pt-6">
            <button
              :disabled="userStore.isLoading"
              class="shadow-primary/25 relative flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-purple-800 py-3 font-semibold text-white transition-all hover:scale-[1.05] hover:bg-purple-600 active:scale-[0.98] disabled:opacity-70 dark:bg-purple-600 hover:dark:bg-purple-500"
            >
              <p v-if="userStore.isLoading">
                <span class="material-symbols-outlined animate-spin">progress_activity</span>
                Logging in...
              </p>
              <p v-else>Log In</p>
              <p></p>
            </button>
          </div>
        </form>
      </div>
      <div class="mt-8 flex flex-col items-center gap-6">
        <div class="flex items-center gap-1.5 text-sm">
          <span class="text-plum-muted">Don't have an account?</span>
          <a
            href="/register"
            class="hover:text-purple-600 font-semibold text-black dark:text-slate-300 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>

      <div class="fixed bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-white/10"></div>
    </div>
  </div>
</template>
