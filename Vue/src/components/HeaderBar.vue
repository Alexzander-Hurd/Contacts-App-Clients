<script setup lang="ts">
const emit = defineEmits<{
  (e: 'toggleMenu'): void
}>()
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-white/10 bg-[#3d2a48]/80 backdrop-blur-md">
    <div class="flex items-center w-full"></div>
    <div class="align-items-center flex flex-row justify-center py-2 w-full">
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <RouterLink to="/">
        <img class="block w-48 brightness-0 invert" src="/images/logo.png" alt="logo" />
      </RouterLink>
    </div>
    <div class="flex items-center w-full justify-end">
      <button @click="emit('toggleMenu')" class="p-2">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </nav>
</template>
