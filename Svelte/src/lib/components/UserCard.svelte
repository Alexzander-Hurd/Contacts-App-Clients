<script lang="ts">
	import { onMount } from 'svelte';
	import type { components } from '$lib/api/schema';

	type User = components['schemas']['User'];

	let { user }: { user: User } = $props();
	let contact = $derived(user.contact);
	let firstName = $derived(user.contact?.name?.split(' ')[0] || '');
	let lastName = $derived(user.contact?.name?.split(' ')[1] || '');

	onMount(async () => {});
</script>

<div class="flex items-center gap-4 px-4 py-3 dark:border-purple-900/10">
	<div
		class="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 font-bold dark:bg-purple-900/40"
	>
		{#if firstName || lastName}
			{firstName.charAt(0).toUpperCase()}{lastName.charAt(0).toUpperCase()}
		{:else}
			{user.username!.charAt(0).toUpperCase() || ''}
		{/if}
	</div>
	<div class="flex flex-col">
		<span class="text-sm font-semibold text-[#0d141b] dark:text-white">{user.username}</span>
		<span class="text-xs text-slate-500 dark:text-slate-400">Role • {user.role}</span>
		<span class="text-xs text-slate-500 dark:text-slate-400">Id • {user.id}</span>
	</div>
	<div class="flex flex-col">
		<span class="text-xs text-slate-500 dark:text-slate-400">Name • {contact?.name}</span>
		<span class="text-xs text-slate-500 dark:text-slate-400">Extension • {contact?.extension}</span>
		<span class="text-xs text-slate-500 dark:text-slate-400">Email • {contact?.email}</span>
	</div>
</div>
