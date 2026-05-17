<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

	let { children } = $props();

	const links = [
		{ path: '/debug/monster', label: 'Monsters' },
		{ path: '/debug/character', label: 'Characters' }
	];
</script>

<nav
	class="border-b border-zinc-800 bg-zinc-950/95 text-sm backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80"
>
	<div class="mx-auto flex max-w-6xl gap-1 px-4">
		{#each links as { path, label } (path)}
			<a
				href={resolve(path)}
				class="border-b-2 px-3 py-3 transition-colors {$page.url.pathname === resolve(path) ||
				$page.url.pathname.startsWith(resolve(path) + '/')
					? 'border-amber-400 text-amber-300'
					: 'border-transparent text-zinc-500 hover:text-zinc-300'}"
			>
				{label}
			</a>
		{/each}
	</div>
</nav>

{@render children()}
