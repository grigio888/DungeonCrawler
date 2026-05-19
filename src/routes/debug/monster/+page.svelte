<script>
	import { SCALES } from '$lib/core/enum/stats.js';
	import { getPointsPerLevel, getTotalStatPoints } from '$lib/game/progression';
	import MONSTERS from '$lib/content/monsters';
	import { BaseMonster } from '$lib/game/entities/monster';
	import { getMonsterSpritePath, resolveMonsterSpriteUrl } from '$lib/game/presentation/sprites';
	import SkillFactory from '$lib/content/skills/factory';
	import Window from '$lib/ui/window/Window.svelte';

	const monsterIds = Object.keys(MONSTERS).sort();
	const scaleKeys = Object.values(SCALES);

	const sprites = import.meta.glob('$lib/content/monsters/*/sprites/*.{png,webp,gif}', {
		eager: true,
		query: '?url',
		import: 'default'
	});

	let monsterId = $state(monsterIds[0] ?? '0001_jelly');
	let level = $state(1);

	const definition = $derived(MONSTERS[monsterId]);
	const monster = $derived(new BaseMonster({ monsterId, level }));
	const spec = $derived(monster.spec);
	const statPointPool = $derived(getTotalStatPoints(level));

	const spriteUrl = $derived(resolveMonsterSpriteUrl(sprites, monsterId));
	const spritePathHint = $derived(getMonsterSpritePath(monsterId));

	const allocatedStatTotal = $derived(
		scaleKeys.reduce((sum, key) => {
			if (key === SCALES.HP || key === SCALES.MP) return sum;
			return sum + (spec.scales[key] ?? 0);
		}, 0)
	);

	/**
	 * @param {unknown} skill
	 */
	function describeSkill(skill) {
		if (typeof skill !== 'string') return String(skill);

		try {
			const skillDef = new SkillFactory(skill);
			return `${skillDef.name} (${skill}) — ${skillDef.description}`;
		} catch {
			return skill;
		}
	}

	/**
	 * @param {unknown} value
	 */
	function formatJson(value) {
		return JSON.stringify(value, null, 2);
	}
</script>

<svelte:head>
	<title>Monster debug</title>
</svelte:head>

