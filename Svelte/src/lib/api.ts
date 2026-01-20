const baseUrl = 'http://localhost:5010';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function isLoggedIn() {
	return !!accessToken;
}

export function loadAuth() {
	accessToken = localStorage.getItem('accessToken');
	refreshToken = localStorage.getItem('refreshToken');
}
async function request(path: string, options: RequestInit = {}) {
	const headers = new Headers(options.headers);

	if (accessToken) {
		headers.set('Authorization', `Bearer ${accessToken}`);
	}

	console.log(!!accessToken);
	console.log(refreshToken);

	const res = await fetch(`${baseUrl}${path}`, {
		...options,
		headers
	});

	if (res.status === 401 && refreshToken) {
		const refreshRes = await refresh();
		if (refreshRes === false) {
			//redirect to login
		}
		return request(path, { ...options, headers: undefined });
	}

	if (!res.ok) {
		throw new Error(`HTTP ${res.status}`);
	}

	return res;
}

export async function login(username: string, password: string) {
	const res = await fetch(`${baseUrl}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	});

	const data = await res.json();
	accessToken = data.token;
	refreshToken = data.refresh;

	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);
}

async function refresh(): boolean {
	const res = await fetch(`${baseUrl}/refresh?refreshToken=${encodeURIComponent(refreshToken!)}`, {
		method: 'POST'
	});

	if (!res.ok) {
		return false;
	}

	const data = await res.json();
	accessToken = data.accessToken;
	refreshToken = data.refreshToken;

	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);

	return true;
}

export async function getContacts() {
	const res = await request('/contacts');
	return res.json();
}

export async function addContact(dto) {
	await request('/contacts', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dto)
	});
}

export async function updateContact(id, dto) {
	await request(`/contacts/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dto)
	});
}

export async function deleteContact(id) {
	await request(`/contacts/${id}`, { method: 'DELETE' });
}
