<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { client } from '@/api/api'
import type { components } from '@/api/schema'

type Group = components['schemas']['Group']

const groups = ref<Group[]>([])
const isLoading = ref(true)

// Fetch Groups
onMounted(async () => {
  const { data, error } = await client.GET('/groups')

  if (error) {
    console.error(error)
    isLoading.value = false
    return
  }
  
  if (data) {
    groups.value = data
  }
  isLoading.value = false
})

// Create Group (Using Prompt as per Svelte version)
const createGroup = async () => {
  const name = prompt("Enter group name:")
  if (!name) return

  const description = prompt("Enter description (optional):") || ""

  const { data: newGroup, error } = await client.POST('/groups', {
    body: { name, description }
  })

  if (newGroup) {
    groups.value.push(newGroup)
    alert('Group created!') // Simple alert to replace ui.triggerToast for now
  } else if (error) {
    alert('Failed to create group')
  }
}
</script>

<template>
  <div class="p-6 pb-24">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-slate-800 dark:text-white">Groups</h1>
      <button 
        @click="createGroup"
        class="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white shadow-lg transition-transform hover:scale-110 hover:bg-purple-500 active:scale-95 active:bg-purple-600 dark:text-slate-300"
      >
        <span class="material-symbols-outlined">add</span>
        New Group
      </button>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-slate-500">
      Loading...
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <RouterLink 
        v-for="group in groups" 
        :key="group.id!" 
        :to="`/groups/${group.id}`"
        class="group relative block rounded-2xl border border-slate-200 bg-purple-100 p-6 transition-all hover:border-purple-600 hover:bg-purple-200 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:hover:border-purple-600 dark:hover:bg-white/10"
      >
        <div class="mb-4 flex items-start justify-between">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-200 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
            <span class="material-symbols-outlined">group</span>
          </div>
        </div>

        <h3 class="mb-1 text-xl font-bold text-slate-800 transition-colors group-hover:text-purple-600 dark:text-white">
          {{ group.name }}
        </h3>
        <p class="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {{ group.description || 'No description' }}
        </p>
      </RouterLink>

      <div v-if="groups.length === 0" class="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 py-12 text-slate-400 dark:border-slate-700">
        <span class="material-symbols-outlined mb-4 text-6xl opacity-50">group_off</span>
        <p class="text-lg">No groups found.</p>
        <button @click="createGroup" class="mt-4 font-bold text-purple-600 hover:underline">
          Create your first group
        </button>
      </div>
    </div>
  </div>
</template>