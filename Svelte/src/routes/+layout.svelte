<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isLoggedIn, loadAuth } from '$lib/api';

	let { children } = $props();
	export const ssr = false;

	onMount(() => {
		loadAuth();

		if (!isLoggedIn() && location.pathname !== '/login') {
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
<div class="flex h-screen flex-col">
	<header>
		<NavBar />
	</header>

	<main class="flex-1 p-1">
		{@render children()}
	</main>

	<Footer />
</div>

<style>
</style>
