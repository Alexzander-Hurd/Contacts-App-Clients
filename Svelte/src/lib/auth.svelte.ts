// src/lib/auth.svelte.ts
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { client } from '$lib/api/api';
import type { components } from './api/schema';

const STORAGE_KEY = 'auth_tokens';

// Helper to safely read localStorage during SSR (prevents crashes)
function getStorage(key: string): string | null {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem(key);
	}
	return null;
}

// 1. Create a reactive class or simple object
// In Svelte 5, exporting a class is often cleaner for global state
class AuthState {
	// Define reactive fields
	accessToken = $state(getStorage(`${STORAGE_KEY}_access`));
	refreshToken = $state(getStorage(`${STORAGE_KEY}_refresh`));
	userContact: components['schemas']['Contact'] | null = $state(null);
	firstName: string = $derived(this.userContact?.name?.split(' ')[0] || '');
	lastName: string = $state(this.userContact?.name?.split(' ')[1] || '');

	// Derived state works automatically (like a getter)
	get isAuthenticated() {
		return !!this.accessToken;
	}

	setTokens(access: string, refresh: string) {
		this.accessToken = access;
		this.refreshToken = refresh;

		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(`${STORAGE_KEY}_access`, access);
			localStorage.setItem(`${STORAGE_KEY}_refresh`, refresh);
		}
	}

	async getUserContact() {
		client.GET('/me').then((response) => {
			if (response.data) {
				this.userContact = response.data;
			}
		});
	}

	logout() {
		this.accessToken = null;
		this.refreshToken = null;

		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(`${STORAGE_KEY}_access`);
			localStorage.removeItem(`${STORAGE_KEY}_refresh`);
		}
		goto(resolve('/login'));
	}
}

// Export a singleton instance
export const auth = new AuthState();
