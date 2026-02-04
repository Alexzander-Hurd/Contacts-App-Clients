<script lang="ts">
	import { client } from '$lib/api/api';
	import { ui } from '$lib/ui.svelte';
	import { auth } from '$lib/auth.svelte';
	import type { components } from '$lib/api/schema';
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';

	type Contact = components['schemas']['Contact'];

	// --- STATE: Profile Details ---
	let profileForm = $state({
		name: '',
		email: '',
		extension: ''
	});

	// --- STATE: Password Change ---
	let securityForm = $state({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});

	// Load initial data from store
	$effect(() => {
		if (auth.userContact) {
			profileForm.name = auth.userContact.name || '';
			profileForm.email = auth.userContact.email || '';
			profileForm.extension = auth.userContact.extension || '';
		}
	});

	onMount(() => {
		if (!auth.userContact) auth.getUserContact();
	});

	async function updateProfile() {
		if (!auth.userContact?.id) return;
		ui.setBusy(true);

		const { data, error } = await client.PUT('/contacts/{id}', {
			params: { path: { id: auth.userContact.id } },
			body: {
				name: profileForm.name,
				email: profileForm.email,
				extension: profileForm.extension
			}
		});

		if (error) {
			ui.triggerToast('Failed to update profile', 'error');
		} else {
			// Update the global store immediately
			if (data) {
				auth.userContact = data;
			}
			ui.triggerToast('Profile updated successfully', 'success');
		}
		ui.setBusy(false);
	}
	
	async function changePassword() {
	    if (securityForm.newPassword !== securityForm.confirmPassword) {
	        ui.triggerToast('Passwords do not match', 'error');
	        return;
	    }

	    ui.setBusy(true);

	    // TODO: Verify this endpoint exists in your C# API
	    const { error } = await client.POST('/update-password', {
	        body: {
	            oldPassword: securityForm.currentPassword,
	            newPassword: securityForm.newPassword
	        }
	    });

	    if (error) {
	        ui.triggerToast('Password change failed', 'error');
	    } else {
	        ui.triggerToast('Password changed!', 'success');
	        // Reset form
	        securityForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
	    }
	    ui.setBusy(false);
	}
</script>

<div class="mx-auto max-w-2xl space-y-8 p-6 pb-32">
	<div class="mb-8 flex items-center gap-4">
		<div
			class="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white shadow-lg shadow-purple-900/20"
		>
			{#if auth.firstName || auth.lastName}
				{auth.firstName.charAt(0) || ''}{auth.lastName.charAt(0) || ''}
			{:else}
				{auth.userContact?.email?.charAt(0) || ''}
			{/if}
		</div>
		<div>
			<h1 class="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
			<p class="text-slate-500 dark:text-slate-400">Manage your account settings</p>
		</div>
	</div>

	<section
		class="rounded-3xl border border-slate-100 bg-purple-100 p-6 shadow-sm dark:border-purple-900 dark:bg-white/5"
	>
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
			<span class="material-symbols-outlined text-purple-500">badge</span>
			Contact Details
		</h2>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				updateProfile();
			}}
			class="space-y-4"
		>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<label class="block">
					<span class="text-sm font-medium text-slate-600 dark:text-slate-400">Full Name</span>
					<input
						bind:value={profileForm.name}
						type="text"
						class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
					/>
				</label>

				<label class="block">
					<span class="text-sm font-medium text-slate-600 dark:text-slate-400">Extension</span>
					<input
						bind:value={profileForm.extension}
						type="text"
						class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
					/>
				</label>
			</div>

			<label class="block">
				<span class="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</span>
				<input
					bind:value={profileForm.email}
					type="email"
					class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
				/>
			</label>

			<div class="flex justify-end pt-2">
				<button
							class="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 focus:outline-none"
				>
					Save Changes
				</button>
			</div>
		</form>
	</section>

	<section
		class="rounded-3xl border border-slate-100 bg-purple-100 p-6 shadow-sm dark:border-purple-900 dark:bg-white/5"
	>
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
			<span class="material-symbols-outlined text-purple-500">lock</span>
			Security
		</h2>

		<form
			onsubmit={(e) => {
				e.preventDefault(); changePassword();
			}}
			class="space-y-4"
		>
			<label class="block">
				<span class="text-sm font-medium text-slate-600 dark:text-slate-400">Current Password</span>
				<input
					bind:value={securityForm.currentPassword}
					type="password"
					class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
				/>
			</label>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<label class="block">
					<span class="text-sm font-medium text-slate-600 dark:text-slate-400">New Password</span>
					<input
						bind:value={securityForm.newPassword}
						type="password"
						class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
					/>
				</label>

				<label class="block">
					<span class="text-sm font-medium text-slate-600 dark:text-slate-400"
						>Confirm New Password</span
					>
					<input
						bind:value={securityForm.confirmPassword}
						type="password"
						class="mt-1 block w-full rounded-xl border-transparent bg-slate-50 text-slate-900 transition-colors focus:border-purple-500 focus:bg-white focus:ring-0 dark:bg-white/5 dark:text-white dark:focus:bg-black/20"
					/>
				</label>
			</div>

			<div class="flex justify-end pt-2">
				<button
					class="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 focus:outline-none"
				>
					Update Password
				</button>
			</div>
		</form>
	</section>
</div>
