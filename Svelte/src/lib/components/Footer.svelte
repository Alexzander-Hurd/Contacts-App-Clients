<script lang="ts">
	import { page } from '$app/state';
</script>

<div
	class="fixed right-0 bottom-0 left-0 z-40 mx-auto flex h-20 w-full items-center justify-between border-t border-purple-100 bg-white/90 px-6 backdrop-blur-lg dark:border-purple-900/60 dark:bg-slate-900/90"
>
	<div
		class="flex w-full items-center justify-center">
		<a
			id="home"
			href="/"
			data-sveltekit-preload-hover="hover"
			class="{page.url.pathname === '/'
				? 'text-primary active-tab'
				: 'hover:text-primary text-[#a394aa] transition-colors dark:text-[#715d7a]'} flex flex-col items-center gap-1"
		>
			<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;"
				>contacts</span
			>
			<span class="text-[10px] font-medium">Contacts</span>
		</a>
	</div>
	<div
		class="flex w-full items-center justify-center">
		<a
			id="groups"
			href="/groups"
			data-sveltekit-preload-hover="hover"
			class="{page.url.pathname === '/groups'
				? 'text-primary active-tab'
				: 'hover:text-primary text-[#a394aa] transition-colors dark:text-[#715d7a]'} flex flex-col items-center gap-1"
		>
			<span class="material-symbols-outlined">group</span>
			<span class="text-[10px] font-medium">Groups</span>
		</a>
	</div>
	<div
		class="flex w-full items-center justify-center">
		<a
			id="profile"
			href="/profile"
			data-sveltekit-preload-hover="hover"
			class="{page.url.pathname === '/profile'
				? 'text-primary active-tab'
				: 'hover:text-primary text-[#a394aa] transition-colors dark:text-[#715d7a]'} flex flex-col items-center gap-1"
		>
			<span class="material-symbols-outlined">account_circle</span>
			<span class="text-[10px] font-medium">Profile</span>
		</a>
	</div>
</div>
