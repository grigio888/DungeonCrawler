<script>
	import { page } from '$app/stores';

	let { children } = $props();

	const links = [
		{ href: '/debug/monster', label: 'Monsters' },
		{ href: '/debug/character', label: 'Characters' }
	];
</script>

<nav
	class="border-b border-zinc-800 bg-zinc-950/95 text-sm backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80"
>
	<div class="mx-auto flex max-w-6xl gap-1 px-4">
		{#each links as { href, label }}
			<a
				{href}
				class="border-b-2 px-3 py-3 transition-colors {($page.url.pathname === href ||
					$page.url.pathname.startsWith(href + '/'))
					? 'border-amber-400 text-amber-300'
					: 'border-transparent text-zinc-500 hover:text-zinc-300'}"
			>
				{label}
			</a>
		{/each}
	</div>
</nav>

{@render children()}
