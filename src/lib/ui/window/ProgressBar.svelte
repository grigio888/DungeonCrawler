<script>
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
			? 'relative h-3.5 min-w-0 flex-1 overflow-hidden rounded-full border border-[#0d0a08] bg-[linear-gradient(180deg,#1a1410_0%,var(--color-bar-track)_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.08)]'
			: 'h-2 min-w-0 flex-1 overflow-hidden rounded-full border border-[#0d0a08] bg-[linear-gradient(180deg,#1a1410_0%,var(--color-bar-track)_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.08)]';

	const labelClass =
		variant === 'pill'
			? 'w-4 shrink-0 text-[9px] font-bold text-[#4a3a28] [text-shadow:0_1px_0_rgba(255,255,255,0.7)]'
			: 'w-[4.5rem] shrink-0 text-[9px] font-bold text-[#4a3a28] [text-shadow:0_1px_0_rgba(255,255,255,0.7)]';

	const fillClass =
		"relative h-full rounded-full bg-[linear-gradient(180deg,var(--color-bar-fill-top)_0%,var(--color-bar-fill-bottom)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_6px_rgba(62,152,220,0.35)] transition-[width] duration-300 ease-out after:pointer-events-none after:absolute after:inset-x-0 after:top-px after:h-[40%] after:rounded-[inherit] after:bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,transparent_100%)] after:content-['']";
</script>

{#if variant === 'pill'}
	<div class="flex min-w-0 flex-1 flex-col gap-0.5 {className}">
		<div class="flex items-center gap-1">
			<span class={labelClass}>{label}</span>
			<div class={trackClass}>
				<div class={fillClass} style="width: {fillPercent}%"></div>
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
			<div class={fillClass} style="width: {fillPercent}%"></div>
		</div>
	</div>
{/if}
