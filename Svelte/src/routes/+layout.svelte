<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SideDrawer from '$lib/components/SideDrawer.svelte';
	import HeadBar from '$lib/components/HeaderBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import { ui } from '$lib/ui.svelte';
	import { fly, fade } from 'svelte/transition';
	import type { components } from '$lib/api/schema';
	import { client } from '$lib/api/api';
	import { page } from '$app/state';
	let { children } = $props();

	let userContact: components['schemas']['Contact'] | null = $state(null);
	let firstName: string = $state('');
	let lastName: string = $state('');

	onMount(() => {
		if (!auth.isAuthenticated && location.pathname !== '/login') {
			goto('/login');
		} else {
			if (location.pathname === '/login') {
				goto('/');
			}
		}

		client.GET('/me').then((response) => {
			if (response.data) {
				userContact = response.data;
				firstName = userContact.name?.split(' ')[0] || '';
				lastName = userContact.name?.split(' ')[1] || '';
			}
		});

		ui.setBusy(false);
	});

	$effect(() => {
		document.body.style.overflow = ui.sidebarOpen ? 'hidden' : 'auto';
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div
	class="relative mx-auto flex min-h-screen w-full flex-col overflow-x-hidden bg-white/80 shadow-2xl dark:bg-slate-900/80"
>
	{#if page.url.pathname !== '/login'}
		<header>
			<HeadBar />
		</header>
	{/if}

	<main class="flex-1 p-1">
		{@render children()}
	</main>

	{#if page.url.pathname !== '/login'}
		{#if ui.sidebarOpen}<button
				aria-label="close drawer"
				class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
				onclick={() => ui.closeSidebar()}
				transition:fade
			></button>ui

			<aside
				class="fixed top-0 right-0 z-[70] h-full w-72 bg-[#1a161f] shadow-2xl"
				transition:fly={{ x: 300, duration: 300 }}
			>
				<SideDrawer></SideDrawer>
			</aside>
		{/if}

		<Footer />
	{/if}
</div>

{#if ui.isBusy}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-[100] flex cursor-wait items-center justify-center bg-black/20 backdrop-blur-md"
	>
		<div class="rounded-full bg-none p-6 shadow-xl">
			<span class="material-symbols-outlined animate-spin bg-none text-4xl text-white">
				progress_activity
			</span>
		</div>
	</div>
{/if}
