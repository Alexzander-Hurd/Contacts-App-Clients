<script lang="ts">
    import { ui } from '$lib/ui.svelte';
    import { fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';
</script>

<div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
    {#each ui.toasts as toast (toast.id)}
        <div
            animate:flip
            transition:fly={{ y: 20, duration: 300 }}
            class="pointer-events-auto flex min-w-[320px] items-center gap-3 rounded-xl p-4 shadow-2xl text-white font-bold
            {toast.type === 'success' ? 'bg-[#fa5118] text-white' : 
             toast.type === 'error' ? 'bg-red-500 text-white' : 
             'bg-slate-800 text-white'}"
        >
            <span class="material-symbols-outlined">
                {toast.type === 'success' ? 'check_circle' : 
                 toast.type === 'error' ? 'error' : 'info'}
            </span>
            
            <p class="text-sm">{toast.message}</p>

            <button 
                onclick={() => ui.removeToast(toast.id)}
                class="ml-auto opacity-70 hover:opacity-100"
            >
                <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    {/each}
</div>