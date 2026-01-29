<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import { sidebar } from '$lib/ui.svelte';
	import type { components } from '$lib/api/schema';
	import { client } from '$lib/api/api';

	let userContact: components['schemas']['Contact'] | null = $state(null);
	let firstName: string = $state('');
	let lastName: string = $state('');

	onMount(() => {
		client.GET('/me').then((response) => {
			if (response.data) {
				userContact = response.data;
				firstName = userContact.name?.split(' ')[0] || '';
				lastName = userContact.name?.split(' ')[1] || '';
			}
		});
	});

	$effect(() => {
		document.body.style.overflow = sidebar.open ? 'hidden' : 'auto';
	});
</script>

<div class="flex h-full flex-col justify-between">
	<div class="flex h-36 flex-col items-center justify-center px-4">
		<div class="flex h-full w-full flex-row items-center justify-start gap-4 px-4">
			<div
				class="text-primary flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-bold dark:bg-purple-900/40"
			>
				{firstName.charAt(0)}{lastName.charAt(0)}
			</div>
			<div class="flex flex-col">
				<h2 class="text-xl font-bold text-white dark:text-slate-300">
					{userContact?.name || userContact?.email?.split('@')[0]}
				</h2>
				<span class="text-sm text-purple-300">{userContact?.email}</span>
			</div>
		</div>
		<hr class="my-2 h-px w-full border-1 bg-white dark:bg-gray-700" />
	</div>
	<div class="flex h-full flex-col items-center justify-start px-4">
		<div class="flex h-16 items-center justify-center px-4">
			<a href="/about" class="text-xl font-bold text-white dark:text-slate-300">About</a>
		</div>
		<div class="flex h-16 items-center justify-center px-4">
			<a href="/settings" class="text-xl font-bold text-white dark:text-slate-300">Settings</a>
		</div>
		<div class="flex h-16 items-center justify-center px-4">
			<a href="/profile" class="text-xl font-bold text-white dark:text-slate-300">Profile</a>
		</div>
	</div>
	<div class="flex h-24 flex-col items-center justify-center px-6">
		<hr class="my-2 h-px w-full border-1 bg-white dark:bg-gray-700" />
		<div class="flex h-16 w-full items-center justify-center px-4">
			<button
				onclick={() => 
					{
						auth.logout();
						sidebar.close();
					}
				}
				class="w-full text-xl font-bold text-white"
				><div class="flex w-full items-center justify-between gap-2">
					<p>Logout</p>
					<div class="material-symbols-outlined">logout</div>
				</div>
			</button>
		</div>
	</div>
</div>
