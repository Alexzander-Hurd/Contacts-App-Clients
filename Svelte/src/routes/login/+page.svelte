<script lang="ts">
	import { client } from '$lib/api/api';
	import { auth } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');

	async function submit() {
		
		const { data, error } = await client.POST('/login', {
			body: {
				username,
				password
			}
		}); 

		if (error) {
			console.error('Login error:', error.message ? error.message : error ? error : 'Unknown error');
			return;
		}

		if (data === null || data === undefined) {
			console.error('No data received');
			return;
		}

		auth.setTokens(data?.token!, data.refresh!);
		goto('/');
	}

	function preventDefault(fn: (event: Event) => void) {
		return function (event: Event) {
			event.preventDefault();
			fn.call(this, event);
		};
	}
</script>

<form onsubmit={preventDefault(submit)} >
	<input bind:value={username} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button>Login</button>
</form>
