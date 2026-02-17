<script setup lang="ts">
import { client } from '@/api/api'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import { onMounted, ref, watchEffect, computed } from 'vue'

const ui = useUiStore()
const auth = useUserStore()

// --- STATE: Profile Details ---
const profileForm = ref({
  name: '',
  email: '',
  extension: '',
})

// --- STATE: Password Change ---
const securityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const deleteConfirm = ref(false)
const contactLoading = ref(false)
const passwordLoading = ref(false)

// Load initial data from store
watchEffect(() => {
  if (auth.user?.contact) {
    profileForm.value.name = auth.user.contact.name || ''
    profileForm.value.email = auth.user.contact.email || ''
    profileForm.value.extension = auth.user.contact.extension || ''
  }
})

const firstName = computed(() => auth.user?.contact?.name?.split(' ')[0])
const lastName = computed(() => auth.user?.contact?.name?.split(' ')[1])

onMounted(() => {
  if (!auth.user) auth.fetchUser()
})

async function updateProfile() {
  if (contactLoading.value) return
  if (!auth.user?.contact?.id) return
  if (
    profileForm.value.name === auth.user.contact?.name &&
    profileForm.value.email === auth.user.contact?.email &&
    profileForm.value.extension === auth.user.contact?.extension
  ) {
    ui.triggerToast('New details cannot be the same as the current details', 'error')
    return
  }

  contactLoading.value = true

  const { data, error } = await client.PUT('/contacts/{id}', {
    params: { path: { id: auth.user.contact.id } },
    body: {
      name: profileForm.value.name,
      email: profileForm.value.email,
      extension: profileForm.value.extension,
    },
  })

  if (error) {
    ui.triggerToast('Failed to update profile', 'error')
  } else {
    // Update the global store immediately
    if (data) {
      auth.user.contact = data
    }
    ui.triggerToast('Profile updated successfully', 'success')
  }

  contactLoading.value = false
}

async function changePassword() {
  if (passwordLoading.value) return

  if (
    securityForm.value.currentPassword === '' ||
    securityForm.value.newPassword === '' ||
    securityForm.value.confirmPassword === ''
  ) {
    ui.triggerToast('All fields are required', 'error')
    return
  }

  if (securityForm.value.newPassword === securityForm.value.currentPassword) {
    ui.triggerToast('New password cannot be the same as the current password', 'error')
    return
  }

  if (securityForm.value.newPassword.length < 8) {
    ui.triggerToast('Password must be at least 8 characters', 'error')
    return
  }

  if (securityForm.value.newPassword !== securityForm.value.confirmPassword) {
    ui.triggerToast('Passwords do not match', 'error')
    return
  }

  passwordLoading.value = true

  const { error } = await client.POST('/update-password', {
    body: {
      oldPassword: securityForm.value.currentPassword,
      newPassword: securityForm.value.newPassword,
    },
  })

  if (error) {
    ui.triggerToast('Password change failed', 'error')
  } else {
    ui.triggerToast('Password changed!', 'success')
    // Reset form
    securityForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  }

  passwordLoading.value = false
}

async function deleteAccount() {
  ui.isBusy = true
  if (!deleteConfirm.value) {
    deleteConfirm.value = true
    // Reset confirmation if they don't click again within 3 seconds
    setTimeout(() => (deleteConfirm.value = false), 3000)
    return
  }

  // Actual Delete
  const { error } = await client.DELETE('/me', {})

  if (!error) {
    // Remove from local list
    ui.isBusy = false
    ui.triggerToast('Contact deleted', 'success')
    setTimeout(() => auth.logout(), 1000)
  } else {
    ui.isBusy = false
    ui.triggerToast(
      `Failed to delete contact:  ${error.message || 'Operation failed. Please try again.'}`,
      'error',
    )
  }

  deleteConfirm.value = false
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-8 p-6 pb-32">
    <div class="mb-8 flex items-center gap-4">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white shadow-lg shadow-purple-900/20"
      >
        <p v-if="firstName || lastName">
          {{ firstName?.charAt(0) || '' }}{{ lastName?.charAt(0) || '' }}
        </p>
        <p v-else>{{ auth.user?.contact?.email?.charAt(0) || '' }}</p>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p class="text-slate-500 dark:text-slate-400">Manage your account settings</p>
      </div>
    </div>

    <section
      class="rounded-3xl border border-slate-100 bg-purple-100 p-6 shadow-sm dark:border-purple-900 dark:bg-white/5"
    >
      <h2 class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
        <span class="material-symbols-outlined text-purple-500">badge</span>
        Contact Details
      </h2>

      <form
        @submit.prevent="updateProfile"
        class="space-y-4"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label class="block">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Full Name</span>
            <input
              v-model="profileForm.name"
              type="text"
              class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
            />
          </label>

          <label class="block">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Extension</span>
            <input
              v-model="profileForm.extension"
              type="text"
              class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
            />
          </label>
        </div>

        <label class="block">
          <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</span>
          <input
            v-model="profileForm.email"
            type="email"
            class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
          />
        </label>

        <div class="flex justify-end pt-2">
          <button
            class="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 focus:outline-none"
          >
            <p v-if="contactLoading">
              <span class="material-symbols-outlined animate-spin">progress_activity</span>
              Saving...
            </p>
            <p v-else>Save Changes</p>
          </button>
        </div>
      </form>
    </section>

    <section
      class="rounded-3xl border border-slate-100 bg-purple-100 p-6 shadow-sm dark:border-purple-900 dark:bg-white/5"
    >
      <h2 class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
        <span class="material-symbols-outlined text-purple-500">lock</span>
        Security
      </h2>

      <form
        @submit.prevent="changePassword"
        class="space-y-4"
      >
        <label class="block">
          <span class="text-sm font-medium text-slate-600 dark:text-slate-400"
            >Current Password</span
          >
          <input
            v-model="securityForm.currentPassword"
            type="password"
            class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
          />
        </label>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label class="block">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-400">New Password</span>
            <input
              v-model="securityForm.newPassword"
              type="password"
              class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
            />
          </label>

          <label class="block">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-400"
              >Confirm New Password</span
            >
            <input
              v-model="securityForm.confirmPassword"
              type="password"
              class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
            />
          </label>
        </div>

        <div class="flex justify-end pt-2">
          <button
            class="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 focus:outline-none"
          >
            <p v-if="passwordLoading">
              <span class="material-symbols-outlined animate-spin">progress_activity</span>
              Updating...
            </p>
            <p v-else>Update Password</p>
          </button>
        </div>
      </form>
    </section>
    <section
      class="mt-12 rounded-3xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10"
    >
      <h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-red-600 dark:text-red-400">
        <span class="material-symbols-outlined">warning</span>
        Danger Zone
      </h2>
      <p class="mb-6 text-sm text-slate-600 dark:text-slate-400">
        Once you delete your account, there is no going back. All your data will be permanently
        removed.
      </p>

      <button
        @click="() => deleteAccount()"
        type="button"
        class="py-3 px-2 font-medium transition-colors"
        :class="deleteConfirm ? 'rounded-xl bg-red-900/20 text-red-400' : 'text-red-400/70 hover:text-red-400'"
      >
        {{ deleteConfirm ? 'Click again to confirm delete' : 'Delete Account' }}
      </button>
    </section>
  </div>
</template>
