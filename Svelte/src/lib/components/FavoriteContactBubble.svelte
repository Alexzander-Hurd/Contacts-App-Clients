<script lang="ts">
	import { onMount } from 'svelte';
	import type { components } from '$lib/api/schema';

	type Contact = components['schemas']['Contact'];

	let props = $props();
	let contact: Contact = props.contact;
	let firstName = contact.name?.split(' ')[0] || '';
	let lastName = contact.name?.split(' ')[1] || '';

	onMount(async () => {
		// You can fetch more details about the contact here if needed

		// For now, let's just log the contact
		console.log(contact);
	});
</script>

<div class="flex w-16 flex-col items-center gap-2">
	<div
		class="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold dark:bg-purple-900/40"
	>
		{firstName.charAt(0)}{lastName.charAt(0)}
	</div>
	<p class="text-xs font-medium text-[#0d141b] dark:text-slate-300">{contact.name}</p>
	<p class="text-xs text-slate-500 dark:text-slate-400">{contact.extension}</p>
</div>
