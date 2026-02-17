<script setup lang="ts">
import { client } from '@/api/api'
import { useUiStore } from '@/stores/ui'
import { ref } from 'vue'

const ui = useUiStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const success = ref(false)

async function submit() {
  isLoading.value = true

  if (password.value.length < 8) {
    ui.triggerToast('Password must be at least 8 characters', 'error')
    return
  }

  if (password.value !== confirmPassword.value) {
    ui.triggerToast('Passwords do not match', 'error')
    return
  }
  const { data, error } = await client.POST('/register', {
    body: {
      username: username.value,
      password: password.value,
    },
  })

  if (error) {
    isLoading.value = false
    console.error('Login error:', error.message ? error.message : error ? error : 'Unknown error')
    errorMessage.value = error.message || 'Login failed. Please try again.'
    return
  }

  if (data === null || data === undefined) {
    isLoading.value = false
    console.error('No data received')
    errorMessage.value = 'Login failed. Please try again.'
    return
  }

  isLoading.value = false
  success.value = true
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
          <span class="material-symbols-outlined text-5xl text-black dark:text-slate-300"
            >contact_page</span
          >
        </div>
        <h1 class="text-2xl font-semibold tracking-tight text-black dark:text-slate-300">
          ContactsApp
        </h1>
      </div>
    <div v-if="!success">
      <p v-if="errorMessage"
        class="text-md mb-6 w-full rounded-xl bg-red-600 px-4 py-2 text-center text-white"
      >
        {{ errorMessage }}
      </p>
      <div class="w-full space-y-4">
        <form @submit.prevent="submit">
          <div class="space-y-1.5">
            <label
              class="text-plum-muted px-1 text-xs font-medium tracking-wider uppercase"
              for="username"
              >Email</label
            >
            <input
              class="border-plum-border h-14 w-full rounded-xl border bg-[#faf5ff] px-4 text-black transition-all outline-none placeholder:text-[#715d7a] focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:bg-[#2d1b36] dark:text-slate-300"
              placeholder="name@example.com"
              id="username"
              type="email"
              v-model="username"
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
                class="border-plum-border h-14 w-full rounded-xl border bg-[#faf5ff] px-4 text-black transition-all outline-none placeholder:text-[#715d7a] focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:bg-[#2d1b36] dark:text-slate-300"
                placeholder="••••••••"
                id="password"
                v-model="password"
                type="password"
              />
              <button class="text-plum-muted absolute top-1/2 right-4 -translate-y-1/2">
                <span class="material-symbols-outlined text-xl">visibility</span>
              </button>
            </div>
          </div>
          <div class="space-y-1.5">
            <label
              class="text-plum-muted px-1 text-xs font-medium tracking-wider uppercase"
              for="confirm-password"
              >Confirm Password</label
            >
            <div class="relative">
              <input
                class="border-plum-border h-14 w-full rounded-xl border bg-[#faf5ff] px-4 text-black transition-all outline-none placeholder:text-[#715d7a] focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:bg-[#2d1b36] dark:text-slate-300"
                placeholder="••••••••"
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
              />
              <button class="text-plum-muted absolute top-1/2 right-4 -translate-y-1/2">
                <span class="material-symbols-outlined text-xl">visibility</span>
              </button>
            </div>
          </div>
          <div class="pt-6">
            <button
              :disabled="isLoading"
              class="shadow-primary/25 relative flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-purple-800 py-3 font-semibold text-white transition-all hover:scale-[1.05] hover:bg-purple-600 active:scale-[0.98] disabled:opacity-70 dark:bg-purple-600 hover:dark:bg-purple-500"
            >
              <p v-if="isLoading">
                <span class="material-symbols-outlined animate-spin">progress_activity</span>

                Signing Up...
              </p>
              <p v-else>Sign Up</p>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-else>
      <p class="text-md mb-6 w-full rounded-xl bg-green-600 px-4 py-2 text-center text-white">
        Account created successfully!
      </p>
    </div>

      <div class="flex items-center gap-1.5 pt-3 text-sm">
        <RouterLink
          to="/login"
          class="font-semibold text-black transition-colors hover:text-purple-600 dark:text-slate-300"
        >
          &larr; Go Back
        </RouterLink>
      </div>
      <div class="fixed bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-white/10"></div>
    </div>
  </div>
</template>
