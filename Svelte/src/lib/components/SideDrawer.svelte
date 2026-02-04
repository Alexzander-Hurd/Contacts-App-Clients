<script lang="ts">
	import { auth } from '$lib/auth.svelte';
	import { ui } from '$lib/ui.svelte';
	import type { components } from '$lib/api/schema';

	let userContact: components['schemas']['Contact'] | null = $derived(auth.userContact);
	let firstName: string = $derived(auth.firstName);
	let lastName: string = $derived(auth.lastName);

	$effect(() => {
		document.body.style.overflow = ui.sidebarOpen ? 'hidden' : 'auto';
	});
</script>

<div class="flex h-full flex-col justify-between">
	<div class="flex h-36 flex-col items-center justify-center px-4">
		<div class="flex h-full w-full flex-row items-center justify-start gap-4 px-4">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-bold text-black dark:bg-purple-900/40 dark:text-white"
			>
				{firstName.charAt(0)}{lastName.charAt(0)}
			</div>
			<div class="flex flex-col">
				<h2 class="text-xl font-bold text-black dark:text-slate-300">
					{userContact?.name || userContact?.email?.split('@')[0]}
				</h2>
				<span class="text-sm text-purple-600 dark:text-purple-400">{userContact?.email}</span>
			</div>
		</div>
		<hr class="my-2 h-px w-full border-1 bg-white dark:bg-gray-700" />
	</div>
	<div class="flex h-full flex-col items-center justify-start px-4">
		<div class="flex h-16 items-center justify-center px-4">
			<a
				onclick={() => ui.closeSidebar()}
				href="/about"
				class="text-xl font-bold text-black dark:text-slate-300">About</a
			>
		</div>
		{#if auth.admin}
			<div class="flex h-16 items-center justify-center px-4">
				<a
					onclick={() => ui.closeSidebar()}
					href="/admin"
					class="text-xl font-bold text-black dark:text-slate-300">Admin</a
				>
			</div>
		{/if}
		<div class="flex h-16 items-center justify-center px-4">
			<a
				onclick={() => ui.closeSidebar()}
				href="/profile"
				class="text-xl font-bold text-black dark:text-slate-300">Profile</a
			>
		</div>
	</div>
	<div class="flex h-36 flex-col items-center justify-center px-6">
		<hr class="my-2 h-px w-full border-1 bg-white dark:bg-gray-700" />
		<div class="flex h-36 w-full flex-col items-center justify-center px-4">
			<button
				onclick={() => ui.toggleTheme()}
				class="flex w-full items-center justify-between rounded-xl py-3 text-lg font-medium text-slate-700 transition-transform active:scale-95 dark:text-slate-300"
			>
				<div class="flex items-center gap-2">
					<span class="material-symbols-outlined text-[20px]">
						{ui.theme === 'dark' ? 'dark_mode' : 'light_mode'}
					</span>
					<span>Dark Mode</span>
				</div>

				<div
					class="pointer-events-none relative h-6 w-11 rounded-full bg-slate-200 transition-colors dark:bg-purple-600"
				>
					<div
						class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform {ui.theme ===
						'dark'
							? 'translate-x-5'
							: ''}"
					></div>
				</div>
			</button>

			<hr class="my-2 h-px w-full border-1 bg-white dark:bg-gray-700" />
			<button
				onclick={() => {
					auth.logout();
					ui.closeSidebar();
				}}
				class="flex w-full items-center justify-between rounded-xl py-2 text-lg font-bold text-red-500 transition-transform hover:text-red-600 active:scale-95"
			>
				<div class="flex items-center gap-2">
					<span class="material-symbols-outlined text-[20px]">logout</span>
					<span>Logout</span>
				</div>
			</button>
		</div>
	</div>
</div>
