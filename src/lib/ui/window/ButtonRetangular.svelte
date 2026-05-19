<script>
	/**
	 * @typedef {{
	 *   label?: string,
	 *   children?: import('svelte').Snippet,
	 *   class?: string,
	 *   onclick?: (event: MouseEvent) => void,
	 *   type?: 'button' | 'submit' | 'reset',
	 *   disabled?: boolean,
	 *   selected?: boolean,
	 *   'aria-label'?: string
	 * }} Props
	 */

	/** @type {Props} */
	let {
		label = '',
		children,
		class: className = '',
		onclick,
		type = 'button',
		disabled = false,
		selected = false,
		'aria-label': ariaLabel = undefined
	} = $props();

	const faceBase =
		"relative inline-flex min-h-[1.625rem] w-full items-center justify-center rounded-[3px] border border-btn-border px-[0.7rem] py-[0.3rem] text-[10px] leading-[1.2] font-semibold tracking-[0.05em] uppercase text-btn-text shadow-[0_1px_2px_rgba(12,30,46,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] transition-[background,box-shadow,transform,color,border-color] duration-[140ms,140ms,80ms,140ms,140ms] before:pointer-events-none before:absolute before:top-px before:right-[10%] before:left-[10%] before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)] before:content-['']";

	const faceDefault =
		'bg-[linear-gradient(180deg,var(--color-btn-top)_0%,var(--color-btn-mid)_48%,var(--color-btn-bottom)_100%)] group-enabled:group-hover:border-title-mid group-enabled:group-hover:bg-[linear-gradient(180deg,var(--color-btn-hover-top)_0%,var(--color-btn-hover-mid)_48%,var(--color-btn-hover-bottom)_100%)] group-enabled:group-hover:shadow-[0_1px_3px_rgba(42,109,173,0.2),inset_0_1px_0_rgba(255,255,255,0.85)] group-enabled:group-active:translate-y-px group-enabled:group-active:shadow-[inset_0_1px_3px_rgba(12,30,46,0.12)] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-title-mid';

	const faceSelected =
		'border-title-mid bg-[linear-gradient(180deg,var(--color-btn-selected-top)_0%,var(--color-btn-selected-mid)_48%,var(--color-btn-selected-bottom)_100%)] shadow-[0_0_0_1px_var(--color-title-mid),0_1px_4px_rgba(42,109,173,0.25),inset_0_1px_0_rgba(255,255,255,0.8)]';

	const faceDisabled =
		'border-border-strong bg-parchment-aside text-text-subtle opacity-80 shadow-none';
</script>

<button
	{type}
	{disabled}
	{onclick}
	aria-label={ariaLabel}
	class="group relative cursor-pointer border-none bg-transparent p-0 disabled:cursor-not-allowed {className}"
>
	<span class="{faceBase} {disabled ? faceDisabled : selected ? faceSelected : faceDefault}">
		{#if children}
			{@render children()}
		{:else}
			{label}
		{/if}
	</span>
</button>
