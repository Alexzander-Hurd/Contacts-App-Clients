<script lang="ts">
	import ContactCard from '$lib/components/ContactCard.svelte';
	import { onMount } from 'svelte';
	import { client } from '$lib/api/api';
	import type { components } from '$lib/api/schema';
	import { ui } from '$lib/ui.svelte';
	import { portal } from '$lib/Portal';
	import { fade, fly } from 'svelte/transition';

	type Contact = components['schemas']['Contact'];
	type Group = components['schemas']['GroupDetails'];

	let props = $props();
	let groupDetails: Group = props.data;
	let idToDelete: string = $state('');
	let formEmail: string = $state('');
	let formMode: string = $state('Add');
	let showForm: boolean = $state(false);
	let deleteConfirm = $state(false);
	let errorMessage: string = $state('');
	let contacts: Contact[] = $state([...(groupDetails.members || [])]);
	let searchQuery: string = $state('');
	let filteredContacts: Contact[] = $derived(
		contacts.filter(
			(contact) =>
				contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				contact.extension?.includes(searchQuery) ||
				contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
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
		ui.setBusy(false);
	});

	async function submit() {
		ui.setBusy(true);
		const { data, error } = await client.POST('/groups/{id}/members/{contact}', {
			params: {
				path: {
					id: groupDetails.id!,
					contact: formEmail
				}
			}
		});

		if (error) {
			ui.setBusy(false);
			console.error(
				'Add contact error:',
				error.message ? error.message : error ? error : 'Unknown error'
			);
			errorMessage = error.message || 'Operation failed. Please try again.';
			return;
		}

		if (data === null || data === undefined) {
			ui.setBusy(false);
			console.error('No data received');
			errorMessage = 'Operation failed. Please try again.';
			return;
		}

		contacts = [...contacts, data].sort((a, b) => a.name!.localeCompare(b.name!));

		ui.setBusy(false);
		showForm = false;
	}

	function addContact() {
		formMode = 'Add';
		idToDelete = '';
		formEmail = '';
		showForm = true;
	}

	function confirmDelete(id: string) {
		formMode = 'Delete';
		formEmail = '';
		idToDelete = id;
		showForm = true;
	}

	async function handleDelete() {
		if (!deleteConfirm) {
			deleteConfirm = true;
			// Reset confirmation if they don't click again within 3 seconds
			setTimeout(() => (deleteConfirm = false), 3000);
			return;
		}

		ui.setBusy(true);

		// Actual Delete
		const { error } = await client.DELETE('/groups/{id}/members/{contactId}', {
			params: { path: { id: groupDetails.id!, contactId: idToDelete } }
		});

		if (!error) {
			// Remove from local list
			contacts = contacts.filter((c) => c.id !== idToDelete);
			// ui.triggerToast('Contact deleted', 'success');
			showForm = false;
		}

		deleteConfirm = false;
		ui.setBusy(false);
	}
</script>

<div class="top-0 z-20 px-4 pt-6 pb-2 backdrop-blur-md">
	<div class="flex h-12 items-center justify-between">
		<h1
			class="align-center justify-center text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white"
		>
			Contacts
		</h1>
		<div class="flex gap-2">
			<button
				onclick={addContact}
				class="align-center m-auto justify-center rounded-full p-2 transition-transform hover:scale-110 hover:bg-purple-500 active:scale-95 active:bg-purple-600"
			>
				<span class="material-symbols-outlined text-primary align-center justify-center">add</span>
			</button>
		</div>
	</div>
</div>

<div class="px-4 py-2">
	<label class="flex h-11 w-full min-w-40 flex-col">
		<div class="flex h-full w-full flex-1 items-stretch rounded-xl bg-[#ede7f3] dark:bg-[#3d2a48]">
			<div class="align-center flex items-center justify-center rounded-l-xl pl-4 text-[#715d7a]">
				<span class="align-center material-symbols-outlined justify-center text-[20px]">search</span
				>
			</div>
			<input
				class="form-input flex h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-transparent px-3 text-base leading-normal font-normal text-[#0d141b] placeholder:text-[#715d7a] focus:ring-0 focus:outline-0 dark:text-slate-100"
				placeholder="Search name or number"
				bind:value={searchQuery}
			/>
		</div>
	</label>
</div>

<div class="flex-1 pb-42">
	{#each groupedContacts as group}
		<div
			class="text-primary/70 sticky top-12 z-10 bg-purple-50 px-4 py-1 text-xs font-bold uppercase dark:bg-purple-900/20"
		>
			{group.letter}
		</div>

		<div class="flex flex-col">
			{#each group.members as contact (contact.id)}
				<div class="align-center flex flex-row items-center justify-between gap-4 px-4 py-3">
					<div
						role="button"
						tabindex="0"
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault(); // Prevent scrolling when pressing Space
								confirmDelete(contact.id!);
							}
						}}
						onclick={() => confirmDelete(contact.id!)}
						class="mb-3 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-purple-100 p-4 text-left transition-colors hover:border-purple-600 hover:bg-purple-200 dark:border-white/10 dark:bg-white/5 dark:hover:border-purple-600 dark:hover:bg-white/10"
					>
						<ContactCard {contact} />
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
<button
	onclick={addContact}
	class="bg-primary fixed right-6 bottom-24 z-30 flex h-18 w-18 items-center justify-center rounded-full text-black shadow-lg shadow-purple-500/20 transition-transform hover:scale-110 hover:bg-purple-500 active:scale-95 active:bg-purple-600 dark:text-slate-300"
>
	<span class="material-symbols-outlined text-[42px]">person_add</span>
</button>

{#if showForm}
	<div use:portal>
		<button
			aria-label="close"
			class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
			onclick={() => (showForm = false)}
			transition:fade
		></button>

		<div
			class="fixed inset-x-0 bottom-0 z-[110] rounded-t-3xl bg-[#3d2a48] p-6 shadow-2xl"
			transition:fly={{ y: 500, duration: 400 }}
		>
			<h2 class="mb-4 text-xl font-bold text-white">
				{formMode === 'Add' ? 'Add' : 'Delete'} Contact
			</h2>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				{#if formMode === 'Add'}
					<div class="space-y-4">
						<div class="flex flex-col gap-1">
							<label class="text-sm font-medium text-white" for="email"
								>{formMode === 'Add' ? 'Enter Phone or' : 'Confirm'} Email</label
							>
							<input
								bind:value={formEmail}
								id="email"
								class="form-input w-full rounded-lg border border-purple-300 bg-white/10 px-4 py-2 text-white placeholder:text-purple-300 focus:border-transparent focus:ring-2 focus:ring-purple-500"
								placeholder={formMode === 'Add'
									? 'Email/Extension'
									: contacts.filter((contact) => contact.id === idToDelete)[0].email}
							/>
						</div>
					</div>
				{/if}
				<div class="mt-6 flex flex-row items-center justify-end gap-3">
						{#if idToDelete !== ''}
							<button
								onclick={handleDelete}
								type="button"
								class="py-3 font-medium transition-colors {deleteConfirm
									? 'rounded-xl bg-red-900/20 text-red-400'
									: 'text-red-400/70 hover:text-red-400'}"
							>
								{deleteConfirm ? 'Click again to confirm removal' : 'Remove from Group'}
							</button>
						{/if}
						{#if formMode === 'Add'}
							<button
								type="submit"
								class="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 focus:outline-none"
								>Add To Group</button
							>
						{/if}
				</div>
			</form>

			{#if errorMessage}
				<div class="mt-4 rounded-lg bg-red-100 p-4">
					<p class="text-sm font-medium text-red-800">{errorMessage}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
