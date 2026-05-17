<script>
	import { SCALES } from '$lib/enums';
	import {
		ALLOCATABLE_SCALES,
		BASE_CHARACTER_STAT_VALUE,
		HP_PER_VITALITY,
		MP_PER_INTELLIGENCE,
		getBaseCharacterStatTotal,
		getExpectedCharacterStatTotal,
		getPointsPerLevel,
		getTotalStatPoints
	} from '$lib/progression';
	import CLASSES, { resolvePromptPath } from '$lib/classes';
	import { buildCharacterSpriteKey, resolveClassSpriteUrl } from '$lib/sprites';
	import { untrack } from 'svelte';
	import { GENDER, GENDER_VALUES, createCharacterSpec } from '$lib/characters';
	import SkillFactory from '$lib/skills/factory';

	const PREVIEW_ID = 'debug-character-preview';

	const classIds = Object.keys(CLASSES).sort();
	const scaleKeys = Object.values(SCALES);

	const sprites = import.meta.glob('$lib/classes/**/sprites/*.{png,webp,gif}', {
		eager: true,
		query: '?url',
		import: 'default'
	});

	let classId = $state(classIds[0] ?? 'peasant');
	let level = $state(1);
	let characterName = $state('Adventurer');
	let gender = $state(/** @type {import('$lib/characters').Gender} */ (GENDER.FEMALE));

	/** @type {import('$lib/characters/factory.js').CharacterSpec | null} */
	let previewSpec = $state(null);

	$effect(() => {
		const nextClassId = classId;
		const nextLevel = level;
		const nextName = characterName;
		const nextGender = gender;
		const prev = untrack(() => previewSpec);

		if (!prev || nextLevel < prev.level) {
			previewSpec = createCharacterSpec({
				id: PREVIEW_ID,
				classId: nextClassId,
				level: nextLevel,
				name: nextName,
				gender: nextGender
			});
			return;
		}

		if (
			prev.classId === nextClassId &&
			prev.level === nextLevel &&
			prev.name === nextName &&
			prev.gender === nextGender
		) {
			return;
		}

		previewSpec = createCharacterSpec({
			...prev,
			classId: nextClassId,
			level: nextLevel,
			name: nextName,
			gender: nextGender,
			scales: prev.scales,
			previousLevel: prev.level
		});
	});

	const definition = $derived(CLASSES[classId]);
	const spec = $derived(previewSpec);
	const character = $derived.by(() => {
		if (!spec) return null;

		return {
			id: spec.id,
			name: spec.name,
			gender: spec.gender,
			classId: spec.classId,
			level: spec.level,
			hp: spec.hp,
			maxHp: spec.maxHp,
			sp: spec.sp,
			maxSp: spec.maxSp,
			isAlive: spec.hp > 0,
			displayLabel: spec.subclassId
				? `${spec.name} (${spec.classId} / ${spec.subclassId})`
				: `${spec.name} (${spec.classId})`,
			promptPath: resolvePromptPath(spec.classId, spec.subclassId)
		};
	});
	const statPointPool = $derived(getTotalStatPoints(level));
	const expectedStatTotal = $derived(getExpectedCharacterStatTotal(level));

	const spriteUrl = $derived.by(() => {
		if (!spec) return null;

		const promptPath = resolvePromptPath(spec.classId, spec.subclassId);
		const spriteKey = buildCharacterSpriteKey(spec.gender, spec.position?.facing);
		return resolveClassSpriteUrl(sprites, promptPath, spriteKey);
	});

	const allocatedStatTotal = $derived(
		spec
			? scaleKeys.reduce((sum, key) => {
					if (key === SCALES.HP || key === SCALES.MP) return sum;
					return sum + (spec.scales[key] ?? 0);
				}, 0)
			: 0
	);

	const vitalBreakdown = $derived.by(() => {
		const extraLevels = Math.max(0, level - 1);
		const progression = definition?.vitalProgression;
		const baseHp = definition?.baseVitals?.hp ?? 0;
		const baseSp = definition?.baseVitals?.mp ?? 0;
		const hpFromLevel = extraLevels * (progression?.hpPerLevel ?? 0);
		const spFromLevel = extraLevels * (progression?.spPerLevel ?? 0);
		const hpFromVit = (spec?.scales[SCALES.VITALITY] ?? 0) * HP_PER_VITALITY;
		const spFromInt = (spec?.scales[SCALES.INTELLIGENCE] ?? 0) * MP_PER_INTELLIGENCE;

		return {
			extraLevels,
			baseHp,
			baseSp,
			hpFromLevel,
			spFromLevel,
			hpFromVit,
			spFromInt,
			hpPerLevel: progression?.hpPerLevel ?? 0,
			spPerLevel: progression?.spPerLevel ?? 0
		};
	});

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
	<title>Character debug</title>
