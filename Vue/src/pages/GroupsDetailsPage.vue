<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { client } from '@/api/api'
import ContactCard from '@/components/ContactCard.vue'
import type { components } from '@/api/schema'

type Contact = components['schemas']['Contact']
type GroupDetails = components['schemas']['GroupDetails']

const route = useRoute()
const groupId = route.params.id as string

// State
const groupDetails = ref<GroupDetails | null>(null)
const contacts = ref<Contact[]>([])
const isLoading = ref(true)

// Modal State
const showForm = ref(false)
const formMode = ref<'Add' | 'Delete'>('Add')
const formEmail = ref('')
const idToDelete = ref('')
const errorMessage = ref('')
const deleteConfirm = ref(false)
const isBusy = ref(false) // Local busy state replacing ui.setBusy

// Search & Filter Logic
const searchQuery = ref('')

const filteredContacts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return contacts.value.filter(c => 
    c.name?.toLowerCase().includes(query) ||
    c.extension?.includes(query) ||
    c.email?.toLowerCase().includes(query)
  )
})

const groupedContacts = computed(() => {
  const groups: { letter: string; members: Contact[] }[] = []
  let currentLetter = ''

  filteredContacts.value.forEach(contact => {
    const name = contact.name || ''
    const firstLetter = name ? name.charAt(0).toUpperCase() : '#'
    
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter
      groups.push({ letter: currentLetter, members: [] })
    }
    
    const lastGroup = groups[groups.length - 1]
    if (lastGroup) lastGroup.members.push(contact)
  })

  return groups
})

// Lifecycle
onMounted(async () => {
  const { data, error } = await client.GET('/groups/{id}', {
    params: { path: { id: groupId } }
  })

  if (error) {
    console.error(error)
    isLoading.value = false
    return
  }
  
  if (data) {
    groupDetails.value = data
    contacts.value = data.members || []
  }
  isLoading.value = false
})

// Actions
function openAdd() {
  formMode.value = 'Add'
  idToDelete.value = ''
  formEmail.value = ''
  errorMessage.value = ''
  showForm.value = true
}

function openDelete(contactId: string) {
  formMode.value = 'Delete'
  idToDelete.value = contactId
  // Find email for display
  const contact = contacts.value.find(c => c.id === contactId)
  formEmail.value = contact?.email || '' // Just for display reference if needed
  errorMessage.value = ''
  deleteConfirm.value = false
  showForm.value = true
}

async function handleSubmit() {
  if (formMode.value === 'Delete') return // Should adhere to separate handler

  isBusy.value = true
  errorMessage.value = ''

  const { data, error } = await client.POST('/groups/{id}/members/{contact}', {
    params: {
      path: {
        id: groupId,
        contact: formEmail.value
      }
    }
  })

  if (error) {
    errorMessage.value = error.message || 'Operation failed'
    isBusy.value = false
    return
  }

  if (data) {
    // Add to list and sort
    contacts.value = [...contacts.value, data].sort((a, b) => 
      (a.name || '').localeCompare(b.name || '')
    )
    showForm.value = false
  }
  isBusy.value = false
}

async function handleDelete() {
  if (!deleteConfirm.value) {
    deleteConfirm.value = true
    setTimeout(() => (deleteConfirm.value = false), 3000)
    return
  }

  isBusy.value = true
  const { error } = await client.DELETE('/groups/{id}/members/{contactId}', {
    params: { path: { id: groupId, contactId: idToDelete.value } }
  })

  if (!error) {
    contacts.value = contacts.value.filter(c => c.id !== idToDelete.value)
    showForm.value = false
  } else {
    errorMessage.value = 'Failed to remove member'
  }
  
  deleteConfirm.value = false
  isBusy.value = false
}
</script>

