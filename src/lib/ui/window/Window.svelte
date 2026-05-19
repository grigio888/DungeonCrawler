<script>
	import ButtonCircular from './ButtonCircular.svelte';

	/**
	 * @typedef {{
	 *   children: import('svelte').Snippet,
	 *   aside?: import('svelte').Snippet,
	 *   footer?: import('svelte').Snippet,
	 *   title?: string,
	 *   class?: string,
	 *   onTitleLeftClick?: (() => void) | undefined,
	 *   onTitleRightClick?: (() => void) | undefined
	 * }} Props
	 */

	/** @type {Props} */
	let {
		children,
		aside,
		footer,
		title = 'Basic Info',
		class: className = 'm-4 w-[21.5rem]',
		onTitleLeftClick = undefined,
		onTitleRightClick = undefined
	} = $props();
</script>

<div
	class="relative flex h-fit min-w-0 flex-col overflow-hidden rounded-sm border border-window-border shadow-[0_4px_14px_rgba(12,30,46,0.12)] {className}"
>
	<header
		class="relative flex items-center gap-1.5 border-b-2 border-gold bg-[linear-gradient(180deg,var(--color-title-top)_0%,var(--color-title-mid)_42%,var(--color-title-bottom)_100%)] px-1.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(0,0,0,0.15)] after:pointer-events-none after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px after:bg-[linear-gradient(90deg,transparent,var(--color-gold-dim),transparent)] after:content-['']"
	>
		<ButtonCircular class="size-3.5" aria-label="Pin window" onclick={onTitleLeftClick} />
		<h2
			class="min-w-0 flex-1 truncate text-center text-[11px] font-semibold tracking-[0.04em] text-title-text uppercase [text-shadow:0_1px_0_rgba(255,255,255,0.65),0_-1px_0_rgba(0,0,0,0.12)]"
		>
			{title}
		</h2>
		<ButtonCircular class="size-3.5" aria-label="Close window" onclick={onTitleRightClick} />
	</header>

	<main class="flex min-w-0">
		<section
			class="flex min-w-0 flex-1 flex-col gap-1 bg-[linear-gradient(180deg,var(--color-white)_0%,var(--color-parchment)_50%,var(--color-parchment-deep)_100%)] p-4 text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,1)]"
		>
			{@render children()}
		</section>

		{#if aside}
			<aside
				class="flex w-[5.75rem] shrink-0 flex-col border-l-2 border-[color-mix(in_srgb,var(--color-frame-light)_35%,transparent)] bg-[linear-gradient(180deg,var(--color-white)_0%,var(--color-parchment-aside)_100%)] p-1.5 shadow-[inset_4px_0_14px_rgba(255,255,255,0.9)]"
			>
				{@render aside()}
			</aside>
		{/if}
	</main>

	{#if footer}
		<footer
			class="flex w-full flex-col gap-1 border-t-2 border-[color-mix(in_srgb,var(--color-frame-light)_35%,transparent)] bg-[linear-gradient(180deg,var(--color-parchment-deep)_0%,var(--color-parchment-footer)_100%)] px-4 py-3 text-xs text-stone-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
		>
			{@render footer()}
		</footer>
	{/if}
</div>
