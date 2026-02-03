import { clientLoad } from '$lib/api/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const client = await clientLoad(fetch);
	const { data, error: apiError } = await client.GET('/groups', { params: {} });

	if (apiError) {
		throw error(500, 'Failed to load groups');
	}

	return {
		groups: data || []
	};
};
