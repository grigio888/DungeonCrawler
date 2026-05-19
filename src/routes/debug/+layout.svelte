<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

	let { children } = $props();

	const links = [
		{ path: '/debug/monster', label: 'Monsters' },
		{ path: '/debug/character', label: 'Inspector' },
		{ path: '/debug/roster', label: 'Roster' },
		{ path: '/debug/battle', label: 'Battle' },
		{ path: '/debug/map', label: 'Map' }
	];
</script>

<div class="bg-page min-h-screen text-text">
	<nav
		class="border-b border-border bg-[linear-gradient(180deg,var(--color-white)_0%,var(--color-parchment-deep)_100%)] text-sm shadow-[inset_0_-1px_0_rgba(255,255,255,0.8)]"
	>
		<div class="mx-auto flex max-w-6xl gap-1 px-4">
			{#each links as { path, label } (path)}
				<a
					href={resolve(path)}
					class="border-b-2 px-3 py-3 transition-colors {$page.url.pathname === resolve(path) ||
					$page.url.pathname.startsWith(resolve(path) + '/')
						? 'border-gold text-title-bottom'
						: 'border-transparent text-text-subtle hover:text-text-muted'}"
				>
					{label}
				</a>
			{/each}
		</div>
	</nav>

	{@render children()}
</div>
