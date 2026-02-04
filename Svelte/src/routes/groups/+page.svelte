<script lang="ts">
    import { client } from '$lib/api/api';
    import { ui } from '$lib/ui.svelte';
    import { goto } from '$app/navigation';
    
    // Props from the load function
    let { data } = $props();
    // Local reactive state for the list (so we can add to it instantly)
    let groups = $state(data.groups);

    async function createGroup() {
        // Quick MVP: Standard Browser Prompt
        const name = prompt("Enter group name:");
        if (!name) return;

        const description = prompt("Enter description (optional):") || "";

        const { data: newGroup, error } = await client.POST('/groups', {
            body: { name, description }
        });

        if (newGroup) {
            groups.push(newGroup);
            ui.triggerToast('Group created!', 'success');
        }
    }
</script>

<div class="p-6">
    <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-slate-800 dark:text-white">Groups</h1>
        <button 
            onclick={createGroup}
            class="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform hover:scale-110 hover:bg-purple-500 active:scale-95 active:bg-purple-600 dark:text-slate-300"
        >
            <span class="material-symbols-outlined">add</span>
            New Group
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each groups as group (group.id)}
            <a 
                href="/groups/{group.id}"
                class="group relative block p-6 rounded-2xl bg-purple-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-600 dark:hover:border-purple-600 hover:bg-purple-200 dark:bg-white/5 dark:hover:bg-white/10 transition-all hover:shadow-xl"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="h-12 w-12 rounded-full bg-purple-200 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                        <span class="material-symbols-outlined">group</span>
                    </div>
                </div>

                <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">
                    {group.name}
                </h3>
                <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                    {group.description || 'No description'}
                </p>
            </a>
        {:else}
            <div class="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                <span class="material-symbols-outlined text-6xl mb-4 opacity-50">group_off</span>
                <p class="text-lg">No groups found.</p>
                <button onclick={createGroup} class="mt-4 text-purple-600 font-bold hover:underline">
                    Create your first group
                </button>
            </div>
        {/each}
    </div>
</div>