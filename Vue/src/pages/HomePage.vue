<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { client } from '@/api/api'
import type { components } from '@/api/schema'
import FavouriteContactBubble from '@/components/FavouriteContactBubble.vue'
import ContactCard from '@/components/ContactCard.vue'

type Contact = components['schemas']['Contact']
type NewContact = components['schemas']['ContactDTO']

const emptyContact: Contact = { id: '', name: '', email: '', extension: '' }
const formContact = ref<Contact>({ ...emptyContact })
const showForm = ref(false)
const deleteConfirm = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const contacts = ref<Contact[]>([])
const favourites = ref<Contact[]>([])
const searchQuery = ref('')

// Derived: Filtered Contacts
const filteredContacts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return contacts.value.filter(
    (c) =>
      c.name?.toLowerCase().includes(query) ||
      c.extension?.includes(query) ||
      c.email?.toLowerCase().includes(query),
  )
})

// Derived: Grouped Contacts
const groupedContacts = computed(() => {
  const groups: { letter: string; members: Contact[] }[] = []
  let currentLetter = ''

  filteredContacts.value.forEach((contact) => {
    const firstLetter = contact.name ? contact.name.charAt(0).toUpperCase() : '#'
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter
      groups.push({ letter: currentLetter, members: [] })
    }
    // Fixed: Ensure the group exists before pushing
    const targetGroup = groups[groups.length - 1]
    if (targetGroup) {
      targetGroup.members.push(contact)
    }
  })
  return groups
})

const isFavorite = (contact: Contact) => favourites.value.some((f) => f.id === contact.id)

onMounted(async () => {
  const [contactsRes, favsRes] = await Promise.all([
    client.GET('/contacts'),
    client.GET('/contacts/favorites'),
  ])

  // Use the Nullish Coalescing operator (??) to provide a fallback array
  if (contactsRes.data) {
    contacts.value = [...(contactsRes.data ?? [])].sort((a, b) =>
      (a?.name ?? '').localeCompare(b?.name ?? ''),
    )
  }

  if (favsRes.data) {
    favourites.value = [...(favsRes.data ?? [])].sort((a, b) =>
      (a?.name ?? '').localeCompare(b?.name ?? ''),
    )
  }
})

async function submit() {
  isLoading.value = true
  const payload: NewContact = {
    name: formContact.value.name,
    email: formContact.value.email,
    extension: formContact.value.extension,
  }

  if (formContact.value.id === '') {
    const { data, error } = await client.POST('/contacts', { body: payload })

    // Type Guard: If error or no data, stop
    if (error || !data) {
      errorMessage.value = error?.message || 'Add failed'
      isLoading.value = false
      return
    }

    // Now TypeScript knows 'data' is a valid Contact
    contacts.value = [...contacts.value, data].sort((a, b) =>
      (a?.name ?? '').localeCompare(b?.name ?? ''),
    )
  } else {
    const { data, error } = await client.PUT('/contacts/{id}', {
      body: payload,
      params: { path: { id: formContact.value.id! } },
    })

    if (error || !data) {
      errorMessage.value = error?.message || 'Update failed'
      isLoading.value = false
      return
    }

    // Update the local arrays with the fresh data from response
    contacts.value = contacts.value
      .map((c) => (c.id === data.id ? data : c))
      .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))

    if (isFavorite(data)) {
      favourites.value = favourites.value
        .map((f) => (f.id === data.id ? data : f))
        .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))
    }
  }
  showForm.value = false
  isLoading.value = false
}

async function toggleFavorite(contact: Contact) {
  const alreadyFav = isFavorite(contact)
  if (!alreadyFav) {
    favourites.value = [...favourites.value, contact].sort((a, b) => a.name!.localeCompare(b.name!))
    const { error } = await client.POST('/contacts/favorites/{id}', {
      params: { path: { id: contact.id! } },
    })
    if (error) favourites.value = favourites.value.filter((f) => f.id !== contact.id)
  } else {
    favourites.value = favourites.value.filter((f) => f.id !== contact.id)
    const { error } = await client.DELETE('/contacts/favorites/{id}', {
      params: { path: { id: contact.id! } },
    })
    if (error)
      favourites.value = [...favourites.value, contact].sort((a, b) =>
        a.name!.localeCompare(b.name!),
      )
  }
}

async function handleDelete() {
  if (!deleteConfirm.value) {
    deleteConfirm.value = true
    setTimeout(() => (deleteConfirm.value = false), 3000)
    return
  }

  const { error } = await client.DELETE('/contacts/{id}', {
    params: { path: { id: formContact.value.id! } },
  })
  if (!error) {
    contacts.value = contacts.value.filter((c) => c.id !== formContact.value.id)
    favourites.value = favourites.value.filter((f) => f.id !== formContact.value.id)
    showForm.value = false
  }
  deleteConfirm.value = false
}

