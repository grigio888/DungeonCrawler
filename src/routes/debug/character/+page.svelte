<script>
	import { SCALES } from '$lib/core/enum/stats.js';
	import {
		ALLOCATABLE_SCALES,
		BASE_CHARACTER_STAT_VALUE,
		HP_PER_VITALITY,
		MP_PER_INTELLIGENCE,
		getBaseCharacterStatTotal,
		getExpectedCharacterStatTotal,
		getPointsPerLevel,
		getTotalStatPoints
	} from '$lib/game/progression';
	import CLASSES, { resolvePromptPath } from '$lib/content/classes';
	import ClassSpritePreview from '$lib/ui/debug/ClassSpritePreview.svelte';
	import { untrack } from 'svelte';
	import { GENDER, GENDER_VALUES, createCharacterSpec } from '$lib/game/entities/character';
	import SkillFactory from '$lib/content/skills/factory';
	import Window from '$lib/ui/window/Window.svelte';

	const PREVIEW_ID = 'debug-character-preview';

	const classIds = Object.keys(CLASSES).sort();
	const scaleKeys = Object.values(SCALES);

	let classId = $state(classIds[0] ?? 'peasant');
	let level = $state(1);
	let characterName = $state('Adventurer');
	let gender = $state(/** @type {import('$lib/game/entities/character').Gender} */ (GENDER.FEMALE));

	/** @type {import('$lib/game/entities/character/factory.js').CharacterSpec | null} */
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
	const spritePromptPath = $derived(resolvePromptPath(classId, null));
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

