<script>
	import './window-theme.css';

	/**
	 * @typedef {{
	 *   label?: string,
	 *   value?: number,
	 *   max?: number,
	 *   percent?: number,
	 *   variant?: 'pill' | 'thin',
	 *   showCaption?: boolean,
	 *   class?: string
	 * }} Props
	 */

	/** @type {Props} */
	let {
		label = '',
		value,
		max,
		percent,
		variant = 'pill',
		showCaption = false,
		class: className = ''
	} = $props();

	const fillPercent = $derived.by(() => {
		if (percent != null) {
			return Math.max(0, Math.min(100, percent));
		}
		if (max == null || max <= 0) {
			return 0;
		}
		const current = value ?? 0;
		return Math.max(0, Math.min(100, (current / max) * 100));
	});

	const caption = $derived(
		showCaption && value != null && max != null ? `${value} / ${max}` : ''
	);

	const trackClass =
		variant === 'pill'
			? 'game-bar__track relative h-3.5 min-w-0 flex-1 overflow-hidden rounded-full'
			: 'game-bar__track h-2 min-w-0 flex-1 overflow-hidden rounded-full';

	const labelClass =
		variant === 'pill' ? 'game-bar__label w-4 shrink-0 text-[9px]' : 'game-bar__label w-[4.5rem] shrink-0 text-[9px]';
</script>

{#if variant === 'pill'}
	<div class="flex min-w-0 flex-1 flex-col gap-0.5 {className}">
		<div class="flex items-center gap-1">
			<span class={labelClass}>{label}</span>
			<div class={trackClass}>
				<div
					class="game-bar__fill relative h-full rounded-full transition-[width] duration-300 ease-out"
					style="width: {fillPercent}%"
				></div>
			</div>
		</div>
		{#if caption}
			<p class="text-center text-[9px] leading-none font-medium text-stone-700">{caption}</p>
		{/if}
	</div>
{:else}
	<div class="flex items-center gap-1.5 {className}">
		<span class={labelClass}>{label}</span>
		<div class={trackClass}>
			<div
				class="game-bar__fill relative h-full rounded-full transition-[width] duration-300 ease-out"
				style="width: {fillPercent}%"
			></div>
		</div>
	</div>
{/if}