<main>
	<div class="mx-auto max-w-6xl px-4 py-8">
		<header class="mb-8 border-b border-border pb-6">
			<p class="text-sm font-medium tracking-wide text-title-mid uppercase">Debug</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-tight text-frame-dark">Monster inspector</h1>
			<p class="mt-2 text-text-muted">
				Pick a template and level to preview the resolved runtime spec.
			</p>
		</header>

		<div class="grid items-start gap-8 lg:grid-cols-[minmax(17rem,280px)_minmax(0,1fr)]">
			<aside
				class="flex min-h-0 flex-col gap-4 lg:sticky lg:top-6 lg:z-10 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto"
			>
				<Window title="Configure" class="m-0 w-full min-w-0 max-w-none shrink-0">
					<div class="space-y-4">
						<label class="block">
							<span class="mb-1 block text-sm text-text-muted">Monster</span>
							<select
								bind:value={monsterId}
								class="w-full rounded-lg border border-border-strong bg-white px-3 py-2 text-frame-dark focus:border-title-mid focus:outline-none"
							>
								{#each monsterIds as id (id)}
									<option value={id}>{MONSTERS[id].name} ({id})</option>
								{/each}
							</select>
						</label>

						<label class="block">
							<span class="mb-1 block text-sm text-text-muted">Level</span>
							<input
								type="number"
								min="1"
								max="99"
								bind:value={level}
								class="w-full rounded-lg border border-border-strong bg-white px-3 py-2 text-frame-dark focus:border-title-mid focus:outline-none"
							/>
						</label>
					</div>

					<dl class="mt-4 space-y-2 border-t border-border pt-4 text-sm">
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">Points this level</dt>
							<dd class="font-mono">{getPointsPerLevel(level)}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">Total pool</dt>
							<dd class="font-mono">{statPointPool}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">Allocated</dt>
							<dd class="font-mono">{allocatedStatTotal}</dd>
						</div>
					</dl>
				</Window>
				{#if spriteUrl}
					<Window title="Sprite" class="m-0 w-full min-w-0 max-w-none shrink-0">
						<img
							src={spriteUrl}
							alt="{monster.name} sprite"
							class="image-pixelated mx-auto max-h-48 w-auto"
						/>
					</Window>
				{:else}
					<Window title="Sprite" class="m-0 w-full min-w-0 max-w-none shrink-0">
						<p class="text-center text-sm">No sprite found.</p>
						<p class="mt-2 text-center text-xs">Add a PNG here, then refresh the page:</p>
						<code class="mt-2 block text-center text-[10px]">{spritePathHint}</code>
					</Window>
				{/if}
			</aside>

			<div class="min-w-0 space-y-6">
				<Window title="Identity" class="m-0 w-full min-w-0 max-w-none">
					<dl class="grid gap-3 sm:grid-cols-2">
						<div>
							<dt class="text-xs text-text-subtle uppercase">Name</dt>
							<dd class="mt-0.5 font-medium">{monster.name}</dd>
						</div>
						<div>
							<dt class="text-xs text-text-subtle uppercase">Template ID</dt>
							<dd class="mt-0.5 font-mono text-sm">{monster.monsterId}</dd>
						</div>
						<div>
							<dt class="text-xs text-text-subtle uppercase">Instance ID</dt>
							<dd class="mt-0.5 font-mono text-sm break-all">{monster.id}</dd>
						</div>
						<div>
							<dt class="text-xs text-text-subtle uppercase">Kind</dt>
							<dd class="mt-0.5">{monster.kind}</dd>
						</div>
						<div>
							<dt class="text-xs text-text-subtle uppercase">Level</dt>
							<dd class="mt-0.5">{monster.level}</dd>
						</div>
						<div>
							<dt class="text-xs text-text-subtle uppercase">Display</dt>
							<dd class="mt-0.5">{monster.displayLabel}</dd>
						</div>
						<div class="sm:col-span-2">
							<dt class="text-xs text-text-subtle uppercase">Description</dt>
							<dd class="mt-0.5 text-frame">{spec.description}</dd>
						</div>
						<div>
							<dt class="text-xs text-text-subtle uppercase">Prompt path</dt>
							<dd class="mt-0.5 font-mono text-sm">{monster.promptPath}</dd>
						</div>
						<div>
							<dt class="text-xs text-text-subtle uppercase">Alive</dt>
							<dd class="mt-0.5">{monster.isAlive ? 'yes' : 'no'}</dd>
						</div>
					</dl>
				</Window>

				<Window title="Vitals" class="m-0 w-full min-w-0 max-w-none">
					<dl class="grid gap-3 sm:grid-cols-2">
						<div>
							<dt class="text-xs text-text-subtle uppercase">HP</dt>
							<dd class="mt-0.5 font-mono">{monster.hp} / {monster.maxHp}</dd>
						</div>
						<div>
							<dt class="text-xs text-text-subtle uppercase">MP</dt>
							<dd class="mt-0.5 font-mono">{monster.sp} / {monster.maxSp}</dd>
						</div>
						<div>
							<dt class="text-xs text-text-subtle uppercase">Base vitals</dt>
							<dd class="mt-0.5 font-mono text-sm">
								HP {spec.baseVitals?.hp ?? 0}, MP {spec.baseVitals?.mp ?? 0}
							</dd>
						</div>
					</dl>
				</Window>

				<Window title="Stats (scales)" class="m-0 w-full min-w-0 max-w-none">
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm">
							<thead class="border-b border-border-strong text-text-subtle">
								<tr>
									<th class="pr-4 pb-2 font-medium">Stat</th>
									<th class="pr-4 pb-2 font-medium">Value</th>
									<th class="pb-2 font-medium">Weight</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-border">
								{#each scaleKeys as key (key)}
									<tr>
										<td class="py-2 pr-4 font-mono text-frame">{key}</td>
										<td class="py-2 pr-4 font-mono">{spec.scales[key] ?? 0}</td>
										<td class="py-2 font-mono text-text-subtle">
											{definition.statWeights?.[key] != null
												? `${(definition.statWeights[key] * 100).toFixed(1)}%`
												: '—'}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</Window>

				<Window title="Skills" class="m-0 w-full min-w-0 max-w-none">
					{#if spec.skills?.length}
						<ul class="space-y-2 text-sm">
							{#each spec.skills as skill (skill)}
								<li class="rounded-lg bg-surface-inset px-3 py-2 text-frame">{describeSkill(skill)}</li>
							{/each}
						</ul>
					{:else}
						<p class="mt-4 text-sm text-text-subtle">No skills.</p>
					{/if}
				</Window>

				<section class="grid gap-4 lg:grid-cols-2">
					<Window title="Template definition" class="m-0 w-full min-w-0 max-w-none">
						<pre
							class="mt-3 max-h-80 overflow-auto rounded-lg bg-surface-code p-3 font-mono text-xs leading-relaxed text-frame">{formatJson(
								definition
							)}</pre>
					</Window>
					<Window title="Runtime spec" class="m-0 w-full min-w-0 max-w-none">
						<pre
							class="mt-3 max-h-80 overflow-auto rounded-lg bg-surface-code p-3 font-mono text-xs leading-relaxed text-frame">{formatJson(
								spec
							)}</pre>
					</Window>
				</section>
			</div>
		</div>
	</div>
</main>

<style>
	.image-pixelated {
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}
</style>
