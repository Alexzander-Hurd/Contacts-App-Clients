<script lang="ts">
	import { onMount } from 'svelte';
	import type { components } from '$lib/api/schema';

	type Contact = components['schemas']['Contact'];

	let { contact }: { contact: Contact } =  $props();
	let firstName = $derived(contact.name?.split(' ')[0] || '');
	let lastName = $derived(contact.name?.split(' ')[1] || '');

	onMount(async () => {
	});
</script>

<div class="flex items-center gap-4 border-b border-purple-50 px-4 py-3 dark:border-purple-900/10">
	<div
		class="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold dark:bg-purple-900/40"
	>
		{firstName.charAt(0).toUpperCase()}{lastName.charAt(0).toUpperCase()}
	</div>
	<div class="flex flex-col">
		<span class="text-sm font-semibold text-[#0d141b] dark:text-white">{contact.name}</span>
		<span class="text-xs text-slate-500 dark:text-slate-400">Extension • {contact.extension}</span>
		<span class="text-xs text-slate-500 dark:text-slate-400">Email • {contact.email}</span>
	</div>
</div>
