<script lang="ts">
	import ContactCard from '$lib/components/ContactCard.svelte';
	import { onMount } from 'svelte';
	import { client } from '$lib/api/api';
	import type { components } from '$lib/api/schema';
	import { ui } from '$lib/ui.svelte';
	import { portal } from '$lib/Portal';
	import { fade, fly } from 'svelte/transition';
	import UserCard from '$lib/components/UserCard.svelte';

	type Contact = components['schemas']['Contact'];
	type Group = components['schemas']['GroupDetails'];
	type User = components['schemas']['User'];

	let users: User[] = $state([]);
	let idToDelete: string = $state('');
	let showForm: boolean = $state(false);
	let deleteConfirm = $state(false);
	let message: string = $state('');
	let searchQuery: string = $state('');
	let filteredUsers: User[] = $derived(
		users.filter(
			(user) =>
				user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.contact?.extension?.includes(searchQuery) ||
				user.contact?.email?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
	const groupedUsers = $derived.by(() => {
		const groups: { letter: string; members: User[] }[] = [];
		let currentLetter = '';

		filteredUsers.forEach((user) => {
			const firstLetter = user.contact?.name
				? user.contact.name.trim().charAt(0).toUpperCase()
				: '#';
			if (firstLetter !== currentLetter) {
				currentLetter = firstLetter;
				groups.push({ letter: currentLetter, members: [] });
			}
			groups[groups.length - 1].members.push(user);
		});

		return groups;
	});

	onMount(async () => {
		const { data, error } = await client.GET('/admin', { params: {} });

		if (error) {
			console.error(error);
		} else if (data === null || data === undefined) {
			console.error('No data received');
		} else {
			users = data;
		}
	});

	function confirmDelete(id: string) {
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

		// Actual Delete
		const { error } = await client.DELETE('/users/{id}', {
			params: { path: { id: idToDelete } }
		});

		if (!error) {
			// Remove from local list
			users = users.filter((c) => c.id !== idToDelete);
			ui.triggerToast('Contact deleted', 'success');
			showForm = false;
		} else {
			ui.triggerToast(
				`Failed to delete user ${idToDelete}:  ${error.message || 'Operation failed. Please try again.'}`,
				'error'
			);
		}

		deleteConfirm = false;
	}

	async function resetPassword(id: string) {
		const { data, error } = await client.POST('/admin/reset-password/{id}', {
			params: { path: { id: id } }
		});

		if (error) {
			ui.triggerToast('Failed to reset password', 'error');
			return;
		}

		if (data) {
			if (!data.message) ui.triggerToast('Password reset', 'success');
			else message = data.message;
		}
	}
</script>

<div class="top-0 z-20 px-4 pt-6 pb-2 backdrop-blur-md">
	<div class="flex h-12 items-center justify-start">
		<h1
			class="align-center justify-center text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white"
		>
			Users
		</h1>
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
	{#each groupedUsers as group}
		<div
			class="text-primary/70 sticky top-12 z-10 bg-purple-50 px-4 py-1 text-xs font-bold uppercase dark:bg-purple-900/20"
		>
			{group.letter}
		</div>

		<div class="flex flex-col">
			{#each group.members as user (user.id)}
				<div class="align-center flex flex-row items-center justify-between gap-4 px-4 py-3">
					<div
						role="button"
						tabindex="0"
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault(); // Prevent scrolling when pressing Space
								confirmDelete(user.id!);
							}
						}}
						onclick={() => confirmDelete(user.id!)}
						class="mb-3 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-purple-100 p-4 text-left transition-colors hover:border-purple-600 hover:bg-purple-200 dark:border-white/10 dark:bg-white/5 dark:hover:border-purple-600 dark:hover:bg-white/10"
					>
						<UserCard {user} />
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>

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
			<h2 class="mb-4 text-xl font-bold text-white">Manage User</h2>

			<div class="mt-6 flex flex-row items-center justify-between gap-3">
				<button
					onclick={() => {
						message = '';
						handleDelete();
					}}
					type="button"
					class="py-3 font-medium transition-colors {deleteConfirm
						? 'rounded-xl bg-red-900/20 text-red-400'
						: 'text-red-400/70 hover:text-red-400'}"
				>
					{deleteConfirm ? 'Click again to confirm delete' : 'Delete User'}
				</button>
				<button
					onclick={() => resetPassword(idToDelete)}
					type="button"
					class="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-5 py-2.5
                    text-center text-sm font-medium text-white hover:bg-purple-600 focus:ring-4
                    focus:ring-purple-300 focus:outline-none"
				>
					Reset Password
				</button>
			</div>

			{#if message}
				<div class="mt-4 rounded-xl border border-slate-700 bg-slate-800 p-4">
					<p class="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">Result</p>
					<div class="flex items-center justify-between gap-2">
						<code class="font-mono text-lg text-green-400 select-all">{message}</code>

						<button
							onclick={() => {
								navigator.clipboard.writeText(message.split(':')[1].trim());
								ui.triggerToast('Copied to clipboard', 'success');
							}}
							class="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
							title="Copy to clipboard"
						>
							<span class="material-symbols-outlined text-[20px]">content_copy</span>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
