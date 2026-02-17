<script setup lang="ts">
import {RouterLink, useRoute} from 'vue-router';

const page = useRoute();

const isActive = (path: string) => page.path === path;

</script>

<template>
  <div
    class="fixed right-0 bottom-0 left-0 z-40 mx-auto flex h-20 w-full items-center justify-between border-t border-purple-100 bg-white/90 px-6 backdrop-blur-lg dark:border-purple-900/60 dark:bg-slate-900/90"
  >
    <div class="flex w-full items-center justify-center">
      <RouterLink
		to="/"
        :class="isActive('/') ? 'text-primary active-tab' 
		: 'hover:text-primary text-[#a394aa] transition-colors dark:text-[#715d7a]'"
		class="flex flex-col items-center gap-1"
      >
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
          >contacts</span
        >
        <span class="text-[10px] font-medium">Contacts</span>
	  </RouterLink>
    </div>
    <div class="flex w-full items-center justify-center">
      <RouterLink
		to="/groups"
		:class="isActive('/groups') ? 'text-primary active-tab'
		: 'hover:text-primary text-[#a394aa] transition-colors dark:text-[#715d7a]'"
		class="flex flex-col items-center gap-1"
       >
        <span class="material-symbols-outlined">group</span>
        <span class="text-[10px] font-medium">Groups</span>
	  </RouterLink>
    </div>
    <div class="flex w-full items-center justify-center">
      <RouterLink
		to="/profile"
		:class="isActive('/profile') ? 'text-primary active-tab'
		: 'hover:text-primary text-[#a394aa] transition-colors dark:text-[#715d7a]'"
		class="flex flex-col items-center gap-1"
        >
        <span class="material-symbols-outlined">account_circle</span>
        <span class="text-[10px] font-medium">Profile</span>
	  </RouterLink>
    </div>
  </div>
</template>
