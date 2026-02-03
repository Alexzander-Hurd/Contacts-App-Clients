<script lang="ts">
	import FavoriteContactBubble from '$lib/components/FavoriteContactBubble.svelte';
	import ContactCard from '$lib/components/ContactCard.svelte';
	import { onMount } from 'svelte';
	import { client } from '$lib/api/api';
	import type { components } from '$lib/api/schema';
	import { ui } from '$lib/ui.svelte';
	import { portal } from '$lib/Portal';
	import { fade, fly } from 'svelte/transition';

	type Contact = components['schemas']['Contact'];

	type NewContact = components['schemas']['ContactDTO'];

	const newContact: Contact = {
		id: '',
		name: '',
		email: '',
		extension: ''
	};

	let formContact: Contact = $state({
		id: '',
		name: '',
		email: '',
		extension: ''
	});
	let showForm: boolean = $state(false);
	let deleteConfirm = $state(false);
	let errorMessage: string = $state('');
	let isLoading: boolean = $state(false);
	let contacts: Contact[] = $state([]);
	let favourites: Contact[] = $state([]);
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
		const { data, error } = await client.GET('/contacts', { params: {} });

		if (error) {
			console.error(error);
		} else if (data === null || data === undefined) {
			console.error('No data received');
		} else {
			contacts = data.sort((a, b) => a.name!.localeCompare(b.name!));
		}

		const { data: fData, error: fError } = await client.GET('/contacts/favorites', { params: {} });

		if (fError) {
			console.error(fError);
		} else if (fData === null || fData === undefined) {
			console.error('No data received');
		} else {
			favourites = fData.sort((a, b) => a.name!.localeCompare(b.name!));
		}

		ui.setBusy(false);
	});

	async function submit() {
		isLoading = true;

		const payload: NewContact = {
			name: formContact.name,
			email: formContact.email,
			extension: formContact.extension
		};

		if (formContact.id === '') {
			const { data, error } = await client.POST('/contacts', {
				body: payload
			});
			if (error) {
				isLoading = false;
				console.error(
					'Add contact error:',
					error.message ? error.message : error ? error : 'Unknown error'
				);
				errorMessage = error.message || 'Operation failed. Please try again.';
				return;
			}

			if (data === null || data === undefined) {
				isLoading = false;
				console.error('No data received');
				errorMessage = 'Operation failed. Please try again.';
				return;
			}

			formContact = { ...newContact }; // Clear data
			showForm = false;
			isLoading = false;

			contacts = [...contacts, data].sort((a, b) => a.name!.localeCompare(b.name!));
		} else {
			const { data, error } = await client.PUT(`/contacts/{id}`, {
				body: payload,
				params: {
					path: {
						id: formContact.id!
					}
				}
			});
			if (error) {
				isLoading = false;
				console.error(
					'Update contact error:',
					error.message ? error.message : error ? error : 'Unknown error'
				);
				errorMessage = error.message || 'Operation failed. Please try again.';
				return;
			}

			if (data === null || data === undefined) {
				isLoading = false;
				console.error('No data received');
				errorMessage = 'Operation failed. Please try again.';
				return;
			}

			formContact = { ...newContact }; // Clear data
			showForm = false;
			isLoading = false;

			contacts = contacts
				.map((c) => {
					if (c.id === data.id) {
						return data;
					} else {
						return c;
					}
				})
				.sort((a, b) => a.name!.localeCompare(b.name!));

			if (favourites.find((f) => f.id === data.id)) {
				favourites = favourites
					.map((f) => {
						if (f.id === data.id) {
							console.log('Replaced');
							return data;
						} else {
							return f;
						}
					})
					.sort((a, b) => a.name!.localeCompare(b.name!));
			}
		}
	}

	async function toggleFavorite(contact: Contact) {
		let state = isFavorite(contact) ? false : true;

		if (state) {
			favourites = [...favourites, contact].sort((a, b) => a.name!.localeCompare(b.name!));
			const { data, error } = await client.POST(`/contacts/favorites/{id}`, {
				body: undefined,
				params: {
					path: {
						id: contact.id!
					}
				}
			});
			if (error || data === null || data === undefined) {
				console.error('Toggle favorite error:');
				if (state) {
					favourites = favourites.filter((f) => f.id !== contact.id);
				} else {
					favourites = [...favourites, contact].sort((a, b) => a.name!.localeCompare(b.name!));
				}
				return;
			}
		} else {
			favourites = favourites.filter((f) => f.id !== contact.id);
			const { data, error } = await client.DELETE(`/contacts/favorites/{id}`, {
				body: undefined,
				params: {
					path: {
						id: contact.id!
					}
				}
			});
			if (error || data === null || data === undefined) {
				console.error('Toggle favorite error:');
				if (state) {
					favourites = favourites.filter((f) => f.id !== contact.id);
				} else {
					favourites = [...favourites, contact].sort((a, b) => a.name!.localeCompare(b.name!));
				}
				return;
			}
		}
	}

	function isFavorite(contact: Contact) {
		const exists: Contact | null | undefined = favourites.find((f) => f.id === contact.id);

		if (exists !== undefined && exists !== null) {
			return true;
		} else {
			return false;
		}
	}

	function openAdd() {
		formContact = { ...newContact }; // Clear data
		showForm = true;
	}

	// 3. Helper to open "Edit Mode"
	function openEdit(contact: Contact) {
		// Clone the data so we don't mutate the list row while typing
		formContact = { ...contact };
		showForm = true;
	}

	async function handleDelete() {
		if (!deleteConfirm) {
			deleteConfirm = true;
			// Reset confirmation if they don't click again within 3 seconds
			setTimeout(() => (deleteConfirm = false), 3000);
			return;
		}

		// Actual Delete
		const { error } = await client.DELETE('/contacts/{id}', {
			params: { path: { id: formContact.id! } }
		});

		if (!error) {
			// Remove from local list
			contacts = contacts.filter((c) => c.id !== formContact.id);
			ui.triggerToast('Contact deleted', 'success');
			showForm = false;
		}
	}
