import createClient from 'openapi-fetch/dist/index.cjs';
import type { paths } from './schema';
import { auth } from '$lib/auth.svelte';

const baseUrl = 'http://localhost:5010';

let refreshPromise: Promise<string | null> | null = null;

const customFetch: typeof fetch = async (request, options) => {

	let headers = new Headers();

	if (request instanceof Request) {
		request.headers.forEach((value, key) => headers.set(key, value));
	}

	if (options?.headers) {
		new Headers(options.headers).forEach((value, key) => headers.set(key, value));
	}

	//Attach access token if available
	if (auth.accessToken && !headers.has('Authorization')) {
		headers.set('Authorization', `Bearer ${auth.accessToken}`);
	}

	options = { ...options, headers };
	const response = await fetch(request, options);

	if (response.status !== 401) {
		// Not a 401, return original response
		return response;
	}

	// Handle 401 - try refresh if possible
	if (!auth.refreshToken) {
		console.log('No refresh token - Logout');
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
		console.log('Refresh failed - Logout');
		auth.logout();
		return response;
	}

	console.log('Got new access token');

	// Retry original request with new token
	headers = new Headers(options?.headers);
	headers.append('Authorization', `Bearer ${newAccessToken}`);
	options = { ...options, headers };

	return await fetch(request, options);
};

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
	baseUrl: baseUrl,
	fetch: customFetch
});
