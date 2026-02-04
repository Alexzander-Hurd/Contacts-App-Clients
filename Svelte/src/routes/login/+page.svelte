<script lang="ts">
	import { client } from '$lib/api/api';
	import { auth } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';
	import { ui } from '$lib/ui.svelte';

	let username = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);

	async function submit() {
		isLoading = true;
		const { data, error } = await client.POST('/login', {
			body: {
				username,
				password
			}
		});

		if (error) {
			isLoading = false;
			console.error(
				'Login error:',
				error.message ? error.message : error ? error : 'Unknown error'
			);
			errorMessage = error.message || 'Login failed. Please try again.';
			return;
		}

		if (data === null || data === undefined) {
			isLoading = false;
			console.error('No data received');
			errorMessage = 'Login failed. Please try again.';
			return;
		}

		auth.setTokens(data?.token!, data.refresh!);
		isLoading = false
		ui.setBusy(true);
		goto('/');
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
				<span class="material-symbols-outlined text-5xl text-black dark:text-slate-300">contact_page</span>
			</div>
			<h1 class="text-2xl font-semibold tracking-tight text-black dark:text-slate-300">ContactsApp</h1>
		</div>
		<p
			class="{errorMessage
				? 'block'
				: 'hidden'} text-md mb-6 w-full rounded-xl bg-red-600 px-4 py-2 text-center text-white"
		>
			{errorMessage}
		</p>
		<div class="w-full space-y-4">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				<div class="space-y-1.5">
					<label
						class="text-plum-muted px-1 text-xs font-medium tracking-wider uppercase"
						for="username">Email</label
					>
					<input
						class="border-plum-border focus:ring-primary h-14 w-full rounded-xl border bg-[#faf5ff] dark:bg-[#2d1b36] px-4 text-black dark:text-slate-300 transition-all outline-none placeholder:text-[#715d7a] focus:border-transparent focus:ring-2"
						placeholder="name@example.com"
						id="username"
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
							class="border-plum-border focus:ring-primary h-14 w-full rounded-xl border bg-[#faf5ff] dark:bg-[#2d1b36] px-4 text-black dark:text-slate-300 transition-all outline-none placeholder:text-[#715d7a] focus:border-transparent focus:ring-2"
							placeholder="••••••••"
							id="password"
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
						disabled={isLoading}
						class="shadow-primary/25 relative flex h-14 w-full items-center justify-center gap-2
						rounded-xl bg-purple-800 py-3 font-semibold text-white transition-all
						hover:scale-[1.05] hover:bg-purple-600 active:scale-[0.98] disabled:opacity-70
						dark:bg-purple-600 hover:dark:bg-purple-500"
					>
						{#if isLoading}
							<span class="material-symbols-outlined animate-spin">progress_activity</span>
							Logging in...
						{:else}
							Log In
						{/if}
					</button>
				</div>
			</form>
		</div>
		<div class="mt-8 flex flex-col items-center gap-6">
			<div class="flex items-center gap-1.5 text-sm">
				<span class="text-plum-muted">Don't have an account?</span>
				<button class="hover:text-purple-600 font-semibold text-black dark:text-slate-300 transition-colors">
					Sign Up
				</button>
			</div>
		</div>

		<div class="fixed bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-white/10"></div>
	</div>
</div>
