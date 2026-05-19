<script>
	import { BaseCharacter } from '$lib/game/entities/character';
	import { Environment } from '$lib/content/environments';
	import MONSTERS from '$lib/content/monsters';
	import { BaseMonster } from '$lib/game/entities/monster';
	import BattleInterface from '$lib/ui/battle/BattleInterface.svelte';
	import Window from '$lib/ui/window/Window.svelte';

	let { data } = $props();

	const monsterIds = Object.keys(MONSTERS).sort();

	let selectedMonsterId = $state(monsterIds[0] ?? '0001_jelly');
	let opponentLevel = $state(5);

	const player = $derived(
		data.playerSpec
			? new BaseCharacter(
					/** @type {import('$lib/game/entities/character/factory.js').CharacterSpec} */ (
						data.playerSpec
					)
				)
			: null
	);

	const opponent = $derived(
		new BaseMonster({ monsterId: selectedMonsterId, level: opponentLevel })
	);

	const environment = new Environment('forest_clearing');

	const selectedMonster = $derived(MONSTERS[selectedMonsterId]);
</script>

<svelte:head>
	<title>Battle debug</title>
</svelte:head>

<main>
	<div class="mx-auto max-w-5xl px-4 py-8">
		<header class="mb-8 border-b border-border pb-6">
			<p class="text-sm font-medium tracking-wide text-title-mid uppercase">Debug</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-tight text-frame-dark">Battle interface</h1>
			<p class="mt-2 text-text-muted">
				Preview combat with a player character, monster opponent, and environment context.
			</p>
		</header>

		<Window title="Opponent setup" class="m-0 mb-6 w-full max-w-none min-w-0">
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="block text-sm">
					<span class="mb-1.5 block text-xs tracking-wide text-text-subtle uppercase">Monster</span>
					<select
						bind:value={selectedMonsterId}
						class="w-full rounded-lg border border-border-strong bg-white px-3 py-2 text-frame-dark focus:border-title-mid focus:outline-none"
					>
						{#each monsterIds as monsterId (monsterId)}
							<option value={monsterId}>
								{MONSTERS[monsterId].name} ({monsterId})
							</option>
						{/each}
					</select>
				</label>

				<label class="block text-sm">
					<span class="mb-1.5 block text-xs tracking-wide text-text-subtle uppercase">Level</span>
					<input
						type="number"
						min="1"
						max="99"
						bind:value={opponentLevel}
						class="w-full rounded-lg border border-border-strong bg-white px-3 py-2 font-mono text-frame-dark focus:border-title-mid focus:outline-none"
					/>
				</label>
			</div>

			{#if selectedMonster}
				<p class="mt-3 text-sm text-text-subtle">{selectedMonster.description}</p>
			{/if}
		</Window>

		{#key `${selectedMonsterId}-${opponentLevel}`}
			<BattleInterface {player} {opponent} {environment} autoOpponentAttackMs={500} />
		{/key}
	</div>
</main>
