<script>
	import { onMount } from 'svelte';
	import { getContacts, deleteContact } from '$lib/api';

	let contacts = [];

	onMount(async () => {
		contacts = await getContacts();
	});

	async function remove(id) {
		await deleteContact(id);
		contacts = contacts.filter((c) => c.id !== id);
	}
</script>

<h2 class="mt-6 text-center text-lg font-bold">All Contacts</h2>

<table class="min-w-full border-collapse border border-slate-300">
	<thead class="bg-slate-100">
		<tr>
			<th class="border-b border-slate-300 px-3 py-2 text-left text-sm font-semibold"> Name </th>
			<th class="border-b border-slate-300 px-3 py-2 text-left text-sm font-semibold"> Email </th>
			<th class="border-b border-slate-300 px-3 py-2 text-left text-sm font-semibold"> Ext </th>
			<th class="border-b border-slate-300 px-3 py-2"></th>
		</tr>
	</thead>

	<tbody>
		{#each contacts as c}
			<tr class="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
				<td class="border-b border-slate-200 px-3 py-2 text-sm">
					{c.name}
				</td>
				<td class="border-b border-slate-200 px-3 py-2 text-sm">
					{c.email}
				</td>
				<td class="border-b border-slate-200 px-3 py-2 text-sm">
					{c.extension}
				</td>
				<td class="border-b border-slate-200 px-3 py-2 text-right text-sm">
					<button class="font-medium text-red-600 hover:text-red-800" on:click={() => remove(c.id)}>
						Delete
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
