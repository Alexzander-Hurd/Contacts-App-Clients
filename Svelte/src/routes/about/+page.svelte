<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div in:fade class="mx-auto max-w-2xl px-6 py-12">
  <div class="mb-12 text-center">
    <h1 class="mb-4 text-4xl font-extrabold text-slate-900 dark:text-white">
      About Contacts App
    </h1>
    <p class="text-lg text-slate-600 dark:text-slate-400">
      A modern, cross-platform address book built to demonstrate the power of 
      <span class="font-semibold text-purple-600 dark:text-purple-400">Hybrid Architecture</span>.
    </p>
  </div>

  <div class="mb-12 grid gap-6 sm:grid-cols-2">
    <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        <span class="material-symbols-outlined text-orange-500">code</span>
        Frontend
      </h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Built with <span class="font-bold">Svelte 5</span> using Runes for fine-grained reactivity.
        Styled with <span class="font-bold">Tailwind CSS</span> for adaptive dark mode.
      </p>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        <span class="material-symbols-outlined text-blue-600">dns</span>
        Backend
      </h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Powered by <span class="font-bold">ASP.NET Core 8</span> Minimal APIs. 
        Secure stateless authentication via JWT.
      </p>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        <span class="material-symbols-outlined text-red-500">desktop_windows</span>
        Desktop
      </h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Wrapped with <span class="font-bold">Wails v3</span> (Go) to create a native 
        Windows executable with zero CGO dependencies.
      </p>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        <span class="material-symbols-outlined text-emerald-500">database</span>
        Data
      </h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Entity Framework Core managing relationships between Users, Contacts, and Groups.
      </p>
    </div>
  </div>

  <div class="border-t border-slate-200 pt-8 text-center dark:border-slate-700">
    <p class="text-sm text-slate-500 dark:text-slate-500">
      Version 1.0.0-alpha &bull; Created by Alexzander Hurd
    </p>
    <div class="mt-4 flex justify-center gap-4">
      <a 
        href="https://github.com/Alexzander-Hurd" 
        target="_blank" 
        class="flex items-center gap-1 text-sm font-medium text-purple-600 hover:underline dark:text-purple-400"
      >
        GitHub Profile
        <span class="material-symbols-outlined text-[16px]">open_in_new</span>
      </a>
    </div>
  </div>
</div>