<script>
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import CLASSES, { resolvePromptPath } from '$lib/content/classes';
	import { buildCharacterSpriteKey, resolveClassSpriteUrl } from '$lib/game/presentation/sprites';
	import { GENDER, GENDER_VALUES } from '$lib/game/entities/character';
	import Window from '$lib/ui/window/Window.svelte';
	import ButtonRetangular from '$lib/ui/window/ButtonRetangular.svelte';

	let { data, form } = $props();

	const classIds = Object.keys(CLASSES).sort();

	const sprites = import.meta.glob('$lib/content/classes/**/sprites/*.{png,webp,gif}', {
		eager: true,
		query: '?url',
		import: 'default'
	});

	let createName = $state('Adventurer');
	let createClassId = $state(classIds[0] ?? 'peasant');
	let createLevel = $state(1);
	let createGender = $state(/** @type {import('$lib/game/entities/character').Gender} */ (GENDER.FEMALE));

	let deletingId = $state(/** @type {string | null} */ (null));

	const selectedSprite = $derived.by(() => {
		const spec = data.selected;
		if (!spec) return null;

		const promptPath = resolvePromptPath(spec.classId, spec.subclassId);
		const spriteKey = buildCharacterSpriteKey(spec.gender, spec.position?.facing);

		return {
			key: spriteKey,
			url: resolveClassSpriteUrl(sprites, promptPath, spriteKey, spec.gender),
			path: `classes/${promptPath}/sprites/${spriteKey}.png`
		};
	});

	/**
	 * @param {unknown} value
	 */
	function formatJson(value) {
		return JSON.stringify(value, null, 2);
	}
</script>

<svelte:head>
	<title>Character roster — debug</title>
</svelte:head>

