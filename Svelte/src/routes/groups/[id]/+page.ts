import { clientLoad } from '$lib/api/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params: { id } }) => {
	const client = await clientLoad(fetch);
	const { data, error: apiError } = await client.GET('/groups/{id}', {
		params: { path: { id: id } }
	});

	if (apiError) {
		throw error(500, 'Failed to load groups');
	}

	return data;
};
