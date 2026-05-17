<script>
	import { BaseCharacter } from '$lib/characters';
	import { Environment } from '$lib/environments';
	import { BaseMonster } from '$lib/monsters';
	import BattleInterface from '$lib/components/battle/BattleInterface.svelte';

	let { data } = $props();

	const player = $derived(
		data.playerSpec ? new BaseCharacter(/** @type {import('$lib/characters/factory.js').CharacterSpec} */ (data.playerSpec)) : null
	);

	const opponent = new BaseMonster({
		monsterId: '0001_jelly',
		level: 5
	});

	const environment = new Environment('forest_clearing');
</script>

<svelte:head>
	<title>Battle debug</title>
</svelte:head>

<main class="min-h-screen bg-zinc-950 text-zinc-100">
	<div class="mx-auto max-w-5xl px-4 py-8">
		<header class="mb-8 border-b border-zinc-800 pb-6">
			<p class="text-sm font-medium tracking-wide text-violet-400/90 uppercase">Debug</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-tight">Battle interface</h1>
			<p class="mt-2 text-zinc-400">
				Preview combat with a player character, monster opponent, and environment context.
			</p>
		</header>

		<BattleInterface {player} {opponent} {environment} autoOpponentAttackMs={500} />
	</div>
</main>
