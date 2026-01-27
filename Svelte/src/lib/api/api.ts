import createClient from 'openapi-fetch/dist/index.cjs';
import type { paths } from './schema';
import { auth } from '$lib/auth.svelte';

const baseUrl = 'http://localhost:5010';

let refreshPromise: Promise<string | null > | null = null;

const customFetch: typeof fetch = async (request, options) => {
	console.log('Custom fetch called for', request);

	// Attach access token if available
	if (auth.accessToken) {
		console.log('Got access token');
		const headers = new Headers(options?.headers);
		headers.set('Authorization', `Bearer ${auth.accessToken}`);
		options = { ...options, headers };
	}

	console.log('Making request to', request);
	const response = await fetch(request, options);

	console.log('Response status:', response.status);
	console.log('Response headers:', Array.from(response.headers.entries()));
	console.log('Response body:', await response.clone().text() ?? 'No body');

	if (response.status !== 401) {
		console.log('Got response with status', response.status);
		// Not a 401, return original response
		return response;
	}
	
	// Handle 401 - try refresh if possible
	if (!auth.refreshToken) {
		console.log('No refresh token');
		auth.logout();
		return response;
	}

	if (!refreshPromise) {
		console.log('No existing refresh promise');
		refreshPromise = refreshRequest(auth.refreshToken);
	}

	const newAccessToken = await refreshPromise;
	refreshPromise = null;

	if (!newAccessToken) {
		console.log('Refresh failed');
		auth.logout();
		return response;
	}

	console.log('Got new access token');

	// Retry original request with new token
	const headers = new Headers(options?.headers);
	headers.set('Authorization', `Bearer ${newAccessToken}`);
	options = { ...options, headers };

	return await fetch(request, options);
}

async function refreshRequest(refreshToken: string): Promise<string | null> {
	try {

		console.log('Attempting token refresh');
		const response = await fetch(`${baseUrl}/refresh?refreshToken=${refreshToken}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		});

		if (!response.ok) {
			auth.logout();
			return null;
		}

		const data = await response.json();
		const newAccessToken = data.token;
		const newRefreshToken = data.refresh;

		auth.setTokens(newAccessToken, newRefreshToken);
		return newAccessToken;
	} catch (error) {
		console.error('Refresh token request failed', error);
		return null;
	}
}

export const client = createClient<paths>({
	baseUrl:baseUrl,
	fetch: customFetch
});





