<script>
	import { login } from '$lib/api';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';

	async function submit() {
		await login(username, password);
		goto('/');
	}
</script>

<form on:submit|preventDefault={submit}>
	<input bind:value={username} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button>Login</button>
</form>
