<script>
	import {
		buildCharacterSpriteKey,
		listClassSpriteOptions,
		resolveClassSpriteUrl
	} from '$lib/sprites';

	/**
	 * @type {{
	 *   promptPath: string,
	 *   gender: import('$lib/characters').Gender
	 * }}
	 */
	let { promptPath, gender } = $props();

	const sprites = import.meta.glob('$lib/classes/**/sprites/*.{png,webp,gif}', {
		eager: true,
		query: '?url',
		import: 'default'
	});

	let previewAnimation = $state('idle');
	let previewFacing = $state('sw');
	let cycleFacings = $state(false);

	const spriteOptions = $derived(listClassSpriteOptions(sprites, promptPath, gender));

	const previewFacings = $derived(
		spriteOptions.facingsByAnimation[previewAnimation] ?? []
	);

	$effect(() => {
		promptPath;
		gender;
		cycleFacings = false;

		const options = spriteOptions;
		if (options.animations.length === 0) {
			previewAnimation = 'idle';
			previewFacing = 'sw';
			return;
		}

		const preferredAnimation = options.animations.includes('idle') ? 'idle' : options.animations[0];
		previewAnimation = preferredAnimation;

		const facings = options.facingsByAnimation[preferredAnimation] ?? [];
		previewFacing = facings[0] ?? 'sw';
	});

	$effect(() => {
		const facings = previewFacings;
		if (facings.length === 0) return;
		if (!facings.includes(previewFacing)) {
			previewFacing = facings[0];
		}
	});

	$effect(() => {
		const facings = previewFacings;
		const enabled = cycleFacings;
		previewAnimation;

		if (!enabled || facings.length <= 1) return;

		const intervalId = setInterval(() => {
			const index = facings.indexOf(previewFacing);
			const nextIndex = index < 0 ? 0 : (index + 1) % facings.length;
			previewFacing = facings[nextIndex];
		}, 700);

		return () => clearInterval(intervalId);
	});

	const previewSprite = $derived.by(() => {
		const spriteKey = buildCharacterSpriteKey(gender, previewFacing, previewAnimation);

		return {
			key: spriteKey,
			url: resolveClassSpriteUrl(sprites, promptPath, spriteKey, gender),
			path: `classes/${promptPath}/sprites/${spriteKey}.png`
		};
	});
</script>

<div class="min-w-0">
	<p class="mb-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">Sprite</p>

	{#if spriteOptions.animations.length > 0}
		<div class="mb-4 space-y-3">
			<label class="block text-sm">
				<span class="mb-1.5 block text-xs tracking-wide text-zinc-500 uppercase">Animation</span>
				<select
					bind:value={previewAnimation}
					class="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 capitalize focus:border-emerald-500/50 focus:outline-none"
				>
					{#each spriteOptions.animations as animation (animation)}
						<option value={animation}>{animation}</option>
					{/each}
				</select>
			</label>

			{#if previewFacings.length > 0}
				<div>
					<span class="mb-1.5 block text-xs tracking-wide text-zinc-500 uppercase">Facing</span>
					<div class="flex flex-wrap gap-1.5">
						{#each previewFacings as facing (facing)}
							<button
								type="button"
								class="rounded-md border px-2.5 py-1 font-mono text-xs uppercase transition {previewFacing ===
								facing
									? 'border-emerald-500/60 bg-emerald-950/60 text-emerald-100'
									: 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'}"
								onclick={() => {
									previewFacing = facing;
								}}
							>
								{facing}
							</button>
						{/each}
						<button
							type="button"
							disabled={previewFacings.length <= 1}
							class="inline-flex items-center justify-center rounded-md border p-1.5 transition disabled:cursor-not-allowed disabled:opacity-40 {cycleFacings
								? 'border-emerald-500/60 bg-emerald-950/50 text-emerald-100'
								: 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'}"
							aria-label={cycleFacings ? 'Stop cycling facings' : 'Cycle facings'}
							title={cycleFacings ? 'Stop cycling facings' : 'Cycle facings'}
							aria-pressed={cycleFacings}
							onclick={() => {
								cycleFacings = !cycleFacings;
							}}
						>
							<svg
								class="h-4 w-4 {cycleFacings ? 'animate-spin' : ''}"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path d="M21 12a9 9 0 1 1-3-6.7" />
								<polyline points="21 3 21 9 15 9" />
								<path d="M3 12a9 9 0 1 1 3 6.7" />
								<polyline points="3 21 3 15 9 15" />
							</svg>
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div
		class="flex min-h-[18rem] w-full items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 p-4"
	>
		{#if previewSprite.url}
			{#key previewSprite.key}
				<img
					src={previewSprite.url}
					alt="Class sprite preview"
					class="image-pixelated max-h-72 w-full object-contain"
				/>
			{/key}
		{:else}
			<p class="px-2 text-center text-xs text-zinc-500">
				No sprite at<br />
				<code class="text-[10px]">{previewSprite.path}</code>
			</p>
		{/if}
	</div>

	<p class="mt-2 text-center font-mono text-[10px] text-zinc-600">{previewSprite.key}</p>
</div>

<style>
	.image-pixelated {
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}
</style>