<main class="min-h-screen bg-zinc-950 text-zinc-100">
	<div class="mx-auto max-w-6xl px-4 py-8">
		<header class="mb-8 border-b border-zinc-800 pb-6">
			<p class="text-sm font-medium tracking-wide text-sky-400/90 uppercase">Debug</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-tight">Character roster</h1>
			<p class="mt-2 text-zinc-400">
				Create, browse, and delete saved characters in the database.
			</p>
		</header>

		{#if form?.message}
			<p
				class="mb-6 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200"
				role="alert"
			>
				{form.message}
			</p>
		{/if}

		<div class="grid items-start gap-8 lg:grid-cols-[minmax(17rem,280px)_minmax(14rem,220px)_minmax(0,1fr)]">
			<aside class="flex flex-col gap-4">
				<Window title="New character" class="m-0 w-full min-w-0 max-w-none">
					<form
						method="POST"
						action="?/create"
						class="space-y-4"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
							};
						}}
					>
						<label class="block">
							<span class="mb-1 block text-sm text-zinc-400">Name</span>
							<input
								type="text"
								name="name"
								bind:value={createName}
								class="w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-zinc-900"
							/>
						</label>

						<label class="block">
							<span class="mb-1 block text-sm text-zinc-400">Class</span>
							<select
								name="classId"
								bind:value={createClassId}
								class="w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-zinc-900"
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
								name="level"
								min="1"
								max="99"
								bind:value={createLevel}
								class="w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-zinc-900"
							/>
						</label>

						<label class="block">
							<span class="mb-1 block text-sm text-zinc-400">Gender</span>
							<select
								name="gender"
								bind:value={createGender}
								class="w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-zinc-900"
							>
								{#each GENDER_VALUES as value (value)}
									<option {value}>{value}</option>
								{/each}
							</select>
						</label>

						<ButtonRetangular type="submit" label="create & save" class="w-full" />
					</form>
				</Window>

				<p class="text-xs text-zinc-500">
					{data.characters.length} character{data.characters.length === 1 ? '' : 's'} saved.
				</p>
			</aside>

			<Window title="Saved" class="m-0 w-full min-w-0 max-w-none">
				{#if data.characters.length === 0}
					<p class="px-2 py-8 text-center text-sm text-zinc-500">No characters yet.</p>
				{:else}
					<ul class="max-h-[min(32rem,calc(100vh-12rem))] divide-y divide-zinc-800 overflow-y-auto">
						{#each data.characters as character (character.id)}
							<li>
								<a
									href="{resolve('/debug/roster')}?id={encodeURIComponent(character.id)}"
									class="block px-4 py-3 transition-colors {data.selectedId === character.id
										? 'bg-sky-950/50 text-sky-100'
										: 'text-zinc-300 hover:bg-zinc-800/60'}"
								>
									<p class="font-medium">{character.name}</p>
									<p class="mt-0.5 text-xs text-zinc-500">
										Lv.{character.level} {CLASSES[character.classId]?.name ?? character.classId}
										· {character.gender}
									</p>
									<p class="mt-1 font-mono text-xs text-zinc-600">
										HP {character.hp}/{character.maxHp} · SP {character.sp}/{character.maxSp}
									</p>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</Window>

			<Window
				title={data.selected?.name ?? 'Character'}
				class="m-0 min-w-0 w-full max-w-none"
			>
				{#if data.selected}
					{@const spec = data.selected}
					<div class="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-3">
						<div class="min-w-0">
							<p class="mt-1 text-sm text-zinc-400">
								{CLASSES[spec.classId]?.name ?? spec.classId} · Lv.{spec.level} · {spec.gender}
							</p>
							<p class="mt-1 font-mono text-xs text-zinc-600">{spec.id}</p>
						</div>

						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								deletingId = spec.id;
								return async ({ update }) => {
									deletingId = null;
									await update();
								};
							}}
						>
							<input type="hidden" name="id" value={spec.id} />
							<ButtonRetangular
								type="submit"
								disabled={deletingId === spec.id}
								label={deletingId === spec.id ? 'deleting…' : 'delete'}
								onclick={(event) => {
									if (!confirm(`Delete ${spec.name}? This cannot be undone.`)) {
										event.preventDefault();
									}
								}}
							/>
						</form>
					</div>

					<div class="border-b border-zinc-200 py-3">
						<p class="mb-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">Sprite</p>

						<div
							class="mx-auto flex h-80 w-80 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 p-4"
						>
							{#if selectedSprite?.url}
								<img
									src={selectedSprite.url}
									alt="{spec.name} sprite"
									class="image-pixelated h-full w-full object-contain"
								/>
							{:else}
								<div class="px-2 text-center text-xs text-zinc-500">
									<p>No sprite file</p>
									<p class="mt-2 font-mono text-[10px] text-zinc-600">
										{selectedSprite?.path ?? '—'}
									</p>
								</div>
							{/if}
						</div>
					</div>

					<div class="grid gap-6 py-3 sm:grid-cols-2">
						<dl class="space-y-2 text-sm">
							<div class="flex justify-between gap-2">
								<dt class="text-zinc-400">HP</dt>
								<dd class="font-mono">{spec.hp} / {spec.maxHp}</dd>
							</div>
							<div class="flex justify-between gap-2">
								<dt class="text-zinc-400">SP</dt>
								<dd class="font-mono">{spec.sp} / {spec.maxSp}</dd>
							</div>
							<div class="flex justify-between gap-2">
								<dt class="text-zinc-400">Job level</dt>
								<dd class="font-mono">{spec.jobLevel}</dd>
							</div>
							<div class="flex justify-between gap-2">
								<dt class="text-zinc-400">Zeny</dt>
								<dd class="font-mono">{spec.zeny}</dd>
							</div>
							<div class="flex justify-between gap-2">
								<dt class="text-zinc-400">Skill points</dt>
								<dd class="font-mono">{spec.skillPoints}</dd>
							</div>
						</dl>

						<div>
							<h3 class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">
								Class history
							</h3>
							<ul class="space-y-1 text-sm text-zinc-300">
								{#each spec.classHistory ?? [] as [historyClassId, historyLevel], index (index)}
									<li class="font-mono text-xs">
										{CLASSES[historyClassId]?.name ?? historyClassId} @ Lv.{historyLevel}
										{#if index === (spec.classHistory?.length ?? 0) - 1}
											<span class="text-emerald-400/80"> · current</span>
										{/if}
									</li>
								{:else}
									<li class="text-zinc-500">None</li>
								{/each}
							</ul>
						</div>

						<div>
							<h3 class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">Skills</h3>
							<ul class="space-y-1 text-sm">
								{#each spec.skills as skill (skill)}
									<li class="font-mono text-xs">{skill}</li>
								{:else}
									<li class="text-zinc-500">None</li>
								{/each}
							</ul>
						</div>
					</div>

					<div class="border-t border-zinc-200 pt-3">
						<h3 class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">Full spec</h3>
						<pre
							class="max-h-80 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-400">{formatJson(
								spec
							)}</pre>
					</div>
				{:else if data.selectedId}
					<p class="py-12 text-center text-sm text-zinc-500">
						Character not found. It may have been deleted.
					</p>
				{:else}
					<p class="py-12 text-center text-sm text-zinc-500">
						Select a character from the list, or create a new one.
					</p>
				{/if}
			</Window>
		</div>
	</div>
</main>

<style>
	.image-pixelated {
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}
</style>
