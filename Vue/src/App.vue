<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import HeaderBar from '@/components/HeaderBar.vue'
import SideDrawer from '@/components/SideDrawer.vue'
import Footer from '@/components/FooterNav.vue'
import { watchEffect } from 'vue'

const ui = useUiStore()
const user = useUserStore()

watchEffect(() => {
  document.body.style.overflow = ui.sidebarOpen ? 'hidden' : 'auto';
  document.documentElement.classList = ui.theme === 'dark' ? 'dark' : 'light'
})
</script>

<template>
  <div
    class="relative mx-auto flex min-h-screen w-full flex-col overflow-x-hidden shadow-2xl bg-white/80 dark:bg-slate-900/80"
  >
    <div class="min-h-screen text-slate-900 transition-colors dark:text-slate-100">
      <HeaderBar v-if="user.isAuthenticated" @toggle-menu="ui.toggleSidebar()" />

      <Transition name="fade">
        <div
          v-if="ui.sidebarOpen"
          @click="ui.closeSidebar()"
          class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        ></div>
      </Transition>

      <Transition name="slide">
        <aside
          v-if="ui.sidebarOpen"
          class="fixed top-0 right-0 z-[70] h-full w-72 bg-[#faf5ff] dark:bg-[#1a161f] shadow-2xl"
        >
          <SideDrawer @exit-menu="ui.closeSidebar()" />
        </aside>
      </Transition>

      <main class="dark:bg-slate-900/80" :class="{ 'pt-4': user.isAuthenticated }">
        <RouterView />
      </main>
      <Footer v-if="user.isAuthenticated"></Footer>
    </div>
  </div>
</template>

<style scoped>
/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