</script>

<div
	class="bg-white/80/80 dark:bg-slate-900/80/80 sticky top-0 z-20 px-4 pt-6 pb-2 backdrop-blur-md"
>
	<div class="flex h-12 items-center justify-between">
		<h1
			class="align-center justify-center text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white"
		>
			Contacts
		</h1>
		<div class="flex gap-2">
			<button
				onclick={openAdd}
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
<div class="mt-4">
	<h3
		class="px-4 pb-2 text-sm font-semibold tracking-wider text-[#5d4c61] uppercase dark:text-slate-400"
	>
		Favourites
	</h3>
	<div class="no-scrollbar flex w-full overflow-x-auto px-4 py-3">
		<div class="flex min-h-min flex-row items-start justify-start gap-6">
			{#each favourites as f (f.id)}
				<FavoriteContactBubble contact={f} />
			{/each}
		</div>
	</div>
</div>

<div class="flex-1 pb-42">
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
				<div class="align-center flex flex-row items-center justify-between gap-4 px-4 py-3">
					<div
						role="button"
						tabindex="0"
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault(); // Prevent scrolling when pressing Space
								openEdit(contact);
							}
						}}
						onclick={() => openEdit(contact)}
						class="mb-3 flex w-full items-center justify-between rounded-xl bg-white/5 p-4 text-left transition-colors hover:bg-white/10"
					>
						<ContactCard {contact} />

						<button
							onclick={(e) => {
								e.stopPropagation();
								toggleFavorite(contact);
							}}
							class="p-2 transition-transform active:scale-75"
						>
							<span
								class="material-symbols-outlined text-[24px] transition-colors duration-300
            				{isFavorite(contact) ? 'fill-current text-[#fa5118]' : 'text-gray-500'}"
								style={isFavorite(contact) ? 'font-variation-settings: "FILL" 1' : ''}
							>
								star
							</span>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
<button
	onclick={openAdd}
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
				{formContact.id === '' ? 'Add' : 'Update'} Contact
			</h2>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				<div class="space-y-4">
					<div class="flex flex-col gap-1">
						<label class="text-sm font-medium text-white" for="name">Name</label>
						<input
							bind:value={formContact.name}
							class="form-input w-full rounded-lg border border-purple-300 bg-white/10 px-4 py-2 text-white placeholder:text-purple-300 focus:border-transparent focus:ring-2 focus:ring-purple-500"
							placeholder="Full Name"
						/>
					</div>
					<div class="flex flex-col gap-1">
						<label class="text-sm font-medium text-white" for="email">Email</label>
						<input
							bind:value={formContact.email}
							class="form-input w-full rounded-lg border border-purple-300 bg-white/10 px-4 py-2 text-white placeholder:text-purple-300 focus:border-transparent focus:ring-2 focus:ring-purple-500"
							placeholder="Email"
						/>
					</div>
					<div class="flex flex-col gap-1">
						<label class="text-sm font-medium text-white" for="extension">Extension</label>
						<input
							bind:value={formContact.extension}
							class="form-input w-full rounded-lg border border-purple-300 bg-white/10 px-4 py-2 text-white placeholder:text-purple-300 focus:border-transparent focus:ring-2 focus:ring-purple-500"
							placeholder="Extension"
						/>
					</div>
				</div>

				<div class="mt-6 flex flex-row items-center justify-between gap-3">
					<div>
						{#if formContact.id !== ''}
							<button
								onclick={handleDelete}
								type="button"
								class="py-3 font-medium transition-colors {deleteConfirm
									? 'rounded-xl bg-red-900/20 text-red-400'
									: 'text-red-400/70 hover:text-red-400'}"
							>
								{deleteConfirm ? 'Click again to confirm delete' : 'Delete Contact'}
							</button>
						{/if}
					</div>
					<div>
						<button
							type="submit"
							class="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 focus:outline-none"
							>{formContact.id === '' ? 'Add' : 'Update'} Contact</button
						>
					</div>
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
