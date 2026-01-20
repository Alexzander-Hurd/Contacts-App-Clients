<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
</script>

<nav>
	<div class="align-items-center flex flex-row">
		<a href="/">
			<img class="hidden w-48 md:block" src="/images/logo.png" />
			<img class="block w-12 md:hidden" src="/images/logo_mobile.png" />
		</a>
		<a class="pl-2" href="/">Contacts</a>
		<a class="pl-2" href="/groups">Groups</a>
	</div>
	<div class="">
		<a href="/profile">
			<svg
				class="v-icon__svg invert"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="36"
				height="36"
				role="img"
				aria-hidden="true"
				><path
					d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
				></path>
			</svg>
		</a>
	</div>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: #5f5f5f;
		color: white;
	}

	nav a {
		color: white;
		text-decoration: none;
		text-align: center;
		margin: auto;
	}
</style>