<main>
	<div class="mx-auto max-w-6xl px-4 py-8">
		<header class="mb-8 border-b border-border pb-6">
			<p class="text-sm font-medium tracking-wide text-title-mid uppercase">Debug</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-tight text-frame-dark">Character inspector</h1>
			<p class="mt-2 text-text-muted">
				Pick a class and level to preview stat allocation, vital progression, and runtime spec.
			</p>
		</header>

		<div class="grid items-start gap-4 lg:grid-cols-[minmax(17rem,280px)_minmax(0,1fr)]">
			<aside
				class="flex min-h-0 flex-col gap-4 lg:sticky lg:top-6 lg:z-10 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto"
			>
				<Window title="Configure" class="m-0 w-full min-w-0 max-w-none shrink-0">
					<div class="space-y-4">
						<label class="block">
							<span class="mb-1 block text-sm text-text-muted">Class</span>
							<select
								bind:value={classId}
								class="w-full rounded-lg border border-border-strong bg-white px-3 py-2 text-frame-dark focus:border-title-mid focus:outline-none"
							>
								{#each classIds as id (id)}
									<option value={id}>{CLASSES[id].name} ({id})</option>
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

						<label class="block">
							<span class="mb-1 block text-sm text-text-muted">Name</span>
							<input
								type="text"
								bind:value={characterName}
								class="w-full rounded-lg border border-border-strong bg-white px-3 py-2 text-frame-dark focus:border-title-mid focus:outline-none"
							/>
						</label>

						<label class="block">
							<span class="mb-1 block text-sm text-text-muted">Gender</span>
							<select
								bind:value={gender}
								class="w-full rounded-lg border border-border-strong bg-white px-3 py-2 text-frame-dark focus:border-title-mid focus:outline-none"
							>
								{#each GENDER_VALUES as value (value)}
									<option {value}>{value}</option>
								{/each}
							</select>
						</label>
					</div>

					<dl class="mt-4 space-y-2 border-t border-border pt-4 text-sm">
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">
								Base ({BASE_CHARACTER_STAT_VALUE}×{ALLOCATABLE_SCALES.length})
							</dt>
							<dd class="font-mono">{getBaseCharacterStatTotal()}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">Points this level</dt>
							<dd class="font-mono">{getPointsPerLevel(level)}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">Level-up pool</dt>
							<dd class="font-mono">{statPointPool}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">Stat total</dt>
							<dd class="font-mono">{allocatedStatTotal} / {expectedStatTotal}</dd>
						</div>
					</dl>

					<dl class="mt-4 space-y-2 border-t border-border pt-4 text-sm">
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">HP / level</dt>
							<dd class="font-mono">+{vitalBreakdown.hpPerLevel}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">SP / level</dt>
							<dd class="font-mono">+{vitalBreakdown.spPerLevel}</dd>
						</div>
						<div class="flex justify-between gap-2">
							<dt class="text-text-muted">Level bonus</dt>
							<dd class="font-mono text-xs text-text-subtle">
								×{vitalBreakdown.extraLevels} after Lv.1
							</dd>
						</div>
					</dl>
				</Window>
			</aside>

			<div class="grid min-w-0 gap-4">
				{#if character && spec}
					<Window title="Identity" class="m-0 w-full min-w-0 max-w-none">
						<div class="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)]">
							<dl class="grid gap-3 sm:grid-cols-2">
							<div>
								<dt class="text-xs text-text-subtle uppercase">Name</dt>
								<dd class="mt-0.5 font-medium">{character.name}</dd>
							</div>
							<div>
								<dt class="text-xs text-text-subtle uppercase">Gender</dt>
								<dd class="mt-0.5 capitalize">{character.gender}</dd>
							</div>
							<div>
								<dt class="text-xs text-text-subtle uppercase">Class</dt>
								<dd class="mt-0.5">{definition.name} ({character.classId})</dd>
							</div>
							<div>
								<dt class="text-xs text-text-subtle uppercase">Instance ID</dt>
								<dd class="mt-0.5 font-mono text-sm break-all">{character.id}</dd>
							</div>
							<div>
								<dt class="text-xs text-text-subtle uppercase">Tier</dt>
								<dd class="mt-0.5">{definition.tier}</dd>
							</div>
							<div>
								<dt class="text-xs text-text-subtle uppercase">Level</dt>
								<dd class="mt-0.5">{character.level}</dd>
							</div>
							<div>
								<dt class="text-xs text-text-subtle uppercase">Display</dt>
								<dd class="mt-0.5">{character.displayLabel}</dd>
							</div>
							<div class="sm:col-span-2">
								<dt class="text-xs text-text-subtle uppercase">Description</dt>
								<dd class="mt-0.5 text-frame">{definition.description}</dd>
							</div>
							<div>
								<dt class="text-xs text-text-subtle uppercase">Prompt path</dt>
								<dd class="mt-0.5 font-mono text-sm">{character.promptPath}</dd>
							</div>
							<div>
								<dt class="text-xs text-text-subtle uppercase">Alive</dt>
								<dd class="mt-0.5">{character.isAlive ? 'yes' : 'no'}</dd>
							</div>
							</dl>

							{#key `${spritePromptPath}-${gender}`}
								<ClassSpritePreview promptPath={spritePromptPath} {gender} />
							{/key}
						</div>
					</Window>

					<Window title="Vitals" class="m-0 w-full min-w-0 max-w-none">
						<dl class="grid gap-3 sm:grid-cols-2">
							<div>
								<dt class="text-xs text-text-subtle uppercase">HP</dt>
								<dd class="mt-0.5 font-mono">{character.hp} / {character.maxHp}</dd>
							</div>
							<div>
								<dt class="text-xs text-text-subtle uppercase">SP</dt>
								<dd class="mt-0.5 font-mono">{character.sp} / {character.maxSp}</dd>
							</div>
						</dl>

						<div class="mt-3 overflow-x-auto">
							<table class="w-full text-left text-sm">
								<thead class="border-b border-border-strong text-text-subtle">
									<tr>
										<th class="pr-4 pb-2 font-medium">Component</th>
										<th class="pr-4 pb-2 text-right font-medium">HP</th>
										<th class="pb-2 text-right font-medium">SP</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-border font-mono">
									<tr>
										<td class="py-2 pr-4 text-frame">Base (Lv.1)</td>
										<td class="py-2 pr-4 text-right">{vitalBreakdown.baseHp}</td>
										<td class="py-2 text-right">{vitalBreakdown.baseSp}</td>
									</tr>
									<tr>
										<td class="py-2 pr-4 text-frame">
											Class growth (×{vitalBreakdown.extraLevels})
										</td>
										<td class="py-2 pr-4 text-right">+{vitalBreakdown.hpFromLevel}</td>
										<td class="py-2 text-right">+{vitalBreakdown.spFromLevel}</td>
									</tr>
									<tr>
										<td class="py-2 pr-4 text-frame">
											Stats (VIT×{HP_PER_VITALITY}, INT×{MP_PER_INTELLIGENCE})
										</td>
										<td class="py-2 pr-4 text-right">+{vitalBreakdown.hpFromVit}</td>
										<td class="py-2 text-right">+{vitalBreakdown.spFromInt}</td>
									</tr>
									<tr class="font-semibold text-title-bottom">
										<td class="py-2 pr-4">Max</td>
										<td class="py-2 pr-4 text-right">{character.maxHp}</td>
										<td class="py-2 text-right">{character.maxSp}</td>
									</tr>
								</tbody>
							</table>
						</div>
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
						<Window title="Class definition" class="m-0 w-full min-w-0 max-w-none">
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
				{/if}
			</div>
		</div>
	</div>
</main>