</svelte:head>

<main class="min-h-screen bg-zinc-950 text-zinc-100">
	<div class="mx-auto max-w-6xl px-4 py-8">
		<header class="mb-8 border-b border-zinc-800 pb-6">
			<p class="text-sm font-medium tracking-wide text-emerald-400/90 uppercase">Debug</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-tight">Character inspector</h1>
			<p class="mt-2 text-zinc-400">
				Pick a class and level to preview stat allocation, vital progression, and runtime spec.
			</p>
		</header>

		<div class="grid items-start gap-8 lg:grid-cols-[minmax(17rem,280px)_minmax(0,1fr)]">
			<aside
				class="flex flex-col gap-4 lg:sticky lg:top-6 lg:z-10 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto"
			>
				<section
					class="rounded-xl border border-emerald-500/20 bg-zinc-900/80 p-4 shadow-lg shadow-black/20"
				>
					<h2 class="text-sm font-medium tracking-wide text-emerald-400/90 uppercase">Configure</h2>

					<div class="mt-4 space-y-4">
						<label class="block">
							<span class="mb-1 block text-sm text-zinc-400">Class</span>
							<select
								bind:value={classId}
								class="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
							>
								{#each classIds as id (id)}
									<option value={id}>{CLASSES[id].name} ({id})</option>
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

						<label class="block">
							<span class="mb-1 block text-sm text-zinc-400">Name</span>
							<input
								type="text"
								bind:value={characterName}
								class="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
							/>
						</label>

						<label class="block">
							<span class="mb-1 block text-sm text-zinc-400">Gender</span>
							<select
								bind:value={gender}
								class="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
							>
								{#each GENDER_VALUES as value (value)}
									<option {value}>{value}</option>
								{/each}
							</select>
						</label>
					</div>

					<dl class="mt-4 space-y-2 border-t border-zinc-800 pt-4 text-sm">
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">
								Base ({BASE_CHARACTER_STAT_VALUE}×{ALLOCATABLE_SCALES.length})
							</dt>
							<dd class="font-mono">{getBaseCharacterStatTotal()}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">Points this level</dt>
							<dd class="font-mono">{getPointsPerLevel(level)}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">Level-up pool</dt>
							<dd class="font-mono">{statPointPool}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">Stat total</dt>
							<dd class="font-mono">{allocatedStatTotal} / {expectedStatTotal}</dd>
						</div>
					</dl>

					<dl class="mt-4 space-y-2 border-t border-zinc-800 pt-4 text-sm">
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">HP / level</dt>
							<dd class="font-mono">+{vitalBreakdown.hpPerLevel}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">SP / level</dt>
							<dd class="font-mono">+{vitalBreakdown.spPerLevel}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-zinc-400">Level bonus</dt>
							<dd class="font-mono text-xs text-zinc-500">
								×{vitalBreakdown.extraLevels} after Lv.1
							</dd>
						</div>
					</dl>
				</section>

				{#if spriteUrl}
					<div class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
						<p class="mb-3 text-xs tracking-wide text-zinc-500 uppercase">Sprite</p>
						<img
							src={spriteUrl}
							alt="{character.name} sprite"
							class="image-pixelated mx-auto max-h-48 w-auto"
						/>
					</div>
				{:else}
					<div
						class="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-6 text-center text-sm text-zinc-500"
					>
						No sprite at<br />
						<code class="text-xs">classes/{definition?.promptPath ?? classId}/sprites/</code>
					</div>
				{/if}
			</aside>

			<div class="min-w-0 space-y-6">
				{#if character && spec}
					<section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
						<h2 class="text-lg font-medium text-emerald-300/90">Identity</h2>
						<dl class="mt-4 grid gap-3 sm:grid-cols-2">
							<div>
								<dt class="text-xs text-zinc-500 uppercase">Name</dt>
								<dd class="mt-0.5 font-medium">{character.name}</dd>
							</div>
							<div>
								<dt class="text-xs text-zinc-500 uppercase">Gender</dt>
								<dd class="mt-0.5 capitalize">{character.gender}</dd>
							</div>
							<div>
								<dt class="text-xs text-zinc-500 uppercase">Class</dt>
								<dd class="mt-0.5">{definition.name} ({character.classId})</dd>
							</div>
							<div>
								<dt class="text-xs text-zinc-500 uppercase">Instance ID</dt>
								<dd class="mt-0.5 font-mono text-sm break-all">{character.id}</dd>
							</div>
							<div>
								<dt class="text-xs text-zinc-500 uppercase">Tier</dt>
								<dd class="mt-0.5">{definition.tier}</dd>
							</div>
							<div>
								<dt class="text-xs text-zinc-500 uppercase">Level</dt>
								<dd class="mt-0.5">{character.level}</dd>
							</div>
							<div>
								<dt class="text-xs text-zinc-500 uppercase">Display</dt>
								<dd class="mt-0.5">{character.displayLabel}</dd>
							</div>
							<div class="sm:col-span-2">
								<dt class="text-xs text-zinc-500 uppercase">Description</dt>
								<dd class="mt-0.5 text-zinc-300">{definition.description}</dd>
							</div>
							<div>
								<dt class="text-xs text-zinc-500 uppercase">Prompt path</dt>
								<dd class="mt-0.5 font-mono text-sm">{character.promptPath}</dd>
							</div>
							<div>
								<dt class="text-xs text-zinc-500 uppercase">Alive</dt>
								<dd class="mt-0.5">{character.isAlive ? 'yes' : 'no'}</dd>
							</div>
						</dl>
					</section>

					<section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
						<h2 class="text-lg font-medium text-emerald-300/90">Vitals</h2>
						<dl class="mt-4 grid gap-3 sm:grid-cols-2">
							<div>
								<dt class="text-xs text-zinc-500 uppercase">HP</dt>
								<dd class="mt-0.5 font-mono">{character.hp} / {character.maxHp}</dd>
							</div>
							<div>
								<dt class="text-xs text-zinc-500 uppercase">SP</dt>
								<dd class="mt-0.5 font-mono">{character.sp} / {character.maxSp}</dd>
							</div>
						</dl>

						<div class="mt-5 overflow-x-auto">
							<table class="w-full text-left text-sm">
								<thead class="border-b border-zinc-700 text-zinc-500">
									<tr>
										<th class="pr-4 pb-2 font-medium">Component</th>
										<th class="pr-4 pb-2 text-right font-medium">HP</th>
										<th class="pb-2 text-right font-medium">SP</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-zinc-800 font-mono">
									<tr>
										<td class="py-2 pr-4 text-zinc-300">Base (Lv.1)</td>
										<td class="py-2 pr-4 text-right">{vitalBreakdown.baseHp}</td>
										<td class="py-2 text-right">{vitalBreakdown.baseSp}</td>
									</tr>
									<tr>
										<td class="py-2 pr-4 text-zinc-300">
											Class growth (×{vitalBreakdown.extraLevels})
										</td>
										<td class="py-2 pr-4 text-right">+{vitalBreakdown.hpFromLevel}</td>
										<td class="py-2 text-right">+{vitalBreakdown.spFromLevel}</td>
									</tr>
									<tr>
										<td class="py-2 pr-4 text-zinc-300">
											Stats (VIT×{HP_PER_VITALITY}, INT×{MP_PER_INTELLIGENCE})
										</td>
										<td class="py-2 pr-4 text-right">+{vitalBreakdown.hpFromVit}</td>
										<td class="py-2 text-right">+{vitalBreakdown.spFromInt}</td>
									</tr>
									<tr class="font-semibold text-emerald-300/90">
										<td class="py-2 pr-4">Max</td>
										<td class="py-2 pr-4 text-right">{character.maxHp}</td>
										<td class="py-2 text-right">{character.maxSp}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>

					<section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
						<h2 class="text-lg font-medium text-emerald-300/90">Stats (scales)</h2>
						<div class="mt-4 overflow-x-auto">
							<table class="w-full text-left text-sm">
								<thead class="border-b border-zinc-700 text-zinc-500">
									<tr>
										<th class="pr-4 pb-2 font-medium">Stat</th>
										<th class="pr-4 pb-2 font-medium">Value</th>
										<th class="pb-2 font-medium">Weight</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-zinc-800">
									{#each scaleKeys as key (key)}
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
						<h2 class="text-lg font-medium text-emerald-300/90">Skills</h2>
						{#if spec.skills?.length}
							<ul class="mt-4 space-y-2 text-sm text-zinc-300">
								{#each spec.skills as skill (skill)}
									<li class="rounded-lg bg-zinc-950/80 px-3 py-2">{describeSkill(skill)}</li>
								{/each}
							</ul>
						{:else}
							<p class="mt-4 text-sm text-zinc-500">No skills.</p>
						{/if}
					</section>

					<section class="grid gap-4 lg:grid-cols-2">
						<div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
							<h2 class="text-sm font-medium text-zinc-400">Class definition</h2>
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
				{/if}
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
