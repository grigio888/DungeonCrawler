<script>
	import { SCALES } from '$lib/enums';
	import { getPointsPerLevel, getTotalStatPoints } from '$lib/progression';
	import MONSTERS, { BaseMonster } from '$lib/monsters';
	import SkillFactory from '$lib/skills/factory';

	const monsterIds = Object.keys(MONSTERS).sort();
	const scaleKeys = Object.values(SCALES);

	const sprites = import.meta.glob('$lib/monsters/*/sprites/*.{png,webp,gif}', {
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

	const spriteUrl = $derived.by(() => {
		for (const [path, url] of Object.entries(sprites)) {
			if (path.includes(`/monsters/${monsterId}/sprites/`)) {
				return /** @type {string} */ (url);
			}
		}
		return null;
	});

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

<main class="min-h-screen bg-zinc-950 text-zinc-100">
	<div class="mx-auto max-w-6xl px-4 py-8">
		<header class="mb-8 border-b border-zinc-800 pb-6">
			<p class="text-sm font-medium uppercase tracking-wide text-amber-400/90">Debug</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-tight">Monster inspector</h1>
			<p class="mt-2 text-zinc-400">
				Pick a template and level to preview the resolved runtime spec.
			</p>
		</header>

		<div class="grid items-start gap-8 lg:grid-cols-[minmax(17rem,280px)_minmax(0,1fr)]">
			<aside
				class="flex flex-col gap-4 lg:sticky lg:top-6 lg:z-10 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto"
			>
				<section
					class="rounded-xl border border-amber-500/20 bg-zinc-900/80 p-4 shadow-lg shadow-black/20"
				>
					<h2 class="text-sm font-medium uppercase tracking-wide text-amber-400/90">
						Configure
					</h2>

					<div class="mt-4 space-y-4">
						<label class="block">
							<span class="mb-1 block text-sm text-zinc-400">Monster</span>
							<select
								bind:value={monsterId}
								class="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
							>
								{#each monsterIds as id}
									<option value={id}>{MONSTERS[id].name} ({id})</option>
								{/each}
							</select>
						</label>

						<label class="block">
							<span class="mb-1 block text-sm text-zinc-400">Level</span>
							<input
								type="number"
								min="1"
								max="99"
								bind:value={level}
								class="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
							/>
						</label>
					</div>

					<dl class="mt-4 space-y-2 border-t border-zinc-800 pt-4 text-sm">
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">Points this level</dt>
							<dd class="font-mono">{getPointsPerLevel(level)}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">Total pool</dt>
							<dd class="font-mono">{statPointPool}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">Allocated</dt>
							<dd class="font-mono">{allocatedStatTotal}</dd>
						</div>
					</dl>
				</section>
				{#if spriteUrl}
					<div
						class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 p-4"
					>
						<p class="mb-3 text-xs uppercase tracking-wide text-zinc-500">Sprite</p>
						<img
							src={spriteUrl}
							alt="{monster.name} sprite"
							class="mx-auto max-h-48 w-auto image-pixelated"
						/>
					</div>
				{:else}
					<div
						class="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-6 text-center text-sm text-zinc-500"
					>
						No sprite at<br />
						<code class="text-xs">monsters/{monsterId}/sprites/</code>
					</div>
				{/if}

			</aside>

			<div class="min-w-0 space-y-6">
				<section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
					<h2 class="text-lg font-medium text-amber-300/90">Identity</h2>
					<dl class="mt-4 grid gap-3 sm:grid-cols-2">
						<div>
							<dt class="text-xs uppercase text-zinc-500">Name</dt>
							<dd class="mt-0.5 font-medium">{monster.name}</dd>
						</div>
						<div>
							<dt class="text-xs uppercase text-zinc-500">Template ID</dt>
							<dd class="mt-0.5 font-mono text-sm">{monster.monsterId}</dd>
						</div>
						<div>
							<dt class="text-xs uppercase text-zinc-500">Instance ID</dt>
							<dd class="mt-0.5 font-mono text-sm break-all">{monster.id}</dd>
						</div>
						<div>
							<dt class="text-xs uppercase text-zinc-500">Kind</dt>
							<dd class="mt-0.5">{monster.kind}</dd>
						</div>
						<div>
							<dt class="text-xs uppercase text-zinc-500">Level</dt>
							<dd class="mt-0.5">{monster.level}</dd>
						</div>
						<div>
							<dt class="text-xs uppercase text-zinc-500">Display</dt>
							<dd class="mt-0.5">{monster.displayLabel}</dd>
						</div>
						<div class="sm:col-span-2">
							<dt class="text-xs uppercase text-zinc-500">Description</dt>
							<dd class="mt-0.5 text-zinc-300">{spec.description}</dd>
						</div>
						<div>
							<dt class="text-xs uppercase text-zinc-500">Prompt path</dt>
							<dd class="mt-0.5 font-mono text-sm">{monster.promptPath}</dd>
						</div>
						<div>
							<dt class="text-xs uppercase text-zinc-500">Alive</dt>
							<dd class="mt-0.5">{monster.isAlive ? 'yes' : 'no'}</dd>
						</div>
					</dl>
				</section>

				<section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
					<h2 class="text-lg font-medium text-amber-300/90">Vitals</h2>
					<dl class="mt-4 grid gap-3 sm:grid-cols-2">
						<div>
							<dt class="text-xs uppercase text-zinc-500">HP</dt>
							<dd class="mt-0.5 font-mono">{monster.hp} / {monster.maxHp}</dd>
						</div>
						<div>
							<dt class="text-xs uppercase text-zinc-500">MP</dt>
							<dd class="mt-0.5 font-mono">{monster.sp} / {monster.maxSp}</dd>
						</div>
						<div>
							<dt class="text-xs uppercase text-zinc-500">Base vitals</dt>
							<dd class="mt-0.5 font-mono text-sm">
								HP {spec.baseVitals?.hp ?? 0}, MP {spec.baseVitals?.mp ?? 0}
							</dd>
						</div>
					</dl>
				</section>

				<section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
					<h2 class="text-lg font-medium text-amber-300/90">Stats (scales)</h2>
					<div class="mt-4 overflow-x-auto">
						<table class="w-full text-left text-sm">
							<thead class="border-b border-zinc-700 text-zinc-500">
								<tr>
									<th class="pb-2 pr-4 font-medium">Stat</th>
									<th class="pb-2 pr-4 font-medium">Value</th>
									<th class="pb-2 font-medium">Weight</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-zinc-800">
								{#each scaleKeys as key}
									<tr>
										<td class="py-2 pr-4 font-mono text-zinc-300">{key}</td>
										<td class="py-2 pr-4 font-mono">{spec.scales[key] ?? 0}</td>
										<td class="py-2 font-mono text-zinc-500">
											{definition.statWeights?.[key] != null
												? `${(definition.statWeights[key] * 100).toFixed(1)}%`
												: '—'}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</section>

				<section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
					<h2 class="text-lg font-medium text-amber-300/90">Skills</h2>
					{#if spec.skills?.length}
						<ul class="mt-4 space-y-2 text-sm text-zinc-300">
							{#each spec.skills as skill}
								<li class="rounded-lg bg-zinc-950/80 px-3 py-2">{describeSkill(skill)}</li>
							{/each}
						</ul>
					{:else}
						<p class="mt-4 text-sm text-zinc-500">No skills.</p>
					{/if}
				</section>

				<section class="grid gap-4 lg:grid-cols-2">
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
						<h2 class="text-sm font-medium text-zinc-400">Template definition</h2>
						<pre
							class="mt-3 max-h-80 overflow-auto rounded-lg bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-300">{formatJson(
								definition
							)}</pre>
					</div>
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
						<h2 class="text-sm font-medium text-zinc-400">Runtime spec</h2>
						<pre
							class="mt-3 max-h-80 overflow-auto rounded-lg bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-300">{formatJson(
								spec
							)}</pre>
					</div>
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
