<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { ui } from '$lib/ui.svelte';
</script>

<nav class="sticky top-0 z-50 border-b border-white/10 bg-[#3d2a48]/80 backdrop-blur-md">
	<div class="flex w-full items-center"></div>
	<div class="align-items-center flex w-full flex-row justify-center py-2">
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a href="/">
			<div class="flex w-full flex-row items-center justify-center py-2">
				<img class="block w-12" src="/images/logo_mobile.png" alt="logo" />
				<h2 class="text-2xl font-bold text-white">ContactsApp</h2>
			</div>
		</a>
	</div>
	<div class="flex w-full items-center justify-end">
		<button onclick={async () => await ui.toggleSidebar()} class="p-2">
			<span class="material-symbols-outlined">menu</span>
		</button>
	</div>
</nav>
