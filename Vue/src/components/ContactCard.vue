<script setup lang="ts">
import { computed } from 'vue'
import type { components } from '@/api/schema'

type Contact = components['schemas']['Contact']

const props = defineProps<{
  contact: Contact
}>()

const { contact }: { contact: Contact } = props
const firstName = computed(() => contact.name?.split(' ')[0] || '')
const lastName = computed(() => contact.name?.split(' ')[1] || '')
</script>

<template>
  <div class="flex items-center gap-4 px-4 py-3 dark:border-purple-900/10">
    <div
      class="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 font-bold dark:bg-purple-900/40"
    >
      <p v-if="firstName || lastName">
        {{ firstName.charAt(0).toUpperCase() || '' }}{{ lastName.charAt(0).toUpperCase() || '' }}
      </p>
      <p v-else>
        {{ contact.email?.charAt(0).toUpperCase() || '' }}
      </p>
    </div>
    <div class="flex flex-col">
      <span class="text-sm font-semibold text-[#0d141b] dark:text-white">{{contact.name}}</span>
      <span class="text-xs text-slate-500 dark:text-slate-400"
        >Extension • {{contact.extension}}</span
      >
      <span class="text-xs text-slate-500 dark:text-slate-400">Email • {{contact.email}}</span>
    </div>
  </div>
</template>
