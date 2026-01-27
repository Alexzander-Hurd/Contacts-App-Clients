<script lang="ts">
	import FavoriteContactBubble from '$lib/components/FavoriteContactBubble.svelte';
	import ContactCard from '$lib/components/ContactCard.svelte';
	import { onMount } from 'svelte';
	import { client } from '$lib/api/api';
	import type { components } from '$lib/api/schema';

	type Contact = components['schemas']['Contact'];

	let contacts: Contact[] = $state([]);
	let favourites: Contact[] = $state([]);
	let searchQuery: string = $state('');
	let filteredContacts: Contact[] = $derived(contacts.filter((contact) =>
		contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
		contact.extension?.includes(searchQuery) ||
		contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
	));
	const groupedContacts = $derived.by(() => {
		const groups: { letter: string; members: Contact[] }[] = [];
		let currentLetter = '';

		filteredContacts.forEach((contact) => {
			const firstLetter = contact.name ? contact.name.charAt(0).toUpperCase() : '#';
			if (firstLetter !== currentLetter) {
				currentLetter = firstLetter;
				groups.push({ letter: currentLetter, members: [] });
			}
			groups[groups.length - 1].members.push(contact);
		});

		return groups;
	});

	onMount(async () => {
		const { data, error } = await client.GET('/contacts', { params: {} });

		if (error) {
			console.error(error);
		} else if (data === null || data === undefined) {
			console.error('No data received');
		} else {
			contacts = data.sort((a, b) => a.name!.localeCompare(b.name!));
		}

		const { data: fData , error: fError } = await client.GET('/contacts/favorites', { params: {} });

		if (fError) {
			console.error(fError);
		} else if (fData === null || fData === undefined) {
			console.error('No data received');
		} else {
			favourites = fData.sort((a, b) => a.name!.localeCompare(b.name!));
		}
	});

</script>

<div
	class="bg-white/80/80 dark:bg-slate-900/80/80 sticky top-0 z-20 px-4 pt-6 pb-2 backdrop-blur-md"
>
	<div class="flex h-12 items-center justify-between">
		<h1 class="text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white">Contacts</h1>
		<div class="flex gap-2">
			<button class="rounded-full p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30">
				<span class="material-symbols-outlined text-primary">add</span>
			</button>
		</div>
	</div>
</div>

<div class="px-4 py-2">
	<label class="flex h-11 w-full min-w-40 flex-col">
		<div class="flex h-full w-full flex-1 items-stretch rounded-xl bg-[#ede7f3] dark:bg-[#3d2a48]">
			<div class="flex items-center justify-center rounded-l-xl pl-4 text-[#715d7a]">
				<span class="material-symbols-outlined text-[20px]">search</span>
			</div>
			<input
				class="form-input flex h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-transparent px-3 text-base leading-normal font-normal text-[#0d141b] placeholder:text-[#715d7a] focus:ring-0 focus:outline-0 dark:text-slate-100"
				placeholder="Search name or number"
				bind:value={searchQuery}
			/>
		</div>
	</label>
</div>
<div class="mt-4">
	<h3
		class="px-4 pb-2 text-sm font-semibold tracking-wider text-[#5d4c61] uppercase dark:text-slate-400"
	>
		Favourites
	</h3>
	<div class="no-scrollbar flex w-full overflow-x-auto px-4 py-3">
		<div class="flex min-h-min flex-row items-start justify-start gap-6">
			{#each favourites as f (f.id)}
				<FavoriteContactBubble contact={f}/>
			{/each}
		</div>
	</div>
</div>

<div class="flex-1 pb-24">
	<h3
		class="px-4 pt-6 pb-2 text-lg leading-tight font-bold tracking-[-0.015em] text-[#0d141b] dark:text-slate-200"
	>
		All Contacts
	</h3>

	{#each groupedContacts as group}
		<div
			class="text-primary/70 sticky top-12 z-10 bg-purple-50 px-4 py-1 text-xs font-bold uppercase dark:bg-purple-900/20"
		>
			{group.letter}
		</div>

		<div class="flex flex-col">
			{#each group.members as contact (contact.id)}
				<ContactCard {contact} />
			{/each}
		</div>
	{/each}
</div>
<button
	class="bg-primary fixed right-6 bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-purple-500/20 transition-transform active:scale-95"
>
	<span class="material-symbols-outlined text-[28px]">person_add</span>
</button>
