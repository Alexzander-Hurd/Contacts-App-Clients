import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export const useUiStore = defineStore('ui', () => {

  const auth = useUserStore();
  const sidebarOpen = ref(false);
  const toasts = ref<Toast[]>([]);
  const isBusy = ref(false);
  const theme = ref(
    getStorage('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  );

  function getStorage(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  }

 

  async function toggleSidebar() {
    await auth.fetchUser()
    sidebarOpen.value = !sidebarOpen.value
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }

  function triggerToast(message: string, type: ToastType = 'info') {
    const id = crypto.randomUUID() // Unique ID for animations

    // Add to the stack
    toasts.value.push({ id, message, type })

    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    sidebarOpen,
    toasts,
    isBusy,
    theme,
    toggleSidebar,
    closeSidebar,
    toggleTheme,
    triggerToast,
    removeToast
  }
})

