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
  <div class="flex w-16 flex-col items-center gap-2">
    <div
      class="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold dark:bg-purple-900/40"
    >
      <p v-if="firstName || lastName">
        {{ firstName.charAt(0).toUpperCase() || '' }}{{ lastName.charAt(0).toUpperCase() || '' }}
      </p>
      <p v-else>
        {{ contact.email?.charAt(0).toUpperCase() || '' }}
      </p>
    </div>
    <p class="text-xs font-medium text-[#0d141b] dark:text-slate-300">{{contact.name}}</p>
<p class="text-xs text-slate-500 dark:text-slate-400">{{contact.extension}}</p>
  </div>
</template>
