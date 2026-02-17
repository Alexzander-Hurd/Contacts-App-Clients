<script setup lang="ts">
import type { components } from '@/api/schema'
import { computed } from 'vue'

type User = components['schemas']['User']

const props = defineProps<{
  user: User
}>()

const { user }: { user: User } = props
const firstName = computed(() => user.contact?.name?.split(' ')[0] || '')
const lastName = computed(() => user.contact?.name?.split(' ')[1] || '')
</script>

<template>
  <div class="flex items-center gap-4 px-4 py-3 dark:border-purple-900/10">
    <div
      class="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 font-bold dark:bg-purple-900/40"
    >
      <p v-if="firstName || lastName">
        {{firstName.charAt(0).toUpperCase() || '' + lastName.charAt(0).toUpperCase() || ''}}
      </p>
      <p v-else>{{user.username!.charAt(0).toUpperCase() || ''}}</p>
    </div>
    <div class="flex flex-col">
      <span class="text-sm font-semibold text-[#0d141b] dark:text-white">{{user.username}}</span>
      <span class="text-xs text-slate-500 dark:text-slate-400">Role • {{user.role}}</span>
      <span class="text-xs text-slate-500 dark:text-slate-400">Id • {{user.id}}</span>
    </div>
    <div class="flex flex-col">
      <span class="text-xs text-slate-500 dark:text-slate-400">Name • {{user.contact?.name}}</span>
      <span class="text-xs text-slate-500 dark:text-slate-400"
        >Extension • {{user.contact?.extension}}</span
      >
      <span class="text-xs text-slate-500 dark:text-slate-400">Email • {{user.contact?.email}}</span>
    </div>
  </div>
</template>
