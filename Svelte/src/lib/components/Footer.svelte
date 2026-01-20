<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
</script>

<div class="footer">
	<p class="text-center">ContactsApp &copy 2026 Alex Hurd. All Rights Reserved.</p>
	<div class="align-items-center flex flex-row">
		<a class="pl-2" href="/about">About</a>
	</div>
</div>

<style>
	.footer {
		padding: 0.75rem 1rem;
		background: #5f5f5f;
		color: white;
	}

	.footer a {
		color: white;
		text-align: center;
		margin: auto;
	}
</style>
