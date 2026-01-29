<script lang="ts">
	import { client } from '$lib/api/api';
	import { auth } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let errorMessage = $state('');

	async function submit() {
		const { data, error } = await client.POST('/login', {
			body: {
				username,
				password
			}
		});

		if (error) {
			console.error(
				'Login error:',
				error.message ? error.message : error ? error : 'Unknown error'
			);
			errorMessage = error.message || 'Login failed. Please try again.';
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

<div
	class="align-center flex min-h-[calc(100vh)] w-full flex-1 flex-row items-center justify-center"
>
	<div class="align-center flex max-w-lg flex-col items-center justify-center">
		<div class="w-max-md mb-16 flex flex-col items-center gap-3">
			<div
				class="bg-primary shadow-primary/20 flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl"
			>
				<span class="material-symbols-outlined text-5xl text-white">contact_page</span>
			</div>
			<h1 class="text-2xl font-semibold tracking-tight text-white">Connections</h1>
		</div>
		<p class="{errorMessage ? 'block' : 'hidden'} mb-6 text-center text-md bg-red-600 px-4 py-2 rounded-xl  w-full text-white">{errorMessage}</p>
		<div class="w-full space-y-4">
			<form onsubmit={preventDefault(submit)}>
				<div class="space-y-1.5">
					<label
						class="text-plum-muted px-1 text-xs font-medium tracking-wider uppercase"
						for="username">Email</label
					>
					<input
						class="border-plum-border focus:ring-primary h-14 w-full rounded-xl border bg-[#2d1b36] px-4 text-white transition-all outline-none placeholder:text-[#715d7a] focus:border-transparent focus:ring-2"
						placeholder="name@example.com"
						bind:value={username}
					/>
				</div>
				<div class="space-y-1.5">
					<label
						class="text-plum-muted px-1 text-xs font-medium tracking-wider uppercase"
						for="password">Password</label
					>
					<div class="relative">
						<input
							class="border-plum-border focus:ring-primary h-14 w-full rounded-xl border bg-[#2d1b36] px-4 text-white transition-all outline-none placeholder:text-[#715d7a] focus:border-transparent focus:ring-2"
							placeholder="••••••••"
							bind:value={password}
							type="password"
						/>
						<button class="text-plum-muted absolute top-1/2 right-4 -translate-y-1/2">
							<span class="material-symbols-outlined text-xl">visibility</span>
						</button>
					</div>
				</div>
				<div class="pt-6">
					<button
						class="shadow-primary/25 h-14 w-full rounded-xl bg-purple-800 font-semibold text-white shadow-lg transition-all active:scale-[0.98] dark:bg-purple-600"
					>
						Log In
					</button>
				</div>
			</form>
		</div>
		<div class="mt-8 flex flex-col items-center gap-6">
			<button class="text-plum-muted text-sm font-medium transition-colors hover:text-white">
				Forgot Password?
			</button>
			<div class="flex items-center gap-1.5 text-sm">
				<span class="text-plum-muted">Don't have an account?</span>
				<button class="hover:text-primary font-semibold text-white transition-colors">
					Sign Up
				</button>
			</div>
		</div>

		<div class="fixed bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-white/10"></div>
	</div>
</div>