const openAdd = () => {
  formContact.value = { ...emptyContact }
  errorMessage.value = ''
  showForm.value = true
}
const openEdit = (contact: Contact) => {
  formContact.value = { ...contact }
  errorMessage.value = ''
  showForm.value = true
}
</script>

<template>
  <div class="top-0 z-20 px-4 pt-6 pb-2 backdrop-blur-md">
    <div class="flex h-12 items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white">Contacts</h1>
      <button
        @click="openAdd"
        class="rounded-full p-2 transition-transform hover:scale-110 hover:bg-purple-500 active:scale-95"
      >
        <span class="material-symbols-outlined">add</span>
      </button>
    </div>
  </div>

  <div class="px-4 py-2">
    <div class="flex h-11 w-full rounded-xl bg-[#ede7f3] dark:bg-[#3d2a48]">
      <div class="flex items-center pl-4 text-[#715d7a]">
        <span class="material-symbols-outlined text-[20px]">search</span>
      </div>
      <input
        v-model="searchQuery"
        class="flex-1 bg-transparent px-3 text-base outline-none border-none focus:ring-0 dark:text-slate-100"
        placeholder="Search name or number"
      />
    </div>
  </div>

  <div class="mt-4">
    <h3 class="px-4 pb-2 text-sm font-semibold uppercase text-[#5d4c61] dark:text-slate-400">
      Favourites
    </h3>
    <div class="no-scrollbar flex overflow-x-auto px-4 py-3 gap-6">
      <FavouriteContactBubble v-for="f in favourites" :key="f.id!" :contact="f" />
    </div>
  </div>

  <div class="flex-1 pb-32">
    <h3 class="px-4 pt-6 pb-2 text-lg font-bold dark:text-slate-200">All Contacts</h3>
    <div v-for="group in groupedContacts" :key="group.letter">
      <div
        class="sticky top-12 z-10 bg-purple-50 px-4 py-1 text-xs font-bold uppercase dark:bg-purple-900/20"
      >
        {{ group.letter }}
      </div>
      <div class="flex flex-col">
        <div v-for="contact in group.members" :key="contact.id!" class="px-4 py-3">
          <div
            @click="openEdit(contact)"
            class="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-purple-100 p-4 transition-colors hover:border-purple-600 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ContactCard :contact="contact" />
            <button
              @click.stop="toggleFavorite(contact)"
              class="p-2 transition-transform active:scale-75"
            >
              <span
                class="material-symbols-outlined text-[24px]"
                :class="isFavorite(contact) ? 'text-[#fa5118]' : 'text-gray-500'"
                :style="isFavorite(contact) ? 'font-variation-settings: \'FILL\' 1' : ''"
              >
                star
              </span>
            </button>
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
    <div v-if="showForm" class="fixed inset-0 z-[100] flex items-end">
      <Transition name="fade" appear>
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showForm = false"></div>
      </Transition>

      <Transition name="slide-up" appear>
        <div class="relative w-full rounded-t-3xl bg-[#3d2a48] p-6 shadow-2xl z-[110]">
          <h2 class="mb-4 text-xl font-bold text-white">
            {{ formContact.id === '' ? 'Add' : 'Update' }} Contact
          </h2>
          <form @submit.prevent="submit" class="space-y-4">
            <div
              v-for="field in ['name', 'email', 'extension'] as const"
              :key="field"
              class="flex flex-col gap-1"
            >
              <label class="text-sm font-medium text-white capitalize" :for="field">{{
                field
              }}</label>
              <input
                v-model="formContact[field]"
                :id="field"
                type="text"
                class="form-input w-full rounded-xl border border-purple-300/30 bg-white/10 px-4 py-3 text-white placeholder:text-purple-300/50 outline-none focus:ring-2 focus:ring-purple-500 transition-all dark:bg-black/20"
              />
            </div>
            <div class="mt-6 flex items-center justify-between">
              <button
                v-if="formContact.id"
                type="button"
                @click="handleDelete"
                :class="deleteConfirm ? 'bg-red-900/20 text-red-400' : 'text-red-400/70'"
                class="py-2 px-4 rounded-xl transition-all"
              >
                {{ deleteConfirm ? 'Confirm Delete?' : 'Delete' }}
              </button>
              <div v-else></div>
              <button
                type="submit"
                class="rounded-lg bg-purple-500 px-5 py-2.5 text-white font-medium"
              >
                {{ formContact.id === '' ? 'Add' : 'Update' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