<template>
  <div class="top-0 z-20 px-4 pt-6 pb-2 backdrop-blur-md">
    <div class="flex h-12 items-center justify-between">
      <div class="flex items-center gap-2">
         <RouterLink to="/groups" class="text-slate-500 hover:text-purple-600 dark:text-slate-400">
           <span class="material-symbols-outlined">arrow_back</span>
         </RouterLink>
         <h1 class="text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white">
           {{ groupDetails?.name || 'Loading...' }}
         </h1>
      </div>
      
      <button @click="openAdd" class="rounded-full p-2 transition-transform hover:scale-110 hover:bg-purple-500 active:scale-95 active:bg-purple-600">
         <span class="material-symbols-outlined text-purple-600 hover:text-white dark:text-purple-300 dark:hover:text-white">add</span>
      </button>
    </div>
  </div>

  <div class="px-4 py-2">
    <label class="flex h-11 w-full flex-col">
      <div class="flex h-full w-full items-stretch rounded-xl bg-[#ede7f3] dark:bg-[#3d2a48]">
        <div class="flex items-center justify-center rounded-l-xl pl-4 text-[#715d7a]">
          <span class="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          v-model="searchQuery"
          class="flex h-full w-full min-w-0 flex-1 resize-none rounded-xl border-none bg-transparent px-3 text-base text-[#0d141b] placeholder:text-[#715d7a] focus:ring-0 dark:text-slate-100"
          placeholder="Search name or number"
        />
      </div>
    </label>
  </div>

  <div class="flex-1 pb-42">
    <div v-for="group in groupedContacts" :key="group.letter">
      <div class="sticky top-12 z-10 bg-purple-50 px-4 py-1 text-xs font-bold uppercase dark:bg-purple-900/20 text-purple-700/70">
        {{ group.letter }}
      </div>

      <div class="flex flex-col">
        <div v-for="contact in group.members" :key="contact.id!" class="px-4 py-3">
          <div
            @click="openDelete(contact.id!)"
            @keydown.enter="openDelete(contact.id!)"
            role="button"
            tabindex="0"
            class="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-purple-100 p-4 transition-colors hover:border-purple-600 hover:bg-purple-200 dark:border-white/10 dark:bg-white/5 dark:hover:border-purple-600 dark:hover:bg-white/10"
          >
            <ContactCard :contact="contact" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <button
    @click="openAdd"
    class="fixed right-6 bottom-24 z-30 flex h-18 w-18 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
  >
    <span class="material-symbols-outlined text-[42px]">person_add</span>
  </button>

  <Teleport to="body">
    <div v-if="showForm" class="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <Transition name="fade" appear>
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showForm = false"></div>
      </Transition>

      <Transition name="slide-up" appear>
        <div class="fixed inset-x-0 bottom-0 z-[110] rounded-t-3xl bg-[#3d2a48] p-6 shadow-2xl">
          <h2 class="mb-4 text-xl font-bold text-white">
            {{ formMode === 'Add' ? 'Add' : 'Delete' }} Contact
          </h2>

          <form @submit.prevent="handleSubmit">
            <div v-if="formMode === 'Add'" class="space-y-4">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-white" for="email">Enter Phone or Email</label>
                <input
                  v-model="formEmail"
                  id="email"
                  class="w-full rounded-lg border border-purple-300 bg-white/10 px-4 py-2 text-white placeholder:text-purple-300 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Email/Extension"
                  required
                />
              </div>
            </div>

            <div v-else class="text-purple-200 mb-4">
              Are you sure you want to remove <strong>{{ contacts.find(c => c.id === idToDelete)?.name }}</strong> from this group?
            </div>

            <div class="mt-6 flex flex-row items-center justify-end gap-3">
              <button
                v-if="formMode === 'Delete'"
                @click="handleDelete"
                type="button"
                :disabled="isBusy"
                class="py-3 px-4 font-medium transition-colors"
                :class="deleteConfirm ? 'rounded-xl bg-red-900/20 text-red-400' : 'text-red-400/70 hover:text-red-400'"
              >
                {{ deleteConfirm ? 'Click again to confirm removal' : 'Remove from Group' }}
              </button>

              <button
                v-if="formMode === 'Add'"
                type="submit"
                :disabled="isBusy"
                class="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 focus:outline-none disabled:opacity-50"
              >
                {{ isBusy ? 'Adding...' : 'Add To Group' }}
              </button>
            </div>
          </form>

          <div v-if="errorMessage" class="mt-4 rounded-lg bg-red-100 p-4">
            <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
/* Reuse the same transitions as Admin View */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>