<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import HeaderBar from '@/components/HeaderBar.vue'
import SideDrawer from '@/components/SideDrawer.vue'

const ui = useUiStore()
const user = useUserStore()
</script>

<template>
  <div :class="ui.theme">
    <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#1a0f1f] dark:text-slate-100">
      
      <HeaderBar 
        v-if="user.isAuthenticated" 
        @toggle-menu="ui.toggleSidebar()" 
      />

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
          class="fixed top-0 right-0 z-50 h-full w-80 border-l border-white/10 bg-white shadow-2xl dark:bg-[#1a0f1f]"
        >
          <SideDrawer @exit-menu="ui.closeSidebar()" />
        </aside>
      </Transition>

      <main :class="{ 'pt-4': user.isAuthenticated }">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Slide Transition */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

/* Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>