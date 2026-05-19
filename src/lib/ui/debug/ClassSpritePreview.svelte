<script>
	import {
		buildCharacterSpriteKey,
		listClassSpriteOptions,
		resolveClassSpriteUrl
	} from '$lib/game/presentation/sprites';
	import ButtonRetangular from '$lib/ui/window/ButtonRetangular.svelte';

	/**
	 * @type {{
	 *   promptPath: string,
	 *   gender: import('$lib/game/entities/character').Gender
	 * }}
	 */
	let { promptPath, gender } = $props();

	const sprites = import.meta.glob('$lib/content/classes/**/sprites/*.{png,webp,gif}', {
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
			path: `content/classes/${promptPath}/sprites/${spriteKey}.png`
		};
	});
</script>

<div class="min-w-0">
	{#if spriteOptions.animations.length > 0}
		<div class="mb-4 space-y-3">
			<label class="block text-sm">
				<span class="mb-1.5 block text-xs tracking-wide text-text-subtle uppercase">Animation</span>
				<select
					bind:value={previewAnimation}
					class="w-full rounded-lg border border-border-strong bg-white px-3 py-2 font-mono text-sm text-frame-dark capitalize focus:border-title-mid focus:outline-none"
				>
					{#each spriteOptions.animations as animation (animation)}
						<option value={animation}>{animation}</option>
					{/each}
				</select>
			</label>

			{#if previewFacings.length > 0}
				<div>
					<span class="mb-1.5 block text-xs tracking-wide text-text-subtle uppercase">Facing</span>
					<div class="flex flex-wrap gap-1.5">
						{#each previewFacings as facing (facing)}
							<ButtonRetangular
								label={facing}
								selected={previewFacing === facing}
								class="font-mono uppercase"
								onclick={() => {
									previewFacing = facing;
								}}
							/>
						{/each}
						<ButtonRetangular
							disabled={previewFacings.length <= 1}
							aria-label={cycleFacings ? 'Stop cycling facings' : 'Cycle facings'}
							class="inline-flex items-center justify-center px-1.5"
							onclick={() => {
								cycleFacings = !cycleFacings;
							}}
						>
							{#snippet children()}
								<svg
									class="h-3.5 w-3.5 {cycleFacings ? 'animate-spin' : ''}"
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
							{/snippet}
						</ButtonRetangular>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div
		class="flex min-h-[18rem] w-full items-center justify-center rounded-xl border border-border-strong bg-surface-code p-4"
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
			<p class="px-2 text-center text-xs text-text-subtle">
				No sprite at<br />
				<code class="text-[10px]">{previewSprite.path}</code>
			</p>
		{/if}
	</div>

	<p class="mt-2 text-center font-mono text-[10px] text-text-subtle">{previewSprite.key}</p>
</div>

<style>
	.image-pixelated {
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}
</style>
