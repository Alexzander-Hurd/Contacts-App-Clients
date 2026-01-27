<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import HeadBar from '$lib/components/HeaderBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	let { children } = $props();

	onMount(() => {
		if (!auth.isAuthenticated && location.pathname !== '/login') {
			goto('/login');
		} else {
			if (location.pathname === '/login') {
				goto('/');
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div
	class="relative mx-auto flex min-h-screen w-full flex-col overflow-x-hidden bg-white/80 shadow-2xl dark:bg-slate-900/80"
>
	<header>
		<HeadBar />
	</header>

	<main class="flex-1 p-1">
		{@render children()}
	</main>

	<Footer />
</div>
